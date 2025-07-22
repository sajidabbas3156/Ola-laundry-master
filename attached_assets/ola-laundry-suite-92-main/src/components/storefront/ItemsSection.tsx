
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";
import { ItemIcon } from "@/components/ui/item-icon";
import { useLocalization } from "@/contexts/LocalizationContext";

interface ItemsSectionProps {
  inventory: any[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddToCart: (item: any) => void;
}

export function ItemsSection({
  inventory,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  onAddToCart
}: ItemsSectionProps) {
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
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg py-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Package className="h-6 w-6" />
          Available Items & Services
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search items by name..."
            className="pl-10 h-10 border-2 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1 h-auto p-1 mb-6">
            <TabsTrigger value="all" className="text-sm py-2">
              All Items
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-sm py-2 capitalize">
                {category.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory}>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-sm">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-white hover:bg-primary/5"
                    onClick={() => onAddToCart(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                          <ItemIcon item={item} size="md" />
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                            {item.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {item.category.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="text-lg font-bold text-primary">
                          {formatCurrency(item.price)}
                        </div>
                        
                        <Button size="sm" className="w-full opacity-0 group-hover:opacity-100 transition-opacity">
                          Add to Cart
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
