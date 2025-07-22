
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ServicePrice {
  id: string;
  name: string;
  price: number;
}

interface ServicePricingSectionProps {
  servicePrices: ServicePrice[];
  updateServicePrices: (prices: ServicePrice[]) => void;
}

export function ServicePricingSection({ servicePrices, updateServicePrices }: ServicePricingSectionProps) {
  const updateServicePrice = (id: string, field: 'name' | 'price', value: string | number) => {
    const updatedPrices = servicePrices.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    );
    updateServicePrices(updatedPrices);
  };

  const addNewService = () => {
    const newId = Date.now().toString();
    const newPrices = [...servicePrices, { id: newId, name: "", price: 0 }];
    updateServicePrices(newPrices);
  };

  const removeService = (id: string) => {
    if (servicePrices.length > 1) {
      const updatedPrices = servicePrices.filter(service => service.id !== id);
      updateServicePrices(updatedPrices);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Service Pricing</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewService}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>
      
      <div className="space-y-3">
        {servicePrices.map((service, index) => (
          <div key={service.id} className="flex gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor={`service-name-${service.id}`}>
                Service {index + 1} Name
              </Label>
              <Input
                id={`service-name-${service.id}`}
                value={service.name}
                onChange={(e) => updateServicePrice(service.id, 'name', e.target.value)}
                placeholder="Service name"
              />
            </div>
            <div className="w-32">
              <Label htmlFor={`service-price-${service.id}`}>Price</Label>
              <Input
                id={`service-price-${service.id}`}
                type="number"
                step="0.01"
                value={service.price}
                onChange={(e) => updateServicePrice(service.id, 'price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            {servicePrices.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeService(service.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
