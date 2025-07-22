import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected");
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < 5) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  };

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "order_updated":
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        toast({
          title: "Order Updated",
          description: `Order #${message.data.id} status changed to ${message.data.status}`,
        });
        break;

      case "inventory_low_stock":
        queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
        toast({
          title: "Low Stock Alert",
          description: `${message.data.name} is running low (${message.data.currentStock} remaining)`,
          variant: "destructive",
        });
        break;

      case "new_customer":
        queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
        toast({
          title: "New Customer",
          description: `${message.data.name} has registered`,
        });
        break;

      case "promotion_expired":
        queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
        toast({
          title: "Promotion Expired",
          description: `${message.data.name} has expired`,
        });
        break;

      case "notification":
        queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
        toast({
          title: message.data.title,
          description: message.data.message,
          variant: message.data.type === "error" ? "destructive" : "default",
        });
        break;

      case "machine_status":
        queryClient.invalidateQueries({ queryKey: ["/api/machines"] });
        if (message.data.status === "error") {
          toast({
            title: "Machine Error",
            description: `${message.data.name} needs attention`,
            variant: "destructive",
          });
        }
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  };

  const sendMessage = (type: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    sendMessage,
  };
}