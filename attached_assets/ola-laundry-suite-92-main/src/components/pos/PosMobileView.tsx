
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { PosHeader } from "@/components/pos/PosHeader";
import { PosItemsGrid } from "@/components/pos/PosItemsGrid";
import { EnhancedMobileCartModal } from "@/components/pos/EnhancedMobileCartModal";
import { ServiceSelectionDialog } from "@/components/pos/ServiceSelectionDialog";
import { InventoryItem } from "@/lib/defaultInventory";
import { CartItem } from "@/types/pos";

interface PosMobileViewProps {
  currentTenant: any;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredItems: InventoryItem[];
  onItemClick: (item: InventoryItem) => void;
  formatCurrency: (amount: number) => string;
  cart: CartItem[];
  showServiceDialog: boolean;
  setShowServiceDialog: (show: boolean) => void;
  selectedItem: InventoryItem | null;
  selectedService: string;
  setSelectedService: (service: string) => void;
  handleAddToCart: () => void;
  onUpdateCart: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
  onCompleteOrder: () => void;
  showCartModal: boolean;
  setShowCartModal: (show: boolean) => void;
  serviceType: string;
  setServiceType: (type: string) => void;
  pickupDate: Date | undefined;
  setPickupDate: (date: Date | undefined) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (instructions: string) => void;
}

export function PosMobileView({
  currentTenant,
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  filteredItems,
  onItemClick,
  formatCurrency,
  cart,
  showServiceDialog,
  setShowServiceDialog,
  selectedItem,
  selectedService,
  setSelectedService,
  handleAddToCart,
  onUpdateCart,
  onRemoveFromCart,
  tenantCustomers,
  selectedCustomer,
  setSelectedCustomer,
  onCompleteOrder,
  showCartModal,
  setShowCartModal,
  serviceType,
  setServiceType,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  deliveryAddress,
  setDeliveryAddress,
  specialInstructions,
  setSpecialInstructions
}: PosMobileViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <PosHeader
        tenantName={currentTenant?.name}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode="grid"
        setViewMode={() => {}}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        cartLength={cart.length}
        onCartClick={() => setShowCartModal(true)}
      />

      {/* Items Grid */}
      <div className="p-4">
        <PosItemsGrid
          items={filteredItems}
          viewMode="grid"
          onItemClick={onItemClick}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 right-4 z-50">
          <Button 
            size="lg"
            className="rounded-full w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl"
            onClick={() => setShowCartModal(true)}
          >
            <div className="flex flex-col items-center">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xs font-bold">{cart.length}</span>
            </div>
          </Button>
        </div>
      )}

      {/* Enhanced Mobile Cart Modal with Scheduling */}
      <EnhancedMobileCartModal
        open={showCartModal}
        onOpenChange={setShowCartModal}
        cart={cart}
        onUpdateCart={onUpdateCart}
        onRemoveFromCart={onRemoveFromCart}
        formatCurrency={formatCurrency}
        tenantCustomers={tenantCustomers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        onCompleteOrder={onCompleteOrder}
        serviceType={serviceType}
        setServiceType={setServiceType}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        specialInstructions={specialInstructions}
        setSpecialInstructions={setSpecialInstructions}
      />

      {/* Service Selection Dialog */}
      <ServiceSelectionDialog
        showServiceDialog={showServiceDialog}
        setShowServiceDialog={setShowServiceDialog}
        selectedItem={selectedItem}
        selectedServiceId={selectedService}
        setSelectedServiceId={setSelectedService}
        onAddToCartWithService={handleAddToCart}
      />
    </div>
  );
}
