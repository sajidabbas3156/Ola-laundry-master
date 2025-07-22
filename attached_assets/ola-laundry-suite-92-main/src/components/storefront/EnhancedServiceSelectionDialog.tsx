
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, Sparkles, Zap } from "lucide-react";
import { defaultServiceCategories } from "@/lib/defaultInventory";
import { useLocalization } from "@/contexts/LocalizationContext";
import { ItemIcon } from "@/components/ui/item-icon";

interface EnhancedServiceSelectionDialogProps {
  showServiceDialog: boolean;
  setShowServiceDialog: (show: boolean) => void;
  selectedItem: any;
  selectedServiceId: string;
  setSelectedServiceId: (serviceId: string) => void;
  onAddToCartWithService: () => void;
}

const serviceIcons = {
  "wash-fold": Shirt,
  "wash-iron": Zap,
  "dry-cleaning": Sparkles,
  "iron-only": Zap
};

export function EnhancedServiceSelectionDialog({
  showServiceDialog,
  setShowServiceDialog,
  selectedItem,
  selectedServiceId,
  setSelectedServiceId,
  onAddToCartWithService
}: EnhancedServiceSelectionDialogProps) {
  const { formatCurrency } = useLocalization();

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    // Auto add to cart after service selection
    setTimeout(() => {
      onAddToCartWithService();
    }, 300);
  };

  if (!selectedItem) return null;

  return (
    <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
      <DialogContent className="sm:max-w-md max-w-[90vw] mx-auto rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
            <ItemIcon item={selectedItem} size="lg" />
          </div>
          
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedItem.name}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Choose your preferred service type
            </DialogDescription>
            <div className="flex justify-center">
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Base Price: {formatCurrency(selectedItem.price)}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          {defaultServiceCategories.map(service => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons] || Shirt;
            const finalPrice = selectedItem.price * service.priceMultiplier;
            const isSelected = selectedServiceId === service.id;
            
            return (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl transition-colors ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={isSelected ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {service.priceMultiplier}x
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        {formatCurrency(finalPrice)}
                      </div>
                      {service.priceMultiplier !== 1 && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(selectedItem.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">
            Select a service to automatically add to cart
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowServiceDialog(false)}
            className="w-full rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
