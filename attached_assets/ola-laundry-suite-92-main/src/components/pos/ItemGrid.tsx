
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/lib/defaultInventory";
import { useLocalization } from "@/contexts/LocalizationContext";
import { ItemIcon } from "@/components/ui/item-icon";
import { Search, Settings, Grid, List } from "lucide-react";
import { useState } from "react";

interface ItemGridProps {
  tenantLaundryItems: InventoryItem[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addToCart: (item: InventoryItem) => void;
}

export function ItemGrid({
  tenantLaundryItems,
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  addToCart
}: ItemGridProps) {
  const { formatCurrency } = useLocalization();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filter items based on active category and search query
  const filteredItems = tenantLaundryItems.filter(
    item => (activeCategory === "all" || item.category === activeCategory) &&
    (searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      {/* Enhanced Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search items by name..."
            className="pl-10 h-10 border-2 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1 h-auto p-1">
          <TabsTrigger value="all" className="text-sm py-2">
            All Items
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-sm py-2 capitalize">
              {category.replace('-', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ItemIcon size="lg" className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No items found</h3>
              <p className="text-sm">Try adjusting your search or category filter.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-white hover:bg-primary/5"
                  onClick={() => addToCart(item)}
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
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="group hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/50 bg-white hover:bg-primary/5"
                  onClick={() => addToCart(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <ItemIcon item={item} size="sm" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-base">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category.replace('-', ' ')}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-xl font-bold text-primary">
                          {formatCurrency(item.price)}
                        </div>
                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
