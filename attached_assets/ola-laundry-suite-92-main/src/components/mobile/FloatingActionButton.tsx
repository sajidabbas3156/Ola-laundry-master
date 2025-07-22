
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  ShoppingCart,
  Users,
  Scan,
  X,
} from 'lucide-react';

interface FABAction {
  label: string;
  icon: React.ElementType;
  action: () => void;
  color: string;
}

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { tenantSlug } = useParams();

  const actions: FABAction[] = [
    {
      label: 'New Order',
      icon: ShoppingCart,
      action: () => navigate(`/tenant/${tenantSlug}/pos`),
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      label: 'Add Customer',
      icon: Users,
      action: () => navigate(`/tenant/${tenantSlug}/customers`),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'Scan QR',
      icon: Scan,
      action: () => {
        // Implement QR scanner
        console.log('QR Scanner not implemented');
      },
      color: 'bg-purple-600 hover:bg-purple-700',
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
                isOpen ? `delay-${index * 50}` : ''
              )}
            >
              <Badge className="bg-white text-gray-700 shadow-lg px-3 py-1 whitespace-nowrap">
                {action.label}
              </Badge>
              <Button
                size="sm"
                className={cn(
                  "rounded-full w-12 h-12 shadow-lg",
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

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "rounded-full w-14 h-14 shadow-xl transition-all duration-300",
          isOpen 
            ? "bg-red-600 hover:bg-red-700 rotate-45" 
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        )}
        onClick={handleMainAction}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
