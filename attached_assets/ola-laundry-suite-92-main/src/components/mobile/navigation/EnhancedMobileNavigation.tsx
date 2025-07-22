
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Bell, Search } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";
import { cn } from "@/lib/utils";
import { MobileNavigationContent } from "./MobileNavigationContent";
import { useIsMobile } from "@/hooks/use-mobile";

export function EnhancedMobileNavigation() {
  const { tenantSlug } = useParams();
  const { currentTenant } = useTenant();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Close navigation when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Don't render on desktop or if no tenant
  if (!isMobile || !tenantSlug || !currentTenant) return null;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-white z-50">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {currentTenant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{currentTenant.name}</h2>
                      <p className="text-blue-100 text-xs">Laundry Management</p>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
                
                <MobileNavigationContent 
                  tenantSlug={tenantSlug} 
                  onLinkClick={handleLinkClick} 
                />
                
                {/* Enhanced Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">OLA Laundry Suite v2.0</p>
                    <p className="text-xs text-gray-400">Powered by Lovable</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="font-semibold text-gray-900 truncate">{currentTenant.name}</h1>
              <p className="text-xs text-gray-500">Business Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
        <div className="grid grid-cols-5 h-16">
          {[
            { label: "Dashboard", path: "dashboard", icon: "📊" },
            { label: "Orders", path: "orders", icon: "📋", badge: "3" },
            { label: "POS", path: "pos", icon: "🏪" },
            { label: "Customers", path: "customers", icon: "👥" },
            { label: "Reports", path: "reports", icon: "📈" }
          ].map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => window.location.href = `/tenant/${tenantSlug}/${item.path}`}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-xs transition-colors relative",
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 active:bg-gray-100"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-1 right-2 h-4 w-4 flex items-center justify-center text-xs p-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
