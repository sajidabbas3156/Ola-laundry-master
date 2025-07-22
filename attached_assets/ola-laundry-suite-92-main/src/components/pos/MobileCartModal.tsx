
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingCart, CreditCard } from "lucide-react";
import { CartItem } from "@/types/pos";
import { CustomerSelector } from "@/components/pos/CustomerSelector";

interface MobileCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onUpdateCart: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  formatCurrency: (amount: number) => string;
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
  onCompleteOrder: () => void;
}

export function MobileCartModal({
  open,
  onOpenChange,
  cart,
  onUpdateCart,
  onRemoveFromCart,
  formatCurrency,
  tenantCustomers,
  selectedCustomer,
  setSelectedCustomer,
  onCompleteOrder
}: MobileCartModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxTotal = subtotal * 0.05;
  const grandTotal = subtotal + taxTotal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto h-[90vh] flex flex-col p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
            Cart ({cart.length})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          {/* Customer Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Customer</label>
            <CustomerSelector
              tenantCustomers={tenantCustomers}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          </div>

          <Separator />

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                      {item.service && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.service.name}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateCart(item.id, Math.max(0, item.quantity - 1))}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateCart(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <>
              <Separator />

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "cash", label: "Cash" },
                    { id: "card", label: "Card" },
                    { id: "benefit", label: "Benefit" },
                    { id: "digital", label: "Digital" }
                  ].map((method) => (
                    <Button
                      key={method.id}
                      variant={paymentMethod === method.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaymentMethod(method.id)}
                      className="rounded-xl"
                    >
                      {method.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 pt-4 border-t border-gray-200 space-y-4">
            {/* Totals */}
            <div className="space-y-2 bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(taxTotal)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl" 
              onClick={onCompleteOrder}
              disabled={cart.length === 0 || !selectedCustomer}
            >
              Complete Order • {formatCurrency(grandTotal)}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
