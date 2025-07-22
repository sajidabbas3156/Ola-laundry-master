
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Calendar, Truck } from "lucide-react";
import { CustomerSelector } from "@/components/pos/CustomerSelector";
import { CartItem } from "@/types/pos";

interface EnhancedCartUIProps {
  cart: CartItem[];
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
  formatCurrency: (amount: number) => string;
}

export function EnhancedCartUI({
  cart,
  tenantCustomers,
  selectedCustomer,
  setSelectedCustomer,
  formatCurrency
}: EnhancedCartUIProps) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Cart ({cart.length} items)
          {cart.length > 0 && (
            <Badge variant="secondary">{formatCurrency(cartTotal)}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Selection with Enhanced Icon */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <CustomerSelector
              tenantCustomers={tenantCustomers}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          </div>
        </div>

        {/* Schedule Icon Enhancement */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-200 transition-colors"
                 onClick={() => setShowSchedule(!showSchedule)}>
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <Button 
            variant="outline" 
            className="flex-1 justify-start"
            onClick={() => setShowSchedule(!showSchedule)}
          >
            Schedule Pickup/Delivery
          </Button>
        </div>

        {/* Delivery Management Icon */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-200 transition-colors"
                 onClick={() => setShowDelivery(!showDelivery)}>
              <Truck className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <Button 
            variant="outline" 
            className="flex-1 justify-start"
            onClick={() => setShowDelivery(!showDelivery)}
          >
            Delivery Options
          </Button>
        </div>

        {/* Schedule Panel */}
        {showSchedule && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3">
              <p className="text-sm text-green-700">Schedule options coming soon...</p>
            </CardContent>
          </Card>
        )}

        {/* Delivery Panel */}
        {showDelivery && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-3">
              <p className="text-sm text-orange-700">Delivery management options...</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
