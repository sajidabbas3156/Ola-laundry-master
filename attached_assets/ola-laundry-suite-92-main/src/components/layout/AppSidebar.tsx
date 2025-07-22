
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarSection } from "./sidebar/SidebarSection";
import { useTenant } from "@/contexts/TenantContext";
import { useParams } from "react-router-dom";
import { 
  LayoutDashboard,
  CreditCard,
  Store,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Truck,
  Tag,
  Star,
  Briefcase,
  Settings,
  MessageSquare,
  Zap,
  UserCircle,
  Shirt,
  Droplets,
  Wind,
  Sparkles
} from "lucide-react";

export function AppSidebar() {
  const { currentTenant } = useTenant();
  const { tenantSlug } = useParams();

  if (!currentTenant || !tenantSlug) {
    return null;
  }

  const mainMenuItems = [
    { title: "Dashboard", url: "dashboard", icon: LayoutDashboard },
    { title: "POS", url: "pos", icon: CreditCard },
    { title: "Storefront", url: "storefront", icon: Store },
    { title: "Orders", url: "orders", icon: ShoppingCart },
    { title: "Customers", url: "customers", icon: Users },
  ];

  const businessMenuItems = [
    { title: "Inventory", url: "inventory", icon: Package },
    { title: "Delivery", url: "delivery", icon: Truck },
    { title: "Marketing", url: "marketing", icon: MessageSquare },
    { title: "Reports", url: "reports", icon: BarChart3 },
  ];

  const managementMenuItems = [
    { title: "Tenant Profile", url: "tenant-profile", icon: UserCircle },
    { title: "Settings", url: "settings", icon: Settings },
    { title: "Business Admin", url: "business-admin", icon: Briefcase },
    { title: "POS Settings", url: "pos-settings", icon: CreditCard },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            <Droplets className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm">{currentTenant.name}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarSection title="Main Operations" items={mainMenuItems} />
        <SidebarSection title="Business Tools" items={businessMenuItems} />
        <SidebarSection title="Management" items={managementMenuItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
