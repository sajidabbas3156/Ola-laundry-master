
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardDetails } from "@/types/payment";

interface CardDetailsFormProps {
  cardDetails: CardDetails;
  onCardDetailsChange: (details: CardDetails) => void;
}

export function CardDetailsForm({ cardDetails, onCardDetailsChange }: CardDetailsFormProps) {
  const updateCardDetails = (field: keyof CardDetails, value: string) => {
    onCardDetailsChange({ ...cardDetails, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Card Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardName">Cardholder Name</Label>
          <Input
            id="cardName"
            placeholder="John Doe"
            value={cardDetails.name}
            onChange={(e) => updateCardDetails('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardDetails.number}
            onChange={(e) => updateCardDetails('number', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => updateCardDetails('expiry', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={(e) => updateCardDetails('cvv', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
