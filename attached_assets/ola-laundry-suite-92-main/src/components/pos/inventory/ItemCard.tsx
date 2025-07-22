
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InventoryItem, ServiceCategory } from "@/lib/defaultInventory";

interface ItemCardProps {
  item: InventoryItem;
  serviceCategories: any[];
  onAvailabilityToggle: (itemId: string, isAvailable: boolean) => void;
  onServiceToggle: (itemId: string, service: ServiceCategory, enabled: boolean) => void;
  onPriceUpdate: (itemId: string, newPrice: number) => void;
}

export function ItemCard({
  item,
  serviceCategories,
  onAvailabilityToggle,
  onServiceToggle,
  onPriceUpdate
}: ItemCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium text-lg">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <Badge variant="outline" className="mt-1">{item.category}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`available-${item.id}`}
            checked={item.isAvailable}
            onCheckedChange={(checked) => onAvailabilityToggle(item.id, checked)}
          />
          <Label htmlFor={`available-${item.id}`}>
            {item.isAvailable ? "Available" : "Unavailable"}
          </Label>
        </div>
      </div>
      
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="font-medium mb-2">Base Price</h4>
          <div className="flex items-center">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.price}
              onChange={(e) => onPriceUpdate(item.id, parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="ml-2">USD</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Available Services</h4>
          <div className="space-y-2">
            {serviceCategories.map(service => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${item.id}-${service.id}`}
                    checked={item.enabledForServices[service.id as ServiceCategory]}
                    onCheckedChange={(checked) => 
                      onServiceToggle(item.id, service.id as ServiceCategory, checked)
                    }
                  />
                  <Label htmlFor={`${item.id}-${service.id}`}>
                    {service.name} ({service.priceMultiplier}x)
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
