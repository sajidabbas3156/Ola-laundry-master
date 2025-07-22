
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnhancedStorefrontCheckout } from "./EnhancedStorefrontCheckout";
import { useTenant } from "@/contexts/TenantContext";

interface StorefrontDialogManagerProps {
  cart: any[];
  setCart: (cart: any[]) => void;
  cartTotal: number;
}

export function useStorefrontDialogManager({ cart, setCart, cartTotal }: StorefrontDialogManagerProps) {
  const { currentTenant } = useTenant();
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);

  const whatsappNumber = currentTenant?.whatsappNumber || "+97333456789";

  const generateWhatsAppOrderMessage = () => {
    const itemsList = cart.map(item => 
      `${item.quantity}x ${item.name} (${item.service?.name || 'Standard'}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    return `Hi! I'd like to place an order at ${currentTenant?.name || "your laundry service"}:

${itemsList}

Total: $${cartTotal.toFixed(2)}

Please confirm and let me know the next steps.`;
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    setShowCheckoutDialog(false);
  };

  const checkoutDialog = showCheckoutDialog && (
    <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
        </DialogHeader>
        <EnhancedStorefrontCheckout 
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setShowCheckoutDialog(false)}
          onSuccess={handleCheckoutSuccess}
        />
      </DialogContent>
    </Dialog>
  );

  return {
    showCheckoutDialog,
    setShowCheckoutDialog,
    checkoutDialog,
    whatsappNumber,
    generateWhatsAppOrderMessage
  };
}
