
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethodSelectorProps {
  finalTotal: number;
  formatCurrency: (amount: number) => string;
}

export function PaymentMethodSelector({ finalTotal, formatCurrency }: PaymentMethodSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");

  const change = amountPaid ? parseFloat(amountPaid) - finalTotal : 0;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        Payment Method
      </Label>
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2 p-2 border rounded-lg">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="text-sm cursor-pointer">Cash</Label>
        </div>
        <div className="flex items-center space-x-2 p-2 border rounded-lg">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="text-sm cursor-pointer">Card</Label>
        </div>
        <div className="flex items-center space-x-2 p-2 border rounded-lg">
          <RadioGroupItem value="benefit" id="benefit" />
          <Label htmlFor="benefit" className="text-sm cursor-pointer">Benefit</Label>
        </div>
        <div className="flex items-center space-x-2 p-2 border rounded-lg">
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="text-sm cursor-pointer">COD</Label>
        </div>
      </RadioGroup>

      {paymentMethod === "cash" && (
        <div className="space-y-2">
          <Label htmlFor="amountPaid" className="text-sm font-medium">
            Amount Received
          </Label>
          <Input
            id="amountPaid"
            type="number"
            placeholder={`Enter amount (Total: ${formatCurrency(finalTotal)})`}
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            className="text-sm"
            step="0.01"
          />
          {amountPaid && (
            <div className={`text-sm p-2 rounded ${change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {change >= 0 ? `Change: ${formatCurrency(change)}` : `Insufficient: ${formatCurrency(Math.abs(change))} short`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
