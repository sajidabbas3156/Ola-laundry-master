
import { LucideIcon } from "lucide-react";

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  enabled: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  email: string;
  status: "active" | "inactive" | "trial";
  features: Record<string, boolean>;
  subscriptionPlan: "basic" | "premium" | "enterprise";
  createdAt: string;
}
