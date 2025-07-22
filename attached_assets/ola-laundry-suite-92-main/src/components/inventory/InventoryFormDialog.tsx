
import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/lib/defaultInventory";
import { BasicItemFields } from "./form/BasicItemFields";
import { ServicePricingSection } from "./form/ServicePricingSection";
import { ImageUploadSection } from "./form/ImageUploadSection";

interface ServicePrice {
  id: string;
  name: string;
  price: number;
}

interface InventoryFormDialogProps {
  editingItem: InventoryItem | null;
  onSubmit: (itemData: Omit<InventoryItem, 'id' | 'tenantId' | 'enabledForServices'>) => void;
  onClose: () => void;
}

export function InventoryFormDialog({ editingItem, onSubmit, onClose }: InventoryFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: null as string | null,
    isAvailable: true
  });

  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([
    { id: "1", name: "Wash & Iron", price: 0 },
    { id: "2", name: "Wash Only", price: 0 },
    { id: "3", name: "Iron Only", price: 0 },
    { id: "4", name: "Dry Cleaning", price: 0 }
  ]);

  const categories = ["clothing", "bedding", "accessories", "delicates"];

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description,
        category: editingItem.category,
        image: editingItem.image,
        isAvailable: editingItem.isAvailable
      });
      // Set base price as the first service price for backward compatibility
      const basePrice = editingItem.price || 0;
      setServicePrices([
        { id: "1", name: "Wash & Iron", price: basePrice },
        { id: "2", name: "Wash Only", price: basePrice * 0.8 },
        { id: "3", name: "Iron Only", price: basePrice * 0.6 },
        { id: "4", name: "Dry Cleaning", price: basePrice * 1.5 }
      ]);
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        image: null,
        isAvailable: true
      });
      setServicePrices([
        { id: "1", name: "Wash & Iron", price: 0 },
        { id: "2", name: "Wash Only", price: 0 },
        { id: "3", name: "Iron Only", price: 0 },
        { id: "4", name: "Dry Cleaning", price: 0 }
      ]);
    }
  }, [editingItem]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || servicePrices.length === 0) {
      return;
    }

    // Use the first service price as the base price for backward compatibility
    const basePrice = servicePrices[0]?.price || 0;

    onSubmit({
      name: formData.name,
      description: formData.description,
      price: basePrice,
      category: formData.category,
      image: formData.image,
      isAvailable: formData.isAvailable
    });
  };

  return (
    <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {editingItem ? "Edit Item" : "Add New Item"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicItemFields
          formData={formData}
          updateFormData={updateFormData}
          categories={categories}
        />

        <ServicePricingSection
          servicePrices={servicePrices}
          updateServicePrices={setServicePrices}
        />

        <ImageUploadSection
          image={formData.image}
          onImageChange={(image) => updateFormData({ image })}
        />

        <div className="flex gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {editingItem ? "Update" : "Add"} Item
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
