
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { InventoryItem, defaultServiceCategories } from "@/lib/defaultInventory";
import { CartItem } from "@/types/pos";
import { useTenant } from "@/contexts/TenantContext";
import { useCustomers } from "@/contexts/CustomerContext";
import { useData } from "@/contexts/DataContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { PosHeader } from "@/components/pos/PosHeader";
import { PosItemsGrid } from "@/components/pos/PosItemsGrid";
import { PosCartSidebar } from "@/components/pos/PosCartSidebar";
import { PosMobileView } from "@/components/pos/PosMobileView";
import { ServiceSelectionDialog } from "@/components/pos/ServiceSelectionDialog";

interface EnhancedPosInterfaceProps {
  availableItems: InventoryItem[];
  categories: string[];
  cart: CartItem[];
  onAddToCart: (item: InventoryItem, service: any) => void;
  onUpdateCart: (updatedCart: CartItem[]) => void;
  onRemoveFromCart: (itemId: string) => void;
  formatCurrency: (amount: number) => string;
}

export function EnhancedPosInterface({
  availableItems,
  categories,
  cart,
  onAddToCart,
  onUpdateCart,
  onRemoveFromCart,
  formatCurrency
}: EnhancedPosInterfaceProps) {
  const { currentTenant } = useTenant();
  const { getCustomersByTenant } = useCustomers();
  const { addOrder } = useData();
  const isMobile = useIsMobile();
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);

  const tenantCustomers = currentTenant?.id ? getCustomersByTenant(currentTenant.id) : [];

  const filteredItems = availableItems.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = () => {
    if (selectedItem && selectedService) {
      const service = defaultServiceCategories.find(s => s.id === selectedService);
      onAddToCart(selectedItem, service);
      setShowServiceDialog(false);
      setSelectedItem(null);
      setSelectedService("");
    }
  };

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setSelectedService("");
    setShowServiceDialog(true);
  };

  const handleQuantityUpdate = (itemId: string, change: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    onUpdateCart(updatedCart);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    onUpdateCart(updatedCart);
  };

  const handleCompleteOrder = () => {
    if (cart.length === 0) {
      toast.error("Please add items to cart");
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = subtotal * 0.05;
    const grandTotal = subtotal + taxTotal;

    const orderData = {
      tenantId: currentTenant?.id || "",
      customerId: "walk-in",
      customerName: "Walk-in Customer",
      customerPhone: "",
      items: cart.map(item => ({
        itemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        service: item.service?.name || "Standard"
      })),
      subtotal,
      tax: taxTotal,
      discount: 0,
      serviceCharge: 0,
      total: grandTotal,
      paymentMethod: "cash",
      serviceType: "store-pickup",
      pickupDate: undefined,
      pickupTime: "",
      deliveryAddress: "",
      notes: "",
      status: "pending" as any
    };

    addOrder(orderData);
    
    // Reset form
    onUpdateCart([]);
    setShowCartModal(false);
    
    toast.success("Order completed successfully!");
  };

  if (isMobile) {
    return (
      <PosMobileView
        currentTenant={currentTenant}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredItems={filteredItems}
        onItemClick={handleItemClick}
        formatCurrency={formatCurrency}
        cart={cart}
        showServiceDialog={showServiceDialog}
        setShowServiceDialog={setShowServiceDialog}
        selectedItem={selectedItem}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        handleAddToCart={handleAddToCart}
        onUpdateCart={handleQuantityUpdate}
        onRemoveFromCart={handleRemoveItem}
        tenantCustomers={tenantCustomers}
        selectedCustomer=""
        setSelectedCustomer={() => {}}
        onCompleteOrder={handleCompleteOrder}
        showCartModal={showCartModal}
        setShowCartModal={setShowCartModal}
        serviceType="store-pickup"
        setServiceType={() => {}}
        pickupDate={undefined}
        setPickupDate={() => {}}
        pickupTime=""
        setPickupTime={() => {}}
        deliveryAddress=""
        setDeliveryAddress={() => {}}
        specialInstructions=""
        setSpecialInstructions={() => {}}
      />
    );
  }

  // Desktop/Tablet Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <PosHeader
        tenantName={currentTenant?.name}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-180px)]">
        {/* Items Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <PosItemsGrid
            items={filteredItems}
            viewMode={viewMode}
            onItemClick={handleItemClick}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Cart Sidebar */}
        <div className="w-96 border-l bg-white/50 p-4 space-y-4 overflow-y-auto">
          <PosCartSidebar
            cart={cart}
            onUpdateCart={handleQuantityUpdate}
            onRemoveFromCart={handleRemoveItem}
            formatCurrency={formatCurrency}
            tenantCustomers={tenantCustomers}
            selectedCustomer=""
            setSelectedCustomer={() => {}}
            onCompleteOrder={handleCompleteOrder}
          />
        </div>
      </div>

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
