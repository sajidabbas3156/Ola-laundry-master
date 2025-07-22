
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryHeader } from "@/components/admin/inventory/InventoryHeader";
import { InventoryGrid } from "@/components/admin/inventory/InventoryGrid";
import { InventoryFormDialog } from "@/components/admin/inventory/InventoryFormDialog";
import { useInventoryForm } from "@/hooks/useInventoryForm";

export default function InventoryManagement() {
  const [items, setItems] = useState([
    {
      id: "1",
      name: "White T-Shirt",
      description: "Cotton white t-shirt",
      price: 5.99,
      category: "clothing",
      image: null,
      isAvailable: true
    },
    {
      id: "2", 
      name: "Bed Sheets",
      description: "Queen size bed sheets",
      price: 12.99,
      category: "bedding",
      image: null,
      isAvailable: true
    }
  ]);

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    editingItem,
    formData,
    setFormData,
    categories,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleImageUpload,
    handleAddNew
  } = useInventoryForm(items, setItems);

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <InventoryHeader onAddNew={handleAddNew} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryGrid
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <InventoryFormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        categories={categories}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}
