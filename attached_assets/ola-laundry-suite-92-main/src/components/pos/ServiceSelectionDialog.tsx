
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { defaultServiceCategories } from "@/lib/defaultInventory";
import { getEnhancedServiceIcon } from "./EnhancedServiceIcons";

interface ServiceSelectionDialogProps {
  showServiceDialog: boolean;
  setShowServiceDialog: (show: boolean) => void;
  selectedItem: any;
  selectedServiceId: string;
  setSelectedServiceId: (serviceId: string) => void;
  onAddToCartWithService: () => void;
}

export function ServiceSelectionDialog({
  showServiceDialog,
  setShowServiceDialog,
  selectedItem,
  selectedServiceId,
  setSelectedServiceId,
  onAddToCartWithService
}: ServiceSelectionDialogProps) {
  return (
    <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⚙️</span>
            </div>
            Select Service Type
          </DialogTitle>
          <DialogDescription>
            Choose the service type for <span className="font-medium">{selectedItem?.name}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {defaultServiceCategories.map(service => (
              <Button
                key={service.id}
                variant={selectedServiceId === service.id ? "default" : "outline"}
                onClick={() => setSelectedServiceId(service.id)}
                className="justify-start h-auto p-4 text-left"
              >
                <div className="flex items-center gap-3 w-full">
                  {getEnhancedServiceIcon(service.name)}
                  <div className="flex-1">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                    {service.priceMultiplier}x
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={onAddToCartWithService} 
              disabled={!selectedServiceId}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowServiceDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
