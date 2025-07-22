
interface PaymentSummaryProps {
  orderTotal: number;
}

export function PaymentSummary({ orderTotal }: PaymentSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="font-medium">Order Total:</span>
        <span className="text-lg font-bold">${orderTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
