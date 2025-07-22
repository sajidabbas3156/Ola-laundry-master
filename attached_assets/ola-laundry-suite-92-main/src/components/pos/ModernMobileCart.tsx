
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, ShoppingCart, User } from "lucide-react";
import { CartItem } from "@/types/pos";

interface ModernMobileCartProps {
  cart: CartItem[];
  cartTotal: number;
  formatCurrency: (amount: number) => string;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  onUpdateCart: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
  onCompleteOrder: () => void;
}

export function ModernMobileCart({
  cart,
  cartTotal,
  formatCurrency,
  showCart,
  setShowCart,
  onUpdateCart,
  onRemoveFromCart,
  tenantCustomers,
  selectedCustomer,
  setSelectedCustomer,
  onCompleteOrder
}: ModernMobileCartProps) {
  const taxAmount = cartTotal * 0.05;
  const grandTotal = cartTotal + taxAmount;

  return (
    <Sheet open={showCart} onOpenChange={setShowCart}>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Cart</h3>
                <p className="text-gray-500">Add items to start an order</p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.service?.id}`} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          {item.service && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {item.service.name}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFromCart(`${item.id}-${item.service?.id}`)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateCart(`${item.id}-${item.service?.id}`, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateCart(`${item.id}-${item.service?.id}`, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t pt-4 space-y-4">
                {/* Customer Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer
                  </Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenantCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <Button 
                  onClick={onCompleteOrder}
                  className="w-full"
                  disabled={cart.length === 0 || !selectedCustomer}
                >
                  Complete Order
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
