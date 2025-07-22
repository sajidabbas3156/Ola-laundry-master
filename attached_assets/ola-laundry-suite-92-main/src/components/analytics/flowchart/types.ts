
export const DOMAIN_COLORS = {
  pos: "#10B981", // Green
  delivery: "#3B82F6", // Blue
  customer: "#F59E0B", // Yellow
  business: "#8B5CF6", // Purple
  admin: "#EF4444", // Red
  auth: "#6B7280", // Gray
};

export interface FlowNode {
  id: string;
  label: string;
  domain: keyof typeof DOMAIN_COLORS;
  type: "start" | "process" | "decision" | "end" | "error";
  connections: string[];
  backwardConnections?: string[];
  errorPaths?: string[];
}

export const WORKFLOW_NODES: FlowNode[] = [
  { id: "landing", label: "Public Landing", domain: "auth", type: "start", connections: ["tenant-select"] },
  { id: "tenant-select", label: "Tenant Selection", domain: "auth", type: "process", connections: ["login"], backwardConnections: ["landing"] },
  { id: "login", label: "Authentication", domain: "auth", type: "decision", connections: ["dashboard", "pos", "storefront"], errorPaths: ["login-error"] },
  { id: "login-error", label: "Login Failed", domain: "auth", type: "error", connections: ["login"], backwardConnections: ["login"] },
  
  // POS Flow
  { id: "pos", label: "POS System", domain: "pos", type: "process", connections: ["item-select"], backwardConnections: ["dashboard"] },
  { id: "item-select", label: "Item Selection", domain: "pos", type: "process", connections: ["service-choice"], backwardConnections: ["pos"] },
  { id: "service-choice", label: "Service Selection", domain: "pos", type: "decision", connections: ["add-cart", "pos"], backwardConnections: ["item-select"] },
  { id: "add-cart", label: "Add to Cart", domain: "pos", type: "process", connections: ["checkout"], backwardConnections: ["service-choice"] },
  { id: "checkout", label: "Checkout", domain: "pos", type: "decision", connections: ["payment", "cart-error"], backwardConnections: ["add-cart"] },
  { id: "cart-error", label: "Cart Empty", domain: "pos", type: "error", connections: ["pos"], backwardConnections: ["checkout"] },
  { id: "payment", label: "Payment Processing", domain: "pos", type: "decision", connections: ["receipt", "payment-error"], backwardConnections: ["checkout"] },
  { id: "payment-error", label: "Payment Failed", domain: "pos", type: "error", connections: ["payment"], backwardConnections: ["payment"] },
  { id: "receipt", label: "Receipt Generated", domain: "pos", type: "end", connections: [], backwardConnections: ["payment"] },
  
  // Delivery Flow
  { id: "delivery", label: "Delivery Management", domain: "delivery", type: "process", connections: ["route-optimize"], backwardConnections: ["dashboard"] },
  { id: "route-optimize", label: "Route Optimization", domain: "delivery", type: "process", connections: ["driver-assign"], backwardConnections: ["delivery"] },
  { id: "driver-assign", label: "Driver Assignment", domain: "delivery", type: "decision", connections: ["delivery-start", "reassign"], backwardConnections: ["route-optimize"] },
  { id: "reassign", label: "Driver Reassignment", domain: "delivery", type: "error", connections: ["driver-assign"], backwardConnections: ["driver-assign"] },
  { id: "delivery-start", label: "Delivery Started", domain: "delivery", type: "process", connections: ["delivery-complete", "delivery-failed"], backwardConnections: ["driver-assign"] },
  { id: "delivery-failed", label: "Delivery Failed", domain: "delivery", type: "error", connections: ["reassign"], backwardConnections: ["delivery-start"] },
  { id: "delivery-complete", label: "Delivery Complete", domain: "delivery", type: "end", connections: [], backwardConnections: ["delivery-start"] },
];
