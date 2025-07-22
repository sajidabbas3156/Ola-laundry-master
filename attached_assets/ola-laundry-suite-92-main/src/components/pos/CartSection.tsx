
import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CustomerSelector } from "@/components/pos/CustomerSelector";
import { DeliveryPreferenceSelector } from "@/components/delivery/DeliveryPreferenceSelector";
import { CartItem } from "@/types/pos";
import { CartStatus } from "@/components/pos/cart/CartStatus";
import { CartItems } from "@/components/pos/cart/CartItems";
import { PaymentSection } from "@/components/pos/cart/PaymentSection";
import { OrderTotal } from "@/components/pos/cart/OrderTotal";
import { useAsyncOperation } from "@/hooks/useAsyncOperation";

interface CartSectionProps {
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
}

export function CartSection({
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
  formatCurrency
}: CartSectionProps) {
  const [deliveryPreference, setDeliveryPreference] = useState("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const { isLoading: isProcessing, execute } = useAsyncOperation();

  const deliveryCharge = deliveryPreference === 'delivery' ? 5.00 : 
                        deliveryPreference === 'home-pickup' ? 3.00 : 0;
  const finalTotal = cartTotal + deliveryCharge;

  const handleSubmitOrder = async () => {
    await execute(async () => {
      await handleCheckout();
    });
  };

  return (
    <div className="space-y-4">
      <CartStatus itemCount={cart.length} />
      <CartItems
        cart={cart}
        removeFromCart={removeFromCart}
        addItemQuantity={addItemQuantity}
        deleteFromCart={deleteFromCart}
        formatCurrency={formatCurrency}
      />

      {cart.length > 0 && (
        <>
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <span>Selected Customer</span>
              {!selectedCustomer && <Badge variant="destructive" className="text-xs">Required</Badge>}
            </Label>
            <CustomerSelector
              tenantCustomers={tenantCustomers}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          </div>

          <Separator />

          {/* Service Preferences */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Service Options
            </Label>
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

          <Separator />

          <PaymentSection finalTotal={finalTotal} formatCurrency={formatCurrency} />

          <Separator />

          {/* Order Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Order Notes</Label>
            <Input
              id="notes"
              placeholder="Add special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm"
            />
          </div>

          <Separator />

          <OrderTotal
            cartTotal={cartTotal}
            deliveryCharge={deliveryCharge}
            finalTotal={finalTotal}
            paymentMethod="cash"
            formatCurrency={formatCurrency}
          />

          <Button 
            className="w-full h-12 text-lg font-semibold" 
            disabled={cart.length === 0 || !selectedCustomer || isProcessing}
            onClick={handleSubmitOrder}
          >
            {isProcessing ? "Processing Order..." : `Complete Order ${formatCurrency(finalTotal)}`}
          </Button>
        </>
      )}
    </div>
  );
}
