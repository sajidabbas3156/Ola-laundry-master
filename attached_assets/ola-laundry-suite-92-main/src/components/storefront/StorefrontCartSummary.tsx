
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/types/pos";

interface StorefrontCartSummaryProps {
  cart: CartItem[];
  cartTotal: number;
  formatCurrency: (amount: number) => string;
  onCheckoutClick: () => void;
}

export function StorefrontCartSummary({
  cart,
  cartTotal,
  formatCurrency,
  onCheckoutClick
}: StorefrontCartSummaryProps) {
  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40">
      <Card className="bg-white shadow-lg border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Cart ({cart.length} items)</span>
            <span className="font-bold text-lg text-blue-600">
              {formatCurrency(cartTotal)}
            </span>
          </div>
          <button
            onClick={onCheckoutClick}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Cart & Checkout
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
