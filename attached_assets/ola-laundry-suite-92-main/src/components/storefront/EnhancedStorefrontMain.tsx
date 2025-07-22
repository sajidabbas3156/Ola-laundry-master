
import { useState } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { useInventory } from "@/contexts/InventoryContext";
import { WhatsAppSection } from "@/components/whatsapp/WhatsAppSection";
import { FloatingWhatsAppButton } from "@/components/whatsapp/FloatingWhatsAppButton";
import { EnhancedStorefrontHeader } from "./EnhancedStorefrontHeader";
import { EnhancedStorefrontHero } from "./EnhancedStorefrontHero";
import { EnhancedStorefrontContainer } from "./EnhancedStorefrontContainer";
import { EnhancedItemsSection } from "./EnhancedItemsSection";
import { EnhancedCartSection } from "./EnhancedCartSection";
import { EnhancedServiceSelectionDialog } from "./EnhancedServiceSelectionDialog";
import { useStorefrontCart } from "./StorefrontCart";
import { useStorefrontDialogManager } from "./StorefrontDialogManager";
import { defaultServiceCategories } from "@/lib/defaultInventory";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, Truck, CreditCard } from "lucide-react";

export function EnhancedStorefrontMain() {
  const { currentTenant } = useTenant();
  const { inventory } = useInventory();
  
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
    
    const service = defaultServiceCategories.find(s => s.id === selectedServiceId);
    if (!service) return;
    
    const cartItem = {
      ...selectedItem,
      quantity: 1,
      service,
      price: selectedItem.price * service.priceMultiplier
    };
    
    setCart([...cart, cartItem]);
    setShowServiceDialog(false);
    setSelectedItem(null);
    setSelectedServiceId('');
    
    toast.success(`Added ${selectedItem.name} with ${service.name} service to cart!`);
  };

  const handleAddToCart = (item: any) => {
    showServiceSelection(item);
  };

  const handleUpdateCart = (updatedCart: any[]) => {
    setCart(updatedCart);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <EnhancedStorefrontHero tenantName={currentTenant?.name} />

      <EnhancedStorefrontContainer>
        <EnhancedStorefrontHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartLength={cart.length}
          onCartClick={() => dialogManager.setShowCheckoutDialog(cart.length > 0)}
        />

        {/* How It Works Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Select Items</h3>
                <p className="text-sm text-gray-600">Choose your laundry items and preferred service type</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Place Order</h3>
                <p className="text-sm text-gray-600">Add your details and choose pickup/delivery options</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Collection</h3>
                <p className="text-sm text-gray-600">We pickup or you can drop off at our store</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">4. Pay & Receive</h3>
                <p className="text-sm text-gray-600">Pay when convenient and receive clean clothes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <WhatsAppSection />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          <div className="xl:col-span-3">
            <EnhancedItemsSection
              inventory={inventory}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddToCart={handleAddToCart}
            />
          </div>

          <div className="xl:col-span-1">
            <EnhancedCartSection
              cart={cart}
              onRemoveFromCart={removeFromCart}
              onUpdateCart={handleUpdateCart}
              onProceedToCheckout={() => dialogManager.setShowCheckoutDialog(true)}
              cartTotal={cartTotal}
            />
          </div>
        </div>

        {dialogManager.checkoutDialog}

        <EnhancedServiceSelectionDialog 
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
      </EnhancedStorefrontContainer>
    </div>
  );
}
