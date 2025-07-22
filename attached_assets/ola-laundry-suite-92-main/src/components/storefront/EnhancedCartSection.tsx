
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, Calendar, Truck, CreditCard, ArrowRight } from "lucide-react";
import { useLocalization } from "@/contexts/LocalizationContext";

interface EnhancedCartSectionProps {
  cart: any[];
  onRemoveFromCart: (index: number) => void;
  onUpdateCart: (cart: any[]) => void;
  onProceedToCheckout: () => void;
  cartTotal: number;
}

export function EnhancedCartSection({
  cart,
  onRemoveFromCart,
  onUpdateCart,
  onProceedToCheckout,
  cartTotal
}: EnhancedCartSectionProps) {
  const { formatCurrency } = useLocalization();

  const updateQuantity = (index: number, change: number) => {
    const updatedCart = [...cart];
    const newQuantity = updatedCart[index].quantity + change;
    
    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0 or less
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index].quantity = newQuantity;
    }
    
    onUpdateCart(updatedCart);
  };

  const removeItem = (index: number) => {
    onRemoveFromCart(index);
  };

  const taxAmount = cartTotal * 0.05;
  const grandTotal = cartTotal + taxAmount;

  return (
    <Card className="sticky top-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden h-fit">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/20 rounded-xl">
            <ShoppingCart className="h-5 w-5" />
          </div>
          Your Cart ({cart.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {cart.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium mb-2">Cart is empty</h3>
            <p className="text-sm">Add items to start your order</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                        {item.name}
                      </h4>
                      {item.service && (
                        <Badge variant="outline" className="text-xs mt-1 bg-blue-50 text-blue-700 border-blue-200">
                          {item.service.name}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, -1)}
                        className="w-8 h-8 rounded-lg"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, 1)}
                        className="w-8 h-8 rounded-lg"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold text-lg text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Quick Service Options */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto rounded-xl">
                <Calendar className="h-4 w-4 mb-1" />
                <span className="text-xs">Schedule</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto rounded-xl">
                <Truck className="h-4 w-4 mb-1" />
                <span className="text-xs">Delivery</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center p-3 h-auto rounded-xl">
                <CreditCard className="h-4 w-4 mb-1" />
                <span className="text-xs">Payment</span>
              </Button>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (5%):</span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              onClick={onProceedToCheckout}
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
