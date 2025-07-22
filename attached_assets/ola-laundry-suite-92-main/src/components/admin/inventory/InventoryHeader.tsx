
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface InventoryHeaderProps {
  onAddNew: () => void;
}

export function InventoryHeader({ onAddNew }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl md:text-3xl font-bold">Inventory Management</h1>
      <Button onClick={onAddNew} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Add New Item
      </Button>
    </div>
  );
}
