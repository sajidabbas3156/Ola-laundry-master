
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search } from "lucide-react";

interface EnhancedStorefrontHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartLength: number;
  onCartClick: () => void;
}

export function EnhancedStorefrontHeader({ 
  searchQuery, 
  setSearchQuery, 
  cartLength, 
  onCartClick 
}: EnhancedStorefrontHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-0 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Our Services
          </h1>
          <p className="text-gray-600">
            Select items and services for your laundry order
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Cart Button */}
          <Button 
            variant="outline"
            className="relative h-12 px-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors min-h-[48px]"
            onClick={onCartClick}
            disabled={cartLength === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartLength > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white min-w-[20px] h-5 text-xs flex items-center justify-center rounded-full">
                {cartLength}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
