
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Shirt, Zap, Sparkles } from "lucide-react";
import { defaultServiceCategories, ServiceCategory } from "@/lib/defaultInventory";

interface ServiceSelectionStepProps {
  selectedService: ServiceCategory | null;
  onServiceSelect: (service: ServiceCategory) => void;
  onContinue: () => void;
}

const serviceIcons = {
  "wash-fold": Shirt,
  "wash-iron": Zap,
  "dry-cleaning": Sparkles,
  "iron-only": Zap
};

export function ServiceSelectionStep({
  selectedService,
  onServiceSelect,
  onContinue
}: ServiceSelectionStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Select Service Type</h2>
        <p className="text-muted-foreground">Choose the service you want to offer to customers</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {defaultServiceCategories.map((service) => {
          const Icon = serviceIcons[service.id as keyof typeof serviceIcons] || Package;
          const isSelected = selectedService === service.id;
          
          return (
            <Card 
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => onServiceSelect(service.id as ServiceCategory)}
            >
              <CardContent className="p-4 text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {service.priceMultiplier}x price
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        <Button 
          onClick={onContinue}
          disabled={!selectedService}
          className="px-8"
        >
          Continue to Items
        </Button>
      </div>
    </div>
  );
}
