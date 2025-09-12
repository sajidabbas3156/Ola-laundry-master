import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTenant } from "@/contexts/TenantContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  FileText,
  Truck,
  Gift,
  Settings,
  Store,
  CreditCard
} from "lucide-react";

const navigation = [
  { name: 'dashboard', href: '/tenant/ola-laundry/dashboard', icon: LayoutDashboard },
  { name: 'pos', href: '/tenant/ola-laundry/pos', icon: CreditCard },
  { name: 'storefront', href: '/tenant/ola-laundry/storefront', icon: Store },
  { name: 'orders', href: '/tenant/ola-laundry/orders', icon: ShoppingCart },
  { name: 'customers', href: '/tenant/ola-laundry/customers', icon: Users },
  { name: 'inventory', href: '/tenant/ola-laundry/inventory', icon: Package },
  { name: 'reports', href: '/tenant/ola-laundry/reports', icon: FileText },
  { name: 'delivery', href: '/tenant/ola-laundry/delivery', icon: Truck },
  { name: 'promotions', href: '/tenant/ola-laundry/promotions', icon: Gift },
  { name: 'settings', href: '/tenant/ola-laundry/settings', icon: Settings },
];

export default function TenantSidebar() {
  const location = useLocation();
  const { tenant } = useTenant();
  const { t } = useLocalization();

  return (
    <div className="flex flex-col w-64 bg-background border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">OLA</span>
          </div>
          <span className="text-lg font-bold text-foreground">
            {tenant?.name || "LAUNDRY MASTER"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {t(item.name)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}