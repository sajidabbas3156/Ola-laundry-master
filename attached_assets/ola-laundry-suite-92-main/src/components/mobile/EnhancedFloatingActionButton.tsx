
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { LaundryPosIcon } from '@/components/icons/LaundryPosIcon';
import {
  Plus,
  ShoppingCart,
  Users,
  Scan,
  X,
  Package,
  Calendar,
  CreditCard,
  Store,
  Truck,
} from 'lucide-react';

interface FABAction {
  label: string;
  icon: React.ElementType;
  action: () => void;
  color: string;
  priority: number;
}

export function EnhancedFloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { tenantSlug } = useParams();

  const actions: FABAction[] = [
    {
      label: 'New Order',
      icon: ShoppingCart,
      action: () => navigate(`/tenant/${tenantSlug}/pos`),
      color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      priority: 1,
    },
    {
      label: 'Storefront',
      icon: Store,
      action: () => navigate(`/tenant/${tenantSlug}/storefront`),
      color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      priority: 2,
    },
    {
      label: 'Add Customer',
      icon: Users,
      action: () => navigate(`/tenant/${tenantSlug}/customers`),
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      priority: 3,
    },
    {
      label: 'Add Item',
      icon: Package,
      action: () => navigate(`/tenant/${tenantSlug}/inventory`),
      color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      priority: 4,
    },
    {
      label: 'Delivery',
      icon: Truck,
      action: () => navigate(`/tenant/${tenantSlug}/delivery`),
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      priority: 5,
    },
  ];

  const handleMainAction = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-3 transition-all duration-300 transform",
        isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={action.label}
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                isOpen ? `delay-${index * 75}` : ''
              )}
            >
              <Badge className="bg-white/95 backdrop-blur-sm text-gray-700 shadow-lg px-3 py-2 whitespace-nowrap border-0">
                {action.label}
              </Badge>
              <Button
                size="sm"
                className={cn(
                  "rounded-full w-12 h-12 shadow-lg border-0 min-h-[48px] min-w-[48px]",
                  action.color
                )}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Main FAB with LaundryPosIcon */}
      <Button
        size="lg"
        className={cn(
          "rounded-full w-16 h-16 shadow-xl transition-all duration-300 border-0 min-h-[64px] min-w-[64px] p-2",
          isOpen 
            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rotate-45" 
            : "bg-gradient-to-br from-blue-500 via-blue-600 to-green-500 hover:from-blue-600 hover:via-blue-700 hover:to-green-600 shadow-blue-500/25"
        )}
        onClick={handleMainAction}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <LaundryPosIcon size="sm" variant="flat" className="w-8 h-8 bg-transparent" />
        )}
      </Button>
    </div>
  );
}
