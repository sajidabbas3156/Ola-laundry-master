import { useState } from "react";
import { MobileFrame } from "@/components/mobile/mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useOrders } from "@/hooks/use-orders";
import { Service } from "@shared/schema";
import { bahrainPaymentMethods, processPayment, formatBahrainiCurrency } from "@/lib/payments";
import { useToast } from "@/hooks/use-toast";
import { Search, CreditCard, Save, QrCode, X, Wallet } from "lucide-react";

interface CartItem {
  serviceId: number;
  service: Service;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function MobilePOS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("benefit_pay");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { createOrder, isCreating } = useOrders();
  const { toast } = useToast();

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer: any) =>
    customer.user?.phone?.includes(customerSearch) ||
    customer.user?.email?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.user?.firstName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.user?.lastName?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const addToCart = (service: Service) => {
    const existingItem = cart.find(item => item.serviceId === service.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.serviceId === service.id
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      setCart([...cart, {
        serviceId: service.id,
        service,
        quantity: 1,
        unitPrice: Number(service.basePrice),
        totalPrice: Number(service.basePrice),
      }]);
    }
  };

  const removeFromCart = (serviceId: number) => {
    setCart(cart.filter(item => item.serviceId !== serviceId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleProcessPayment = async () => {
    if (!selectedCustomer || cart.length === 0) return;

    setIsProcessingPayment(true);
    
    try {
      // Process payment with selected Bahrain payment method
      const paymentResult = await processPayment(selectedPaymentMethod, cartTotal, 'BHD');
      
      if (paymentResult.success) {
        const orderData = {
          customerId: selectedCustomer.id,
          totalAmount: cartTotal.toFixed(3), // BHD uses 3 decimal places
          itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
          status: "pending" as const,
          paymentStatus: "paid" as const,
          paymentMethod: selectedPaymentMethod,
          items: cart.map(item => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            totalPrice: item.totalPrice.toString(),
          })),
        };

        await createOrder(orderData);

        toast({
          title: "Payment Successful",
          description: `Order created successfully. Transaction ID: ${paymentResult.transactionId}`,
        });
        
        // Clear cart and customer after successful order
        setCart([]);
        setSelectedCustomer(null);
        setCustomerSearch("");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Please try another payment method.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mobile POS Application</h2>
        <p className="text-gray-600">Touch-optimized point of sale interface for order creation and payment processing</p>
      </div>
      
      <MobileFrame>
        {/* POS Header */}
        <div className="bg-primary text-white p-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">LaundryPOS</h1>
            <p className="text-sm text-blue-100">Store #1 - Main Street</p>
          </div>
          <div className="text-right">
            <div className="text-sm">Staff User</div>
            <div className="text-xs text-blue-100">Cashier</div>
          </div>
        </div>

        {/* Current Order Summary */}
        <div className="bg-white border-b p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">Current Order</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCart([])}
              className="text-primary text-sm h-auto p-1"
            >
              Clear All
            </Button>
          </div>
          
          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No items in cart</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.serviceId} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.service.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.quantity} × {formatBahrainiCurrency(item.unitPrice)}
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <div className="font-semibold">{formatBahrainiCurrency(item.totalPrice)}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.serviceId)}
                      className="text-red-500 hover:text-red-700 h-auto p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 text-lg font-bold">
            <span>Total:</span>
            <span>{formatBahrainiCurrency(cartTotal)}</span>
          </div>
        </div>

        {/* Service Selection */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-3">Select Services</h3>
          
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category} className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                {category.replace('_', ' ')}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {categoryServices.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    onClick={() => addToCart(service)}
                    className="h-auto p-3 flex-col items-start text-left hover:bg-blue-50 border-blue-200"
                  >
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatBahrainiCurrency(Number(service.basePrice))}
                      {service.priceType === 'per_lb' && '/lb'}
                      {service.priceType === 'per_item' && '/item'}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Customer Lookup */}
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Customer</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search by phone, email, or name..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="sm" className="px-3">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Customer search results */}
            {customerSearch && filteredCustomers.length > 0 && !selectedCustomer && (
              <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded">
                {filteredCustomers.slice(0, 3).map((customer: any) => (
                  <div
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setCustomerSearch("");
                    }}
                    className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-sm font-medium">
                      {customer.user?.firstName} {customer.user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {customer.user?.phone} • {customer.user?.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedCustomer && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                <div className="font-medium">
                  {selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName}
                </div>
                <div className="text-xs text-gray-600">
                  {selectedCustomer.user?.phone} • Loyalty: {selectedCustomer.loyaltyPoints || 0} pts
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                  className="mt-1 h-auto p-1 text-xs text-red-600"
                >
                  Remove Customer
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="p-4 border-t bg-gray-50">
          <Label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</Label>
          <div className="grid grid-cols-2 gap-2">
            {bahrainPaymentMethods.map((method) => (
              <Button
                key={method.id}
                variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className="h-auto p-3 flex-col items-center text-center"
                disabled={!method.available}
              >
                <span className="text-lg mb-1">{method.icon}</span>
                <span className="text-xs font-medium">{method.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t bg-white">
          <div className="space-y-3">
            <Button 
              className="w-full py-4 text-lg font-semibold"
              disabled={cart.length === 0 || !selectedCustomer || isCreating || isProcessingPayment}
              onClick={handleProcessPayment}
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isProcessingPayment ? "Processing Payment..." : isCreating ? "Creating Order..." : "Process Payment"}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="py-3 font-medium">
                <Save className="w-4 h-4 mr-2" />
                Save Order
              </Button>
              <Button variant="outline" className="py-3 font-medium">
                <QrCode className="w-4 h-4 mr-2" />
                Scan Item
              </Button>
            </div>
          </div>
        </div>
      </MobileFrame>
    </div>
  );
}
