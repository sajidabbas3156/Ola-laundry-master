
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem } from "@/types/pos";
import { Badge } from "@/components/ui/badge";

interface CartItemDisplayProps {
  item: CartItem;
  onRemove: (itemId: string) => void;
  onAdd: (index: number) => void;
  onDelete: (itemId: string) => void;
  formatCurrency: (amount: number) => string;
  index: number;
}

export function CartItemDisplay({ 
  item, 
  onRemove, 
  onAdd, 
  onDelete, 
  formatCurrency,
  index
}: CartItemDisplayProps) {
  const totalItemPrice = item.price * item.quantity;
  
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <p className="text-xs text-muted-foreground">
            {formatCurrency(item.price)} × {item.quantity}
          </p>
          {item.service && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              {item.service.name.slice(0, 4)}
            </Badge>
          )}
        </div>
        <p className="text-sm font-medium text-primary">
          {formatCurrency(totalItemPrice)}
        </p>
      </div>
      <div className="flex items-center gap-1 ml-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => onRemove(item.id)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => onAdd(index)}
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-red-500"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
