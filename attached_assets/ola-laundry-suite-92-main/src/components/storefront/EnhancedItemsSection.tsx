
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus } from "lucide-react";
import { ItemIcon } from "@/components/ui/item-icon";
import { useLocalization } from "@/contexts/LocalizationContext";
import { cn } from "@/lib/utils";

interface EnhancedItemsSectionProps {
  inventory: any[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddToCart: (item: any) => void;
}

export function EnhancedItemsSection({
  inventory,
  activeCategory,
  setActiveCategory,
  searchQuery,
  onAddToCart
}: EnhancedItemsSectionProps) {
  const { formatCurrency } = useLocalization();

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    return inventory.filter(
      item => 
        item.isAvailable && 
        (activeCategory === "all" || item.category === activeCategory) &&
        (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [inventory, activeCategory, searchQuery]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(
      new Set(inventory
        .filter(item => item.isAvailable)
        .map(item => item.category))
    );
  }, [inventory]);

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-white/20 rounded-xl">
            <Package className="h-6 w-6" />
          </div>
          Available Items & Services
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1 h-auto p-1 bg-gray-100 rounded-xl">
            <TabsTrigger value="all" className="text-sm py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              All Items
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="text-sm py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm capitalize"
              >
                {category.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-10 w-10 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-sm">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={cn(
                      "group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl overflow-hidden",
                      "hover:scale-105 active:scale-95"
                    )}
                    onClick={() => onAddToCart(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        {/* Item Icon */}
                        <div className="relative p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                          <ItemIcon item={item} size="md" />
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-blue-600 text-white rounded-full p-1 shadow-lg">
                              <Plus className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Item Details */}
                        <div className="space-y-2 w-full">
                          <h3 className="font-semibold text-sm line-clamp-2 leading-tight text-gray-900">
                            {item.name}
                          </h3>
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            {item.category.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        {/* Price */}
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(item.price)}
                        </div>
                        
                        {/* Add Button */}
                        <Button 
                          size="sm" 
                          className="w-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg"
                        >
                          Select Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
