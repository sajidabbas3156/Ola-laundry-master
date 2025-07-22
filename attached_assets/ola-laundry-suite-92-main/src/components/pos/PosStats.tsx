
import { ShoppingCart, Printer, Monitor, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PosStatsProps {
  cartItemsCount: number;
  cartTotal: number;
  availableItemsCount: number;
  categoriesCount: number;
  formatCurrency: (amount: number) => string;
}

export function PosStats({
  cartItemsCount,
  cartTotal,
  availableItemsCount,
  categoriesCount,
  formatCurrency
}: PosStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Cart Items</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{cartItemsCount}</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Cart Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(cartTotal)}</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Available Items</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{availableItemsCount}</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Categories</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{categoriesCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}
