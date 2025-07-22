
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Calendar,
  Truck,
  Settings,
  Store,
  CreditCard,
  Tag,
  Star,
  BarChart3,
  Building2,
} from "lucide-react";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const { currentTenant } = useTenant();
  const { tenantSlug } = useParams();

  const menuItems = [
    { title: "Dashboard", url: `/tenant/${tenantSlug}/dashboard`, icon: LayoutDashboard },
    { title: "Customers", url: `/tenant/${tenantSlug}/customers`, icon: Users },
    { title: "Orders", url: `/tenant/${tenantSlug}/orders`, icon: ShoppingCart },
    { title: "Scheduling", url: `/tenant/${tenantSlug}/scheduling`, icon: Calendar },
    { title: "Delivery", url: `/tenant/${tenantSlug}/delivery`, icon: Truck },
    { title: "Reports", url: `/tenant/${tenantSlug}/reports`, icon: BarChart3 },
    { title: "Business Admin", url: `/tenant/${tenantSlug}/business-admin`, icon: Building2 },
    { title: "Promotions", url: `/tenant/${tenantSlug}/promotions`, icon: Tag },
    { title: "Reviews", url: `/tenant/${tenantSlug}/reviews`, icon: Star },
    { title: "Storefront", url: `/tenant/${tenantSlug}/storefront`, icon: Store },
    { title: "POS", url: `/tenant/${tenantSlug}/pos`, icon: CreditCard },
    { title: "Settings", url: `/tenant/${tenantSlug}/settings`, icon: Settings },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{currentTenant?.name}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
