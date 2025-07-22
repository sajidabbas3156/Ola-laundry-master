import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface WebSocketMessage {
  type: string;
  data: any;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      clientTracking: true 
    });
    
    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);
      console.log('WebSocket client connected. Total clients:', this.clients.size);
      
      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('WebSocket client disconnected. Total clients:', this.clients.size);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
      
      // Send welcome message
      this.sendToClient(ws, {
        type: 'connected',
        data: { message: 'Connected to LaundryPro WebSocket' }
      });
    });
  }

  private handleMessage(ws: WebSocket, message: WebSocketMessage) {
    console.log('Received WebSocket message:', message);
    
    switch (message.type) {
      case 'subscribe':
        // Handle subscription to specific channels
        break;
      case 'ping':
        this.sendToClient(ws, { type: 'pong', data: {} });
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private sendToClient(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // Broadcast to all connected clients
  public broadcast(message: WebSocketMessage) {
    const messageString = JSON.stringify(message);
    let sentCount = 0;
    
    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageString);
        sentCount++;
      } else {
        this.clients.delete(ws);
      }
    });
    
    console.log(`Broadcasted message to ${sentCount} clients:`, message.type);
  }

  // Send to specific clients (future enhancement)
  public sendToClients(clientIds: string[], message: WebSocketMessage) {
    // Implementation for targeted messaging
    this.broadcast(message); // For now, just broadcast
  }

  // Business-specific notification methods
  public notifyOrderUpdate(orderData: any) {
    this.broadcast({
      type: 'order_updated',
      data: orderData
    });
  }

  public notifyLowStock(inventoryItem: any) {
    this.broadcast({
      type: 'inventory_low_stock',
      data: inventoryItem
    });
  }

  public notifyNewCustomer(customerData: any) {
    this.broadcast({
      type: 'new_customer',
      data: customerData
    });
  }

  public notifyPromotionExpired(promotionData: any) {
    this.broadcast({
      type: 'promotion_expired',
      data: promotionData
    });
  }

  public sendNotification(notificationData: any) {
    this.broadcast({
      type: 'notification',
      data: notificationData
    });
  }

  public notifyMachineStatus(machineData: any) {
    this.broadcast({
      type: 'machine_status',
      data: machineData
    });
  }

  public getClientCount(): number {
    return this.clients.size;
  }

  public close() {
    this.wss.close();
  }
}

let wsManager: WebSocketManager | null = null;

export function initializeWebSocket(server: Server): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager(server);
  }
  return wsManager;
}

export function getWebSocketManager(): WebSocketManager | null {
  return wsManager;
}