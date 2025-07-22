
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { CreditCard, Save, Plus } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  processingFee: number;
  settings: Record<string, string>;
}

export function PaymentMethodsSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "cash", name: "Cash", enabled: true, processingFee: 0, settings: {} },
    { id: "card", name: "Credit/Debit Card", enabled: true, processingFee: 2.9, settings: {} },
    { id: "stripe", name: "Stripe", enabled: false, processingFee: 2.9, settings: { publishableKey: "", secretKey: "" } },
    { id: "paypal", name: "PayPal", enabled: false, processingFee: 3.5, settings: { clientId: "", clientSecret: "" } },
    { id: "benefit", name: "Benefit Pay", enabled: true, processingFee: 1.5, settings: {} }
  ]);

  const handleToggleMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleUpdateFee = (id: string, fee: number) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, processingFee: fee } : method
      )
    );
  };

  const handleSave = () => {
    localStorage.setItem('payment_methods_settings', JSON.stringify(paymentMethods));
    toast.success("Payment methods settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods Configuration
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
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Fee %:</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={method.processingFee}
                    onChange={(e) => handleUpdateFee(method.id, parseFloat(e.target.value))}
                    className="w-20"
                  />
                </div>
                <Switch 
                  checked={method.enabled}
                  onCheckedChange={() => handleToggleMethod(method.id)}
                />
              </div>
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
        
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Payment Methods
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
