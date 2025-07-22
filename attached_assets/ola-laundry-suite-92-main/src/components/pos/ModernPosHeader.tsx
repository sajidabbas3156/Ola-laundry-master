
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LaundryPosIcon } from "@/components/icons/LaundryPosIcon";

interface ModernPosHeaderProps {
  tenantName?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  cartCount?: number;
  onCartClick?: () => void;
}

export function ModernPosHeader({
  tenantName,
  searchQuery,
  setSearchQuery,
  categories,
  activeCategory,
  setActiveCategory,
  cartCount,
  onCartClick
}: ModernPosHeaderProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="p-4 space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LaundryPosIcon size="md" variant="gradient" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {tenantName ? `${tenantName} POS` : "Laundry POS"}
              </h1>
              <p className="text-sm text-gray-500">Point of Sale System</p>
            </div>
          </div>
          
          {/* Mobile Cart Button */}
          {cartCount !== undefined && onCartClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCartClick}
              className="md:hidden relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-green-500">
                  {cartCount}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max">
              <TabsTrigger value="all" className="whitespace-nowrap">All Items</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="whitespace-nowrap capitalize">
                  {category.replace('-', ' ')}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
