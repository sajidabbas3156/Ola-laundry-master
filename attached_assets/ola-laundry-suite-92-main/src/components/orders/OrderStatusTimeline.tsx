
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Package, 
  CheckCircle, 
  Truck, 
  MapPin,
  ArrowRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusTimelineProps {
  orders: any[];
  currentStatus?: string;
  orderId?: string;
}

export function OrderStatusTimeline({ orders, currentStatus, orderId }: OrderStatusTimelineProps) {
  const statusSteps = [
    {
      id: 'pending',
      label: 'Order Received',
      description: 'Order placed and confirmed',
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'processing',
      label: 'In Process',
      description: 'Items being cleaned',
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'ready',
      label: 'Ready',
      description: 'Cleaning completed',
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      description: 'Order completed',
      icon: Truck,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getOrderCountByStatus = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.id === status);
  };

  const currentIndex = currentStatus ? getStatusIndex(currentStatus) : -1;

  if (orderId) {
    // Single order timeline view
    return (
      <div className="relative">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300",
                  isActive 
                    ? `${step.color} border-white shadow-lg` 
                    : "bg-gray-200 border-gray-300"
                )}>
                  <Icon className={cn(
                    "h-6 w-6",
                    isActive ? "text-white" : "text-gray-500"
                  )} />
                  {isCurrent && (
                    <div className="absolute -inset-1 rounded-full border-2 border-blue-400 animate-pulse" />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className={cn(
                    "text-sm font-medium",
                    isActive ? step.textColor : "text-gray-500"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </p>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={cn(
                    "absolute top-6 left-1/2 w-full h-1 -translate-y-1/2",
                    isActive && index < currentIndex 
                      ? "bg-green-400" 
                      : "bg-gray-200"
                  )} style={{ left: '50%', width: 'calc(100% - 3rem)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Overview timeline with counts
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statusSteps.map((step, index) => {
        const Icon = step.icon;
        const count = getOrderCountByStatus(step.id);
        
        return (
          <Card key={step.id} className={cn("border-0 shadow-sm", step.bgColor)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", step.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{step.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
