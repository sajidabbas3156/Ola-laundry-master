
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultServiceCategories, InventoryItem, ServiceCategory, updateItemAvailability, updateItemPrice, updateItemServiceAvailability } from "@/lib/defaultInventory";
import { toast } from "@/components/ui/sonner";
import { ServiceConfig } from "@/components/pos/inventory/ServiceConfig";
import { ItemsGrid } from "@/components/pos/inventory/ItemsGrid";

interface InventoryManagerProps {
  inventory: InventoryItem[];
  updateInventory: (newInventory: InventoryItem[]) => void;
  serviceCategories?: any[];
  updateServiceCategories?: (categories: any[]) => void;
}

export function InventoryManager({ 
  inventory, 
  updateInventory, 
  serviceCategories = defaultServiceCategories,
  updateServiceCategories 
}: InventoryManagerProps) {
  const handleAvailabilityToggle = (itemId: string, isAvailable: boolean) => {
    const updatedInventory = updateItemAvailability(inventory, itemId, isAvailable);
    updateInventory(updatedInventory);
    toast.success(`${isAvailable ? "Enabled" : "Disabled"} item successfully`);
  };

  const handleServiceToggle = (itemId: string, service: ServiceCategory, enabled: boolean) => {
    const updatedInventory = updateItemServiceAvailability(inventory, itemId, service, enabled);
    updateInventory(updatedInventory);
    toast.success(`${enabled ? "Enabled" : "Disabled"} ${service} service for this item`);
  };

  const handlePriceUpdate = (itemId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    
    const updatedInventory = updateItemPrice(inventory, itemId, newPrice);
    updateInventory(updatedInventory);
    toast.success("Price updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory & Service Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="items">
          <TabsList className="mb-4">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServiceConfig 
              serviceCategories={serviceCategories}
              updateServiceCategories={updateServiceCategories}
            />
          </TabsContent>

          <TabsContent value="items">
            <ItemsGrid
              inventory={inventory}
              serviceCategories={serviceCategories}
              onAvailabilityToggle={handleAvailabilityToggle}
              onServiceToggle={handleServiceToggle}
              onPriceUpdate={handlePriceUpdate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
