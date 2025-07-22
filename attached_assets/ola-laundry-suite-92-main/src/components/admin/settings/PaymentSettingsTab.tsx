
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { CreditCard } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  fee: number;
}

interface PaymentSettingsTabProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: Dispatch<SetStateAction<PaymentMethod[]>>;
}

export function PaymentSettingsTab({
  paymentMethods,
  setPaymentMethods
}: PaymentSettingsTabProps) {
  const handleSavePaymentSettings = () => {
    console.log("Saving payment settings:", paymentMethods);
    toast.success("Payment methods updated successfully");
  };

  const togglePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === methodId ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  checked={method.enabled}
                  onCheckedChange={() => togglePaymentMethod(method.id)}
                />
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-gray-500">Processing fee: {method.fee}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Fee:</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={method.fee}
                  onChange={(e) => {
                    setPaymentMethods(prev =>
                      prev.map(m => m.id === method.id ? { ...m, fee: parseFloat(e.target.value) } : m)
                    );
                  }}
                  className="w-20"
                />
                <span className="text-sm">%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Stripe Configuration</Label>
            <Input placeholder="Stripe Publishable Key" />
            <Input placeholder="Stripe Secret Key" type="password" />
          </div>
          <div className="space-y-2">
            <Label>PayPal Configuration</Label>
            <Input placeholder="PayPal Client ID" />
            <Input placeholder="PayPal Client Secret" type="password" />
          </div>
        </div>
        
        <Button onClick={handleSavePaymentSettings} className="w-full sm:w-auto">
          Save Payment Settings
        </Button>
      </CardContent>
    </Card>
  );
}
