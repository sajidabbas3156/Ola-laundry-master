
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote,
  Shield
} from "lucide-react";
import { PaymentOption, CardDetails, CustomerPaymentOptionsProps } from "@/types/payment";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentOptionCard } from "./PaymentOptionCard";
import { CardDetailsForm } from "./CardDetailsForm";
import { BankTransferInfo } from "./BankTransferInfo";

export function CustomerPaymentOptions({ orderTotal, onPaymentSelect }: CustomerPaymentOptionsProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const paymentOptions: PaymentOption[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      processingTime: "Instant",
      fee: 2.9,
      enabled: true
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <Smartphone className="h-5 w-5" />,
      processingTime: "Instant",
      fee: 3.5,
      enabled: true
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: <Smartphone className="h-5 w-5" />,
      processingTime: "Instant",
      fee: 2.9,
      enabled: false
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: <Building2 className="h-5 w-5" />,
      processingTime: "1-3 business days",
      fee: 0.5,
      minAmount: 10,
      enabled: true
    },
    {
      id: "cash",
      name: "Cash on Delivery",
      icon: <Banknote className="h-5 w-5" />,
      processingTime: "On delivery",
      fee: 0,
      enabled: true
    }
  ];

  const enabledOptions = paymentOptions.filter(option => option.enabled);

  const calculateTotal = (baseAmount: number, feePercentage: number) => {
    return baseAmount + (baseAmount * feePercentage / 100);
  };

  const handlePaymentSubmit = () => {
    if (!selectedPayment) return;
    
    const paymentMethod = enabledOptions.find(option => option.id === selectedPayment);
    if (!paymentMethod) return;

    const paymentDetails = selectedPayment === "card" ? cardDetails : {};
    onPaymentSelect(selectedPayment, paymentDetails);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Payment Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentSummary orderTotal={orderTotal} />

        <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
          <div className="space-y-3">
            {enabledOptions.map((option) => (
              <PaymentOptionCard
                key={option.id}
                option={option}
                orderTotal={orderTotal}
                onCalculateTotal={calculateTotal}
              />
            ))}
          </div>
        </RadioGroup>

        {selectedPayment === "card" && (
          <CardDetailsForm
            cardDetails={cardDetails}
            onCardDetailsChange={setCardDetails}
          />
        )}

        {selectedPayment === "bank_transfer" && <BankTransferInfo />}

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            disabled={!selectedPayment}
            onClick={handlePaymentSubmit}
          >
            {selectedPayment === "cash" ? "Confirm Order" : "Process Payment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
