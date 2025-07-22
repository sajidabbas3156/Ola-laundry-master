import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, USER_ROLES } from "@/hooks/use-auth";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Home,
  Monitor,
  Smartphone,
  Truck,
  Archive,
  Tag,
  TrendingUp,
  Bell,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  allowedRoles?: string[];
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Admin Panel",
    href: "/admin",
    icon: Monitor,
    allowedRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_OWNER, USER_ROLES.BRANCH_MANAGER, USER_ROLES.INVENTORY_MANAGER],
  },
  {
    name: "POS System",
    href: "/pos",
    icon: Smartphone,
    allowedRoles: [USER_ROLES.CASHIER, USER_ROLES.LAUNDRY_STAFF, USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER],
  },
  {
    name: "Customer App",
    href: "/customer",
    icon: Smartphone,
  },
  {
    name: "Delivery",
    href: "/delivery",
    icon: Truck,
    allowedRoles: [USER_ROLES.DELIVERY_AGENT, USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER],
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Archive,
    allowedRoles: [USER_ROLES.INVENTORY_MANAGER, USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER],
  },
  {
    name: "Promotions",
    href: "/promotions",
    icon: Tag,
    allowedRoles: [USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER],
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
    allowedRoles: [USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER, USER_ROLES.SUPER_ADMIN],
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

export function MobileNavigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, displayName } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case USER_ROLES.SUPER_ADMIN: return "bg-red-500";
      case USER_ROLES.ORG_OWNER: return "bg-purple-500";
      case USER_ROLES.BRANCH_MANAGER: return "bg-blue-500";
      case USER_ROLES.INVENTORY_MANAGER: return "bg-green-500";
      case USER_ROLES.LAUNDRY_STAFF: return "bg-orange-500";
      case USER_ROLES.CASHIER: return "bg-teal-500";
      case USER_ROLES.DELIVERY_AGENT: return "bg-indigo-500";
      default: return "bg-gray-500";
    }
  };

  const getRoleName = (userRole: string) => {
    return userRole.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LP</span>
          </div>
          <span className="text-lg font-bold text-gray-900">LaundryPro</span>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col h-full">
              {/* User Profile */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{displayName}</div>
                    <Badge className={`${getRoleColor(role || '')} text-white text-xs`}>
                      {getRoleName(role || '')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href || 
                    (item.href === "/" && location === "/");

                  // Check if user has access to this route
                  if (item.allowedRoles && !item.allowedRoles.includes(role || '')) {
                    return null;
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            // Check if user has access to this route
            if (item.allowedRoles && !item.allowedRoles.includes(role || '')) {
              return null;
            }

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 text-xs font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="truncate">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}