
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ServiceCategory, defaultServiceCategories } from "@/lib/defaultInventory";
import { ItemIcon } from "@/components/ui/item-icon";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Plus } from "lucide-react";

interface StorefrontItemGridProps {
  filteredItems: any[];
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  addToCart: (item: any) => void;
  activeService: ServiceCategory;
  formatCurrency: (amount: number) => string;
}

export function StorefrontItemGrid({
  filteredItems,
  categories,
  activeCategory,
  onCategoryChange,
  addToCart,
  activeService,
  formatCurrency
}: StorefrontItemGridProps) {
  return (
    <Tabs defaultValue="all" onValueChange={onCategoryChange}>
      <div className="overflow-x-auto mb-3">
        <TabsList className="w-full sm:w-auto min-w-full sm:min-w-0">
          <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">All Items</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs sm:text-sm px-2 sm:px-3">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      <ResponsiveGrid minItemWidth="140px" className="gap-2 sm:gap-3">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group w-full"
            onClick={() => addToCart(item)}
          >
            <div className="relative p-2 sm:p-3 flex items-center justify-center">
              <ItemIcon item={item} size="sm" />
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                </div>
              </div>
            </div>
            
            <div className="p-2 sm:p-3">
              <div className="flex items-start justify-between mb-1 gap-1">
                <h3 className="font-medium text-xs sm:text-sm line-clamp-2 leading-tight min-w-0">{item.name}</h3>
                <Badge variant="outline" className="text-xs flex-shrink-0 px-1 py-0">
                  {item.category.slice(0, 3)}
                </Badge>
              </div>
              
              {item.description && (
                <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                  {item.description}
                </p>
              )}
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground truncate">
                  {defaultServiceCategories.find(s => s.id === activeService)?.name.slice(0, 8)}...
                </p>
                <div className="text-sm sm:text-base font-semibold text-primary">
                  {formatCurrency(item.price * (defaultServiceCategories.find(s => s.id === activeService)?.priceMultiplier || 1))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGrid>
      
      {filteredItems.length === 0 && (
        <div className="col-span-full text-center p-4 sm:p-6 text-muted-foreground">
          <ItemIcon size="lg" className="mx-auto mb-3 opacity-50" />
          <h3 className="text-base sm:text-lg font-medium mb-2">No items found</h3>
          <p className="text-sm">Try adjusting your search or category filter.</p>
        </div>
      )}
    </Tabs>
  );
}
