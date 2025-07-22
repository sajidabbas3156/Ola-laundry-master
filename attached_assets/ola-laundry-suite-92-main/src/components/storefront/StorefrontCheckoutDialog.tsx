
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/pos";
import { StorefrontCartItems } from "./StorefrontCartItems";
import { StorefrontCustomerDetailsForm } from "./StorefrontCustomerDetailsForm";
import { StorefrontWhatsAppSection } from "./StorefrontWhatsAppSection";
import { StorefrontNewCustomerForm } from "./StorefrontNewCustomerForm";
import { DeliveryPreferenceSelector } from "@/components/delivery/DeliveryPreferenceSelector";
import { useState } from "react";

interface StorefrontCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  cartTotal: number;
  formatCurrency: (amount: number) => string;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  pickupDate: string;
  setPickupDate: (date: string) => void;
  deliveryPreference: string;
  setDeliveryPreference: (preference: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onSubmit: () => boolean;
  whatsappNumber: string;
  generateWhatsAppOrderMessage: () => string;
  tenantName?: string;
}

export function StorefrontCheckoutDialog({
  open,
  onOpenChange,
  cart,
  setCart,
  cartTotal,
  formatCurrency,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerEmail,
  setCustomerEmail,
  pickupTime,
  setPickupTime,
  pickupDate,
  setPickupDate,
  deliveryPreference,
  setDeliveryPreference,
  notes,
  setNotes,
  onSubmit,
  whatsappNumber,
  generateWhatsAppOrderMessage,
  tenantName
}: StorefrontCheckoutDialogProps) {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleCustomerCreated = (customerId: string) => {
    // Customer creation is handled in the form component
    // The form will be hidden and regular form will be used
  };

  // Calculate total with delivery charges
  const deliveryCharge = deliveryPreference === 'delivery' ? 5.00 : 
                        deliveryPreference === 'home-pickup' ? 3.00 : 0;
  const finalTotal = cartTotal + deliveryCharge;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <StorefrontCartItems
            cart={cart}
            setCart={setCart}
            cartTotal={cartTotal}
            formatCurrency={formatCurrency}
          />

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Customer Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <input 
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone *</label>
                <input 
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium">Email</label>
              <input 
                className="w-full border rounded-md px-3 py-2 text-sm"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <DeliveryPreferenceSelector
              deliveryPreference={deliveryPreference}
              setDeliveryPreference={setDeliveryPreference}
              pickupDate={pickupDate}
              setPickupDate={setPickupDate}
              pickupTime={pickupTime}
              setPickupTime={setPickupTime}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
              specialInstructions={specialInstructions}
              setSpecialInstructions={setSpecialInstructions}
            />
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              {deliveryCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Service Fee:</span>
                  <span>{formatCurrency(deliveryCharge)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>

          <StorefrontWhatsAppSection
            whatsappNumber={whatsappNumber}
            generateWhatsAppOrderMessage={generateWhatsAppOrderMessage}
            tenantName={tenantName}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Place Order ({formatCurrency(finalTotal)})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
