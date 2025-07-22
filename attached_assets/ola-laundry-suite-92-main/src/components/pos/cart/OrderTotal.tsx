
import { Separator } from "@/components/ui/separator";

interface OrderTotalProps {
  cartTotal: number;
  deliveryCharge: number;
  finalTotal: number;
  paymentMethod: string;
  formatCurrency: (amount: number) => string;
}

export function OrderTotal({
  cartTotal,
  deliveryCharge,
  finalTotal,
  paymentMethod,
  formatCurrency
}: OrderTotalProps) {
  return (
    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>{formatCurrency(cartTotal)}</span>
      </div>
      {deliveryCharge > 0 && (
        <div className="flex justify-between text-sm">
          <span>Service Fee</span>
          <span>{formatCurrency(deliveryCharge)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <span>Payment</span>
        <span className="capitalize">{paymentMethod}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span className="text-primary">{formatCurrency(finalTotal)}</span>
      </div>
    </div>
  );
}
