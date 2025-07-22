
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { PaymentOption } from "@/types/payment";

interface PaymentOptionCardProps {
  option: PaymentOption;
  orderTotal: number;
  onCalculateTotal: (baseAmount: number, feePercentage: number) => number;
}

export function PaymentOptionCard({ option, orderTotal, onCalculateTotal }: PaymentOptionCardProps) {
  const totalWithFee = onCalculateTotal(orderTotal, option.fee);
  const isDisabled = option.minAmount && orderTotal < option.minAmount;
  
  return (
    <div className={`border rounded-lg p-4 ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center space-x-3">
        <RadioGroupItem 
          value={option.id} 
          id={option.id}
          disabled={isDisabled}
        />
        <Label 
          htmlFor={option.id} 
          className="flex-1 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {option.icon}
              <div>
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {option.processingTime}
                </div>
              </div>
            </div>
            <div className="text-right">
              {option.fee > 0 && (
                <div className="text-sm text-gray-500">
                  +{option.fee}% fee
                </div>
              )}
              <div className="font-medium">
                ${totalWithFee.toFixed(2)}
              </div>
            </div>
          </div>
        </Label>
      </div>
      
      {isDisabled && option.minAmount && (
        <div className="mt-2 text-sm text-red-500">
          Minimum amount: ${option.minAmount}
        </div>
      )}
    </div>
  );
}
