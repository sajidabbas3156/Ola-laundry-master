
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InventoryItem, defaultServiceCategories } from "@/lib/defaultInventory";
import { ItemIcon } from "@/components/ui/item-icon";

interface EnhancedServiceSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: InventoryItem | null;
  selectedServiceId: string;
  setSelectedServiceId: (serviceId: string) => void;
  onAddToCartWithService: () => void;
  formatCurrency: (amount: number) => string;
}

export function EnhancedServiceSelectionDialog({
  open,
  onOpenChange,
  selectedItem,
  selectedServiceId,
  setSelectedServiceId,
  onAddToCartWithService,
  formatCurrency
}: EnhancedServiceSelectionDialogProps) {
  if (!selectedItem) return null;

  const availableServices = defaultServiceCategories.filter(service =>
    selectedItem.enabledForServices[service.id as keyof typeof selectedItem.enabledForServices]
  );

  const selectedService = defaultServiceCategories.find(s => s.id === selectedServiceId);
  const finalPrice = selectedService ? selectedItem.price * selectedService.priceMultiplier : selectedItem.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Service</DialogTitle>
          <DialogDescription>
            Choose a service type for {selectedItem.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ItemIcon item={selectedItem} size="sm" />
                <div>
                  <h3 className="font-medium">{selectedItem.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {selectedItem.category.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Available Services</Label>
            <RadioGroup value={selectedServiceId} onValueChange={setSelectedServiceId}>
              {availableServices.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={service.id} id={service.id} />
                  <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{service.name}</span>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(selectedItem.price * service.priceMultiplier)}
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Price Summary */}
          {selectedService && (
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(finalPrice)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={onAddToCartWithService}
              disabled={!selectedServiceId}
              className="flex-1"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
