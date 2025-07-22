
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types/pos";

interface StorefrontCartItemsProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  cartTotal: number;
  formatCurrency: (amount: number) => string;
}

export function StorefrontCartItems({
  cart,
  setCart,
  cartTotal,
  formatCurrency
}: StorefrontCartItemsProps) {
  const removeFromCart = (index: number) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    } else {
      setCart(cart.filter((_, i) => i !== index));
    }
  };

  const addToCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };

  return (
    <>
      <div className="space-y-4 max-h-[200px] overflow-y-auto">
        <h4 className="font-medium">Order Items:</h4>
        {cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
                <Badge variant="outline" className="text-xs">
                  {item.service?.name}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => removeFromCart(index)}
              >
                -
              </Button>
              <span className="w-5 text-center">{item.quantity}</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => addToCart(index)}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between font-semibold text-lg">
        <span>Total:</span>
        <span>{formatCurrency(cartTotal)}</span>
      </div>
    </>
  );
}
