import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws.current = new WebSocket(wsUrl);
    
    ws.current.onopen = () => {
      setIsConnected(true);
    };
    
    ws.current.onclose = () => {
      setIsConnected(false);
    };
    
    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };
    
    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Lost connection to server. Some features may not work properly.",
        variant: "destructive",
      });
    };
    
    return () => {
      ws.current?.close();
    };
  }, [toast]);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "ORDER_CREATED":
        toast({
          title: "New Order",
          description: `Order ${message.order?.orderNumber} has been created.`,
        });
        break;
      case "ORDER_UPDATED":
        toast({
          title: "Order Updated",
          description: `Order ${message.order?.orderNumber} status: ${message.order?.status}`,
        });
        break;
      case "MACHINE_UPDATED":
        toast({
          title: "Machine Status",
          description: `${message.machine?.name} is now ${message.machine?.status}`,
        });
        break;
      default:
        console.log("Unhandled WebSocket message:", message);
    }
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, sendMessage };
}
