
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Printer } from "lucide-react";
import { ItemGrid } from "@/components/pos/ItemGrid";
import { CartSection } from "@/components/pos/CartSection";
import { InventoryManager } from "@/components/pos/InventoryManager";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InventoryItem } from "@/lib/defaultInventory";
import { CartItem } from "@/types/pos";

interface PosTabContentProps {
  activeTab: string;
  // POS tab props
  availableItems: InventoryItem[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showServiceSelection: (item: InventoryItem) => void;
  cart: CartItem[];
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  removeFromCart: (itemId: string) => void;
  addItemQuantity: (index: number) => void;
  deleteFromCart: (itemId: string) => void;
  cartTotal: number;
  handleCheckout: () => Promise<void>;
  formatCurrency: (amount: number) => string;
  isProcessing: boolean;
  // Inventory tab props
  inventory: InventoryItem[];
  updateInventory: (inventory: InventoryItem[]) => void;
}

export function PosTabContent({
  activeTab,
  availableItems,
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  showServiceSelection,
  cart,
  tenantCustomers,
  selectedCustomer,
  setSelectedCustomer,
  notes,
  setNotes,
  removeFromCart,
  addItemQuantity,
  deleteFromCart,
  cartTotal,
  handleCheckout,
  formatCurrency,
  isProcessing,
  inventory,
  updateInventory
}: PosTabContentProps) {
  if (activeTab === "pos") {
    return (
      <div className="grid gap-3 lg:gap-4 lg:grid-cols-3">
        {/* Service Items Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg py-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-4 w-4" />
                Service Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <ItemGrid
                tenantLaundryItems={availableItems}
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                addToCart={showServiceSelection}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Cart Section */}
        <div>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-4">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg py-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Printer className="h-4 w-4" />
                Shopping Cart
                {cart.length > 0 && (
                  <span className="ml-auto bg-white text-green-700 rounded-full px-2 py-1 text-xs font-medium">
                    {cart.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <CartSection
                cart={cart}
                tenantCustomers={tenantCustomers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                notes={notes}
                setNotes={setNotes}
                removeFromCart={removeFromCart}
                addItemQuantity={addItemQuantity}
                deleteFromCart={deleteFromCart}
                cartTotal={cartTotal}
                handleCheckout={handleCheckout}
                formatCurrency={formatCurrency}
              />
              
              {isProcessing && (
                <div className="flex items-center justify-center gap-2 mt-3 p-3 bg-blue-50 rounded-lg">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm text-blue-700">Processing order...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (activeTab === "inventory") {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg py-3">
          <CardTitle className="text-lg">Inventory Management</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <InventoryManager 
            inventory={inventory} 
            updateInventory={updateInventory} 
          />
        </CardContent>
      </Card>
    );
  }

  return null;
}
