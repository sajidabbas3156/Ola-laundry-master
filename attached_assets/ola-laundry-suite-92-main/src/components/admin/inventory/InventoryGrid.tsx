
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ItemIcon } from "@/components/ui/item-icon";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isAvailable: boolean;
}

interface InventoryGridProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryGrid({ items, onEdit, onDelete }: InventoryGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <ItemIcon size="lg" className="mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No items yet</h3>
        <p className="text-sm text-muted-foreground">
          Add your first inventory item to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-center">
            <ItemIcon item={item} size="lg" />
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
              <Badge variant="outline" className="text-xs ml-2">
                {item.category}
              </Badge>
            </div>
            
            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
            
            <p className="text-lg font-semibold text-primary">
              ${item.price.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="flex-1"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
