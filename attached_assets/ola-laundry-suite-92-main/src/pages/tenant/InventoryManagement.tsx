
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { LayoutCard } from "@/components/ui/layout-card";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";
import { InventoryItem } from "@/lib/defaultInventory";
import { InventoryFormDialog } from "@/components/inventory/InventoryFormDialog";
import { InventoryItemCard } from "@/components/inventory/InventoryItemCard";
import { ItemIcon } from "@/components/ui/item-icon";

export default function TenantInventoryManagement() {
  const { currentTenant } = useTenant();
  const { inventory, updateInventory } = useData();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleSubmit = (itemData: Omit<InventoryItem, 'id' | 'tenantId' | 'enabledForServices'>) => {
    const newItem: InventoryItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      ...itemData,
      tenantId: currentTenant?.id || '',
      enabledForServices: {
        "wash-fold": true,
        "dry-cleaning": true,
        "wash-iron": true,
        "iron-only": true
      }
    };

    if (editingItem) {
      const updatedInventory = inventory.map(item => item.id === editingItem.id ? newItem : item);
      updateInventory(updatedInventory);
      toast.success("Item updated successfully");
    } else {
      updateInventory([...inventory, newItem]);
      toast.success("Item added successfully");
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    updateInventory(updatedInventory);
    toast.success("Item deleted successfully");
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Inventory Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your laundry service items</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="w-full sm:w-auto flex-shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <InventoryFormDialog
            editingItem={editingItem}
            onSubmit={handleSubmit}
            onClose={handleCloseDialog}
          />
        </Dialog>
      </div>

      <LayoutCard title="Current Inventory" className="w-full">
        <ResponsiveGrid minItemWidth="240px">
          {inventory.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ResponsiveGrid>
        
        {inventory.length === 0 && (
          <div className="text-center py-12">
            <ItemIcon size="lg" className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No items yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your first inventory item to get started.
            </p>
          </div>
        )}
      </LayoutCard>
    </div>
  );
}
