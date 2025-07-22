
export interface Integration {
  id: string;
  name: string;
  category: string;
  status: "connected" | "disconnected" | "error" | "pending";
  lastSync: string;
  icon: any;
  description: string;
  config: Record<string, any>;
  healthScore: number;
  errorCount: number;
}
