
import { ShoppingCart } from "lucide-react";
import { CartItemDisplay } from "@/components/pos/CartItemDisplay";
import { CartItem } from "@/types/pos";

interface CartItemsProps {
  cart: CartItem[];
  removeFromCart: (itemId: string) => void;
  addItemQuantity: (index: number) => void;
  deleteFromCart: (itemId: string) => void;
  formatCurrency: (amount: number) => string;
}

export function CartItems({
  cart,
  removeFromCart,
  addItemQuantity,
  deleteFromCart,
  formatCurrency
}: CartItemsProps) {
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
      {cart.length > 0 ? (
        cart.map((item, index) => (
          <CartItemDisplay
            key={`${item.id}-${item.service?.id}-${index}`}
            item={item}
            onRemove={removeFromCart}
            onAdd={addItemQuantity}
            onDelete={deleteFromCart}
            formatCurrency={formatCurrency}
            index={index}
          />
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <ShoppingCart className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <p className="font-medium">Your cart is empty</p>
          <p className="text-sm mt-1">Add items to start creating an order</p>
        </div>
      )}
    </div>
  );
}
