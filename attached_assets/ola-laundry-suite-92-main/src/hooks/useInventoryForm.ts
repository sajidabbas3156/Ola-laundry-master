
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string | null;
}

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isAvailable: boolean;
}

export function useInventoryForm(
  items: InventoryItem[],
  setItems: (items: InventoryItem[]) => void
) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null
  });

  const categories = ["clothing", "bedding", "accessories", "delicates"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newItem: InventoryItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      isAvailable: true
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? newItem : item));
      toast.success("Item updated successfully");
    } else {
      setItems([...items, newItem]);
      toast.success("Item added successfully");
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null
    });
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success("Item deleted successfully");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a cloud service
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return {
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
  };
}
