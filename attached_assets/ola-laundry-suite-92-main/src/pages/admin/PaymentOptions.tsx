
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { CreditCard, Smartphone, Building, Globe, Shield, Settings } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  settings?: Record<string, any>;
}

export default function PaymentOptions() {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "stripe",
      name: "Stripe",
      description: "Credit card processing with Stripe",
      icon: CreditCard,
      enabled: true,
      settings: { publishableKey: "pk_test_...", secretKey: "sk_test_..." }
    },
    {
      id: "paypal",
      name: "PayPal", 
      description: "PayPal payment processing",
      icon: Globe,
      enabled: false,
      settings: { clientId: "", clientSecret: "" }
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      description: "Mobile money payments",
      icon: Smartphone,
      enabled: true,
      settings: { shortCode: "174379", passkey: "" }
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Direct bank transfers",
      icon: Building,
      enabled: true,
      settings: { accountNumber: "", routingNumber: "" }
    }
  ]);

  const handleToggle = async (methodId: string, enabled: boolean) => {
    setLoading(true);
    try {
      setPaymentMethods(prev =>
        prev.map(method =>
          method.id === methodId ? { ...method, enabled } : method
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      const method = paymentMethods.find(m => m.id === methodId);
      toast.success(`${enabled ? "Enabled" : "Disabled"} ${method?.name}`);
    } catch (error) {
      toast.error("Failed to update payment method");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Options</h1>
          <p className="text-gray-600 mt-1">Manage global payment methods for all tenants</p>
        </div>
        <Button disabled={loading}>
          <Settings className="h-4 w-4 mr-2" />
          Global Settings
        </Button>
      </div>

      <div className="grid gap-6">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <method.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {method.name}
                      <Badge variant={method.enabled ? "default" : "secondary"}>
                        {method.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor={`${method.id}-enabled`}>Enable</Label>
                  <Switch
                    id={`${method.id}-enabled`}
                    checked={method.enabled}
                    onCheckedChange={(checked) => handleToggle(method.id, checked)}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardHeader>
            
            {method.enabled && method.settings && (
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(method.settings).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Input
                        type={key.includes('secret') || key.includes('key') ? 'password' : 'text'}
                        defaultValue={value as string}
                        placeholder={`Enter ${key}`}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Secure connection established</span>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
