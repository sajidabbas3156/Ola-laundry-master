
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings,
  CreditCard,
  Store,
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';

export function EnhancedBottomNavigation() {
  const { currentTenant } = useTenant();
  const { getOrdersByTenant } = useData();
  const location = useLocation();
  const { tenantSlug } = useParams();

  if (!currentTenant || !tenantSlug) return null;

  const pendingOrders = getOrdersByTenant(currentTenant.id).filter(
    order => order.status === 'pending' || order.status === 'processing'
  );

  const navItems = [
    {
      title: 'Dashboard',
      url: `/tenant/${tenantSlug}/dashboard`,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'POS',
      url: `/tenant/${tenantSlug}/pos`,
      icon: CreditCard,
      badge: null,
    },
    {
      title: 'Orders',
      url: `/tenant/${tenantSlug}/orders`,
      icon: ShoppingCart,
      badge: pendingOrders.length > 0 ? pendingOrders.length : null,
    },
    {
      title: 'Store',
      url: `/tenant/${tenantSlug}/storefront`,
      icon: Store,
      badge: null,
    },
    {
      title: 'More',
      url: `/tenant/${tenantSlug}/settings`,
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url || 
            (item.url.includes('/dashboard') && location.pathname === `/tenant/${tenantSlug}`);
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200 touch-manipulation min-h-[44px] relative",
                isActive
                  ? "text-blue-600 bg-blue-50/80"
                  : "text-gray-500 hover:text-gray-700 active:scale-95"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "transition-all duration-200",
                  isActive ? "h-6 w-6" : "h-5 w-5"
                )} />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-3 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "font-medium transition-all duration-200",
                isActive ? "text-xs" : "text-xs opacity-80"
              )}>
                {item.title}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
