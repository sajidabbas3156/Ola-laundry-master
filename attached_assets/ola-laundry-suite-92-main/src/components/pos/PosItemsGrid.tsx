
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/lib/defaultInventory";
import { getEnhancedItemIcon } from "./EnhancedServiceIcons";

interface PosItemsGridProps {
  items: InventoryItem[];
  viewMode: "grid" | "list";
  onItemClick: (item: InventoryItem) => void;
  formatCurrency: (amount: number) => string;
}

export function PosItemsGrid({ items, viewMode, onItemClick, formatCurrency }: PosItemsGridProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {items.map(item => (
          <Card 
            key={item.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-0 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden group"
            onClick={() => onItemClick(item)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {getEnhancedItemIcon(item.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 text-gray-900">{item.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200">
                    {item.category}
                  </Badge>
                  <p className="text-sm sm:text-lg font-bold text-blue-600 mt-1 sm:mt-2">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <Button size="sm" className="w-full text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-1 sm:py-2">
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <Card 
          key={item.id}
          className="cursor-pointer transition-all duration-200 hover:shadow-md border-0 bg-white/90 backdrop-blur-sm rounded-xl"
          onClick={() => onItemClick(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="hover:scale-110 transition-transform duration-300">
                  {getEnhancedItemIcon(item.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <Badge variant="outline" className="text-xs mt-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200">
                    {item.category}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(item.price)}
                </div>
                <Button size="sm" className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
