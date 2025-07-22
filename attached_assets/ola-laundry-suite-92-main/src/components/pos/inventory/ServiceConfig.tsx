
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

interface ServiceConfigProps {
  serviceCategories: any[];
  updateServiceCategories?: (categories: any[]) => void;
}

export function ServiceConfig({ serviceCategories, updateServiceCategories }: ServiceConfigProps) {
  const handleServicePriceUpdate = (serviceId: string, newMultiplier: number) => {
    if (!updateServiceCategories || isNaN(newMultiplier) || newMultiplier < 0) return;
    
    const updatedCategories = serviceCategories.map(service => 
      service.id === serviceId 
        ? { ...service, priceMultiplier: newMultiplier }
        : service
    );
    
    updateServiceCategories(updatedCategories);
    toast.success("Service price multiplier updated successfully");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Service Price Configuration</h3>
      <div className="grid gap-4">
        {serviceCategories.map((service) => (
          <div key={service.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{service.name}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Label>Price Multiplier:</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={service.priceMultiplier}
                  onChange={(e) => handleServicePriceUpdate(service.id, parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">x</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
