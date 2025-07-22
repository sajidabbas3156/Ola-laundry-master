
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { CartItem } from "@/types/pos";

interface ModernCartSidebarProps {
  cart: CartItem[];
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
  onUpdateCart: (updatedCart: CartItem[]) => void;
  onRemoveFromCart: (itemId: string) => void;
  onCompleteOrder: () => void;
  formatCurrency: (amount: number) => string;
  isProcessing: boolean;
}

export function ModernCartSidebar({
  cart,
  onUpdateCart,
  onRemoveFromCart,
  onCompleteOrder,
  formatCurrency,
  isProcessing
}: ModernCartSidebarProps) {
  const handleQuantityChange = (itemId: string, change: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    onUpdateCart(updatedCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Cart Summary
          {cart.length > 0 && (
            <Badge variant="secondary">{cart.length} items</Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add items to get started</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-3 border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      {item.service && (
                        <p className="text-xs text-gray-500">{item.service.name}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="h-6 w-6 p-0"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-semibold text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button 
              onClick={onCompleteOrder}
              disabled={cart.length === 0 || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
