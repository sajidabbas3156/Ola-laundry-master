
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Search, Grid, List, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InventoryItem } from "@/lib/defaultInventory";
import { CartItem } from "@/types/pos";
import { cn } from "@/lib/utils";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";

interface EnhancedMobilePosInterfaceProps {
  availableItems: InventoryItem[];
  categories: string[];
  cart: CartItem[];
  onAddToCart: (item: InventoryItem) => void;
  onUpdateCart: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  formatCurrency: (amount: number) => string;
  onRefresh: () => Promise<void>;
}

export function EnhancedMobilePosInterface({
  availableItems,
  categories,
  cart,
  onAddToCart,
  onUpdateCart,
  onRemoveFromCart,
  formatCurrency,
  onRefresh
}: EnhancedMobilePosInterfaceProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("items");

  const filteredItems = availableItems.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PullToRefresh onRefresh={onRefresh}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Point of Sale</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="min-h-[44px]"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="min-h-[44px]"
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              autoComplete="off"
            />
          </div>

          {/* Categories - Only show when filters are open */}
          {showFilters && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("all")}
                className="shrink-0 min-h-[44px] px-4"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="shrink-0 min-h-[44px] px-4 capitalize"
                >
                  {category.replace('-', ' ')}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="items" className="min-h-[44px]">
              Items ({filteredItems.length})
            </TabsTrigger>
            <TabsTrigger value="cart" className="min-h-[44px] relative">
              Cart
              {cartCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {cartCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="mt-4 px-4">
            <div className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-2 gap-3" 
                : "space-y-3"
            )}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 active:scale-95",
                    viewMode === "grid" ? "aspect-square" : "min-h-[80px]"
                  )}
                  onClick={() => onAddToCart(item)}
                >
                  <div className={cn(
                    "p-4 h-full flex",
                    viewMode === "grid" ? "flex-col items-center justify-center text-center" : "items-center gap-4"
                  )}>
                    <div className={cn(
                      "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2",
                      viewMode === "list" && "mb-0 shrink-0"
                    )}>
                      <span className="text-xl">🧺</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-medium text-gray-900 mb-1",
                        viewMode === "grid" ? "text-sm line-clamp-2" : "text-base line-clamp-1"
                      )}>
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart" className="mt-4 px-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Cart is empty</h3>
                <p className="text-sm">Add items to start creating an order</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateCart(item.id, item.quantity - 1)}
                          className="min-h-[44px] min-w-[44px]"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateCart(item.id, item.quantity + 1)}
                          className="min-h-[44px] min-w-[44px]"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  <Button className="w-full min-h-[52px] text-lg font-medium">
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PullToRefresh>
    </div>
  );
}
