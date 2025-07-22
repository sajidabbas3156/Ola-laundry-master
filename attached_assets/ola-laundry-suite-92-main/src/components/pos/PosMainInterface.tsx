
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { ItemGrid } from "@/components/pos/ItemGrid";
import { CartSection } from "@/components/pos/CartSection";
import { CartItem } from "@/types/pos";
import { InventoryItem } from "@/lib/defaultInventory";

interface PosMainInterfaceProps {
  availableItems: InventoryItem[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addToCart: (item: InventoryItem) => void;
  cart: CartItem[];
  removeFromCart: (itemId: string) => void;
  addItemQuantity: (index: number) => void;
  deleteFromCart: (itemId: string) => void;
  cartTotal: number;
  formatCurrency: (amount: number) => string;
  notes: string;
  setNotes: (notes: string) => void;
  handleCheckout: () => Promise<void>;
  isProcessing: boolean;
  selectedCustomer: string;
  tenantCustomers: any[];
  setSelectedCustomer: (customerId: string) => void;
}

export function PosMainInterface({
  availableItems,
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  addToCart,
  cart,
  removeFromCart,
  addItemQuantity,
  deleteFromCart,
  cartTotal,
  formatCurrency,
  notes,
  setNotes,
  handleCheckout,
  isProcessing,
  selectedCustomer,
  tenantCustomers,
  setSelectedCustomer
}: PosMainInterfaceProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Items Grid */}
      <div className="xl:col-span-3">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <ShoppingCart className="h-6 w-6" />
              Service Items & Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ItemGrid
              tenantLaundryItems={availableItems}
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              addToCart={addToCart}
            />
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="xl:col-span-1">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm sticky top-4">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <ShoppingCart className="h-6 w-6" />
              Current Order
              {cart.length > 0 && (
                <Badge className="bg-white text-green-700 ml-auto">
                  {cart.length} items
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <CartSection
              cart={cart}
              removeFromCart={removeFromCart}
              addItemQuantity={addItemQuantity}
              deleteFromCart={deleteFromCart}
              cartTotal={cartTotal}
              formatCurrency={formatCurrency}
              notes={notes}
              setNotes={setNotes}
              handleCheckout={handleCheckout}
              tenantCustomers={tenantCustomers}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
