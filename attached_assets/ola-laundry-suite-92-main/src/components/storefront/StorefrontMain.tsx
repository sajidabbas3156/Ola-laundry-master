
import { useState } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { useData } from "@/contexts/DataContext";
import { WhatsAppSection } from "@/components/whatsapp/WhatsAppSection";
import { FloatingWhatsAppButton } from "@/components/whatsapp/FloatingWhatsAppButton";
import { StorefrontHeader } from "./StorefrontHeader";
import { StorefrontHero } from "./StorefrontHero";
import { StorefrontCartSummary } from "./StorefrontCartSummary";
import { StorefrontContainer } from "./StorefrontContainer";
import { ItemsSection } from "./ItemsSection";
import { CartSection } from "./CartSection";
import { ServiceDialogWrapper } from "./ServiceDialogWrapper";
import { useStorefrontDialogManager } from "./StorefrontDialogManager";
import { useStorefrontCart } from "./StorefrontCart";

export function StorefrontMain() {
  const { currentTenant } = useTenant();
  const { inventory } = useData();
  
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  
  const {
    cart,
    setCart,
    cartTotal,
    removeFromCart
  } = useStorefrontCart();

  const dialogManager = useStorefrontDialogManager({ cart, setCart, cartTotal });

  const showServiceSelection = (item: any) => {
    setSelectedItem(item);
    setSelectedServiceId('');
    setShowServiceDialog(true);
  };

  const addToCartWithService = () => {
    if (!selectedItem || !selectedServiceId) return;
    
    const service = { id: selectedServiceId, name: selectedServiceId };
    const cartItem = {
      ...selectedItem,
      quantity: 1,
      service
    };
    
    setCart([...cart, cartItem]);
    setShowServiceDialog(false);
    setSelectedItem(null);
    setSelectedServiceId('');
  };

  const handleAddToCart = (item: any) => {
    showServiceSelection(item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <StorefrontHero tenantName={currentTenant?.name} />

      <StorefrontContainer>
        <StorefrontHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartLength={cart.length}
          onCartClick={() => dialogManager.setShowCheckoutDialog(cart.length > 0)}
        />

        <WhatsAppSection />

        {/* Main Order Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Items Section */}
          <div className="xl:col-span-3">
            <ItemsSection
              inventory={inventory}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Cart Section */}
          <div className="xl:col-span-1">
            <CartSection
              cart={cart}
              onRemoveFromCart={removeFromCart}
              onProceedToCheckout={() => dialogManager.setShowCheckoutDialog(true)}
              cartTotal={cartTotal}
            />
          </div>
        </div>

        <StorefrontCartSummary
          cart={cart}
          cartTotal={cartTotal}
          formatCurrency={(amount) => `$${amount.toFixed(2)}`}
          onCheckoutClick={() => dialogManager.setShowCheckoutDialog(true)}
        />

        {dialogManager.checkoutDialog}

        <ServiceDialogWrapper
          showServiceDialog={showServiceDialog}
          setShowServiceDialog={setShowServiceDialog}
          selectedItem={selectedItem}
          selectedServiceId={selectedServiceId}
          setSelectedServiceId={setSelectedServiceId}
          onAddToCartWithService={addToCartWithService}
        />

        <FloatingWhatsAppButton 
          phoneNumber={dialogManager.whatsappNumber}
          message={cart.length > 0 ? dialogManager.generateWhatsAppOrderMessage() : `Hi! I'd like to know more about your services at ${currentTenant?.name || "your laundry service"}.`}
        />
      </StorefrontContainer>
    </div>
  );
}
