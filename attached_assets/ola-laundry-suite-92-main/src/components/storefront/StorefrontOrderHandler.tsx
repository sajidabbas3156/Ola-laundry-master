
import { useTenant } from "@/contexts/TenantContext";
import { useOrders } from "@/contexts/OrdersContext";
import { toast } from "@/components/ui/sonner";
import { CartItem } from "@/types/pos";
import { Customer, OrderStatus } from "@/lib/mockData";

interface UseStorefrontOrderHandlerProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  cartTotal: number;
  selectedCustomer: Customer | null;
  customerName: string;
  customerPhone: string;
  pickupDate: string;
  pickupTime: string;
  notes: string;
  setShowCheckoutDialog: (show: boolean) => void;
  resetForm: () => void;
  setSelectedCustomer: (customer: Customer | null) => void;
}

export function useStorefrontOrderHandler({
  cart,
  setCart,
  cartTotal,
  selectedCustomer,
  customerName,
  customerPhone,
  pickupDate,
  pickupTime,
  notes,
  setShowCheckoutDialog,
  resetForm,
  setSelectedCustomer
}: UseStorefrontOrderHandlerProps) {
  const { currentTenant } = useTenant();
  const { addOrder } = useOrders();

  const whatsappNumber = currentTenant?.whatsappNumber || "+1234567890";

  const generateWhatsAppOrderMessage = () => {
    const orderItems = cart.map(item => 
      `- ${item.name} (${item.service?.name || 'Standard'}) x${item.quantity}`
    ).join('\n');

    return `Hello! I'd like to place an order at ${currentTenant?.name || 'your laundry service'}:

${orderItems}

Total: $${cartTotal.toFixed(2)}
Customer: ${customerName}
Phone: ${customerPhone}
Pickup Date: ${pickupDate}
Pickup Time: ${pickupTime}

Please confirm this order. Thank you!`;
  };

  const handleSubmitOrder = () => {
    if (!customerName || !customerPhone || !pickupDate || !pickupTime || cart.length === 0) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (!currentTenant?.id) {
      toast.error("No tenant selected");
      return false;
    }

    try {
      const orderItems = cart.map(item => ({
        itemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        service: item.service?.name || 'Standard'
      }));

      addOrder({
        tenantId: currentTenant.id,
        customerId: selectedCustomer?.id || '',
        customerName,
        customerPhone,
        items: orderItems,
        subtotal: cartTotal,
        tax: 0,
        discount: 0,
        serviceCharge: 0,
        total: cartTotal,
        paymentMethod: '',
        serviceType: '',
        pickupDate: new Date(pickupDate),
        pickupTime,
        deliveryAddress: '',
        notes,
        status: OrderStatus.PENDING
      });

      // Reset everything
      setCart([]);
      setShowCheckoutDialog(false);
      resetForm();
      setSelectedCustomer(null);
      
      toast.success("Order placed successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to place order");
      return false;
    }
  };

  return {
    whatsappNumber,
    generateWhatsAppOrderMessage,
    handleSubmitOrder
  };
}
