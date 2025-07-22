
import { toast } from "@/components/ui/sonner";
import { OrderStatus } from "@/lib/mockData";

interface UseStorefrontCheckoutProps {
  currentTenant: any;
  addCustomer: (customer: any) => any;
  addOrder: (order: any) => any;
  cart: any[];
  cartTotal: number;
  setCart: (cart: any[]) => void;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryPreference: string;
  pickupDate: string;
  pickupTime: string;
  notes: string;
  resetForm: () => void;
  validateForm: () => boolean;
}

export function useStorefrontCheckout({
  currentTenant,
  addCustomer,
  addOrder,
  cart,
  cartTotal,
  setCart,
  customerName,
  customerPhone,
  customerEmail,
  deliveryPreference,
  pickupDate,
  pickupTime,
  notes,
  resetForm,
  validateForm
}: UseStorefrontCheckoutProps) {
  const handleCheckoutSubmit = (): boolean => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return false;
    }
    
    if (!currentTenant?.id) {
      toast.error("No tenant selected");
      return false;
    }
    
    try {
      // Create customer with enhanced fields
      const newCustomer = addCustomer({
        tenantId: currentTenant.id,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: "",
        customerType: "regular",
        loyaltyPoints: 0,
        walletBalance: 0,
        coupons: []
      });
      
      console.log("StorefrontCheckout - Customer created:", newCustomer);
      
      const orderItems = cart.map(item => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        service: item.service?.name || "Standard"
      }));
      
      const deliveryCharge = deliveryPreference === 'delivery' ? 5.00 : 
                            deliveryPreference === 'home-pickup' ? 3.00 : 0;
      const finalTotal = cartTotal + deliveryCharge;
      
      const orderData = {
        tenantId: currentTenant.id,
        customerId: newCustomer.id,
        customerName,
        customerPhone,
        items: orderItems,
        subtotal: cartTotal,
        tax: cartTotal * 0.05,
        discount: 0,
        serviceCharge: deliveryCharge,
        total: finalTotal,
        paymentMethod: "pending",
        serviceType: deliveryPreference,
        pickupDate: pickupDate ? new Date(pickupDate) : undefined,
        pickupTime,
        deliveryAddress: "",
        notes,
        status: OrderStatus.PENDING
      };
      
      console.log("StorefrontCheckout - Creating order:", orderData);
      
      const newOrder = addOrder(orderData);
      
      const orderId = newOrder?.id || 'N/A';
      toast.success(`Order #${orderId} placed successfully! Customer account created. We'll contact you soon.`);
      setCart([]);
      resetForm();
      
      return true;
    } catch (error) {
      console.error("StorefrontCheckout - Order creation error:", error);
      toast.error("Failed to place order. Please try again.");
      return false;
    }
  };

  return { handleCheckoutSubmit };
}
