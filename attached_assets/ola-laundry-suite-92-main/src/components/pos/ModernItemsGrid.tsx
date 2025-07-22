
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { ItemIcon } from "@/components/ui/item-icon";
import { InventoryItem } from "@/lib/defaultInventory";
import { cn } from "@/lib/utils";

interface ModernItemsGridProps {
  items: InventoryItem[];
  onItemClick: (item: InventoryItem) => void;
  formatCurrency: (amount: number) => string;
}

export function ModernItemsGrid({
  items,
  onItemClick,
  formatCurrency
}: ModernItemsGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Package className="h-10 w-10 opacity-50" />
        </div>
        <h3 className="text-lg font-medium mb-2">No items found</h3>
        <p className="text-sm">Try adjusting your search or category filter.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className={cn(
            "group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl overflow-hidden",
            "hover:scale-105 active:scale-95"
          )}
          onClick={() => onItemClick(item)}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              {/* Item Icon */}
              <div className="relative p-3 sm:p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                <ItemIcon item={item} size="sm" className="sm:w-8 sm:h-8" />
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-blue-600 text-white rounded-full p-1 shadow-lg">
                    <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                  </div>
                </div>
              </div>
              
              {/* Item Details */}
              <div className="space-y-1 sm:space-y-2 w-full">
                <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-tight text-gray-900">
                  {item.name}
                </h3>
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                  {item.category.replace('-', ' ')}
                </Badge>
              </div>
              
              {/* Price */}
              <div className="text-sm sm:text-lg font-bold text-blue-600">
                {formatCurrency(item.price)}
              </div>
              
              {/* Add Button */}
              <Button 
                size="sm" 
                className="w-full text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg py-1 sm:py-2"
              >
                Select Service
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
