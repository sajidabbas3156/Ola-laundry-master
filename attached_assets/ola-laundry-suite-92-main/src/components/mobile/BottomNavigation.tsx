
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
} from 'lucide-react';

export function BottomNavigation() {
  const { currentTenant } = useTenant();
  const location = useLocation();
  const { tenantSlug } = useParams();

  if (!currentTenant || !tenantSlug) return null;

  const navItems = [
    {
      title: 'Home',
      url: `/tenant/${tenantSlug}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: 'Orders',
      url: `/tenant/${tenantSlug}/orders`,
      icon: ShoppingCart,
    },
    {
      title: 'Customers',
      url: `/tenant/${tenantSlug}/customers`,
      icon: Users,
    },
    {
      title: 'Reports',
      url: `/tenant/${tenantSlug}/reports`,
      icon: BarChart3,
    },
    {
      title: 'Settings',
      url: `/tenant/${tenantSlug}/settings`,
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors touch-manipulation",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
