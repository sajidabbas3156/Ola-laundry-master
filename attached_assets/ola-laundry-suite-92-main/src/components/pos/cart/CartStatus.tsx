
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartStatusProps {
  itemCount: number;
}

export function CartStatus({ itemCount }: CartStatusProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <span className="font-medium">Order Summary</span>
      </div>
      {itemCount > 0 && (
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Badge>
      )}
    </div>
  );
}
