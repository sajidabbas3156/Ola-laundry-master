
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Package } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface PricingSettingsTabProps {
  pricingPlans: PricingPlan[];
  setPricingPlans: Dispatch<SetStateAction<PricingPlan[]>>;
}

export function PricingSettingsTab({
  pricingPlans,
  setPricingPlans
}: PricingSettingsTabProps) {
  const handleSavePricingSettings = () => {
    console.log("Saving pricing settings:", pricingPlans);
    toast.success("Pricing plans updated successfully");
  };

  const updatePricingPlan = (planId: string, field: string, value: any) => {
    setPricingPlans(prev =>
      prev.map(plan =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          <Package className="h-5 w-5" />
          Subscription Plans & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-4 relative">
              {plan.popular && (
                <Badge className="absolute -top-2 left-4">Most Popular</Badge>
              )}
              
              <div className="space-y-4">
                <div>
                  <Input
                    value={plan.name}
                    onChange={(e) => updatePricingPlan(plan.id, 'name', e.target.value)}
                    className="font-bold text-lg"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">$</span>
                  <Input
                    type="number"
                    value={plan.price}
                    onChange={(e) => updatePricingPlan(plan.id, 'price', parseInt(e.target.value))}
                    className="text-2xl font-bold w-24"
                  />
                  <span className="text-gray-500">/month</span>
                </div>
                
                <div className="space-y-2">
                  <Label>Features</Label>
                  {plan.features.map((feature, index) => (
                    <Input
                      key={index}
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...plan.features];
                        newFeatures[index] = e.target.value;
                        updatePricingPlan(plan.id, 'features', newFeatures);
                      }}
                      className="text-sm"
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newFeatures = [...plan.features, 'New Feature'];
                      updatePricingPlan(plan.id, 'features', newFeatures);
                    }}
                  >
                    Add Feature
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button onClick={handleSavePricingSettings} className="w-full sm:w-auto">
          Save Pricing Plans
        </Button>
      </CardContent>
    </Card>
  );
}
