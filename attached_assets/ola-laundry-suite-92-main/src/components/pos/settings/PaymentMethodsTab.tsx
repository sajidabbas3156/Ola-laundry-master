
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { CreditCard, Save } from "lucide-react";
import { PaymentMethod } from "@/types/pos-settings";

interface PaymentMethodsTabProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
}

export function PaymentMethodsTab({ paymentMethods, setPaymentMethods }: PaymentMethodsTabProps) {
  const handleSavePaymentMethods = () => {
    const enabledMethods = paymentMethods.filter(method => method.enabled);
    if (enabledMethods.length === 0) {
      toast.error("At least one payment method must be enabled");
      return;
    }
    
    localStorage.setItem('pos_payment_methods', JSON.stringify(paymentMethods));
    toast.success("Payment methods saved successfully!");
  };

  const handleTogglePaymentMethod = (methodId: string, enabled: boolean) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === methodId ? { ...method, enabled } : method
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-medium">{method.name}</h3>
                <Badge variant={method.enabled ? "default" : "secondary"}>
                  {method.enabled ? "Enabled" : "Disabled"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Fee: {method.processingFee}%
                </span>
              </div>
              <Switch 
                checked={method.enabled}
                onCheckedChange={(checked) => handleTogglePaymentMethod(method.id, checked)}
              />
            </div>
            
            {method.enabled && Object.keys(method.settings).length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(method.settings).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <Input 
                      type={key.includes('secret') || key.includes('key') ? "password" : "text"}
                      placeholder={`Enter ${key}`}
                      value={value}
                      onChange={(e) => {
                        setPaymentMethods(prev => prev.map(m => 
                          m.id === method.id 
                            ? { ...m, settings: { ...m.settings, [key]: e.target.value } }
                            : m
                        ));
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <Button onClick={handleSavePaymentMethods} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Payment Methods
        </Button>
      </CardContent>
    </Card>
  );
}
