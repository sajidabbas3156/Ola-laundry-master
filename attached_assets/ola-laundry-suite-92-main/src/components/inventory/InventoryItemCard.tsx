
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutCard } from "@/components/ui/layout-card";
import { ItemIcon } from "@/components/ui/item-icon";
import { Edit, Trash2 } from "lucide-react";
import { InventoryItem } from "@/lib/defaultInventory";

interface InventoryItemCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryItemCard({ item, onEdit, onDelete }: InventoryItemCardProps) {
  return (
    <LayoutCard variant="compact" className="h-full">
      <div className="space-y-3">
        <div className="flex justify-center">
          <ItemIcon item={item} size="lg" />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm line-clamp-2 min-w-0">{item.name}</h3>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {item.category}
            </Badge>
          </div>
          
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          
          <p className="text-base sm:text-lg font-semibold text-primary">
            ${item.price.toFixed(2)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="flex-1 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-700 px-2"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </LayoutCard>
  );
}
