
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { CartItem } from "@/types/pos";
import { useLocalization } from "@/contexts/LocalizationContext";

interface CartSectionProps {
  cart: CartItem[];
  onRemoveFromCart: (index: number) => void;
  onProceedToCheckout: () => void;
  cartTotal: number;
}

export function CartSection({
  cart,
  onRemoveFromCart,
  onProceedToCheckout,
  cartTotal
}: CartSectionProps) {
  const { formatCurrency } = useLocalization();

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm sticky top-4">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg py-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <ShoppingCart className="h-6 w-6" />
          Current Order
          {cart.length > 0 && (
            <Badge className="bg-white text-green-700 ml-auto">
              {cart.length} items
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add items to start creating an order</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.service?.id}-${index}`} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                        {item.service && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {item.service.name.slice(0, 4)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromCart(index);
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add quantity increase logic here
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={onProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
