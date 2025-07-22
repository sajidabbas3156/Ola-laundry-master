
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard, Banknote, Smartphone } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { useTenant } from "@/contexts/TenantContext";
import { useCustomers } from "@/contexts/CustomerContext";
import { useData } from "@/contexts/DataContext";

interface EnhancedStorefrontCheckoutProps {
  cart: any[];
  cartTotal: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function EnhancedStorefrontCheckout({
  cart,
  cartTotal,
  onClose,
  onSuccess
}: EnhancedStorefrontCheckoutProps) {
  const { currentTenant } = useTenant();
  const { addCustomer } = useCustomers();
  const { addOrder } = useData();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState("store-pickup");
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [address, setAddress] = useState({
    city: "",
    block: "",
    road: "",
    building: "",
    landmark: ""
  });
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const cities = [
    "Manama", "Muharraq", "Riffa", "Hamad Town", "A'ali", "Isa Town", 
    "Sitra", "Budaiya", "Jidhafs", "Al-Manamah"
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const paymentOptions = [
    { id: "cash-on-delivery", label: "Cash on Delivery", icon: <Banknote className="h-4 w-4" /> },
    { id: "benefit-pay", label: "Benefit Pay", icon: <Smartphone className="h-4 w-4" /> },
    { id: "card", label: "Credit/Debit Card", icon: <CreditCard className="h-4 w-4" /> }
  ];

  const handlePickupDateChange = (date: Date | undefined) => {
    setPickupDate(date);
    if (date && deliveryPreference === "home-delivery") {
      const minDeliveryDate = addDays(date, 2); // 48 hours later
      setDeliveryDate(minDeliveryDate);
    }
  };

  const validateForm = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Name and phone are required");
      return false;
    }

    if (deliveryPreference !== "store-pickup" && (!pickupDate || !pickupTime)) {
      toast.error("Please select pickup date and time");
      return false;
    }

    if (deliveryPreference === "home-delivery" && (!deliveryDate || !deliveryTime)) {
      toast.error("Please select delivery date and time");
      return false;
    }

    if ((deliveryPreference === "home-pickup" || deliveryPreference === "home-delivery") && !address.city) {
      toast.error("Please select a city for address");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !currentTenant?.id) return;

    setIsProcessing(true);
    try {
      // Create customer with enhanced fields
      const newCustomer = addCustomer({
        tenantId: currentTenant.id,
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone.trim(),
        address: deliveryPreference !== "store-pickup" ? [
          address.block && `Block ${address.block}`,
          address.road && `Road ${address.road}`,
          address.building && `Building ${address.building}`,
          address.landmark && address.landmark,
          address.city
        ].filter(Boolean).join(", ") : "",
        customerType: "regular",
        loyaltyPoints: 0,
        walletBalance: 0,
        coupons: []
      });

      // Calculate totals
      const deliveryCharge = deliveryPreference === 'home-delivery' ? 5.00 : 
                            deliveryPreference === 'home-pickup' ? 3.00 : 0;
      const taxTotal = cartTotal * 0.05;
      const finalTotal = cartTotal + taxTotal + deliveryCharge;

      // Create order
      const orderData = {
        tenantId: currentTenant.id,
        customerId: newCustomer.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        items: cart.map(item => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          service: item.service?.name || "Standard"
        })),
        subtotal: cartTotal,
        tax: taxTotal,
        discount: 0,
        serviceCharge: deliveryCharge,
        total: finalTotal,
        paymentMethod,
        serviceType: deliveryPreference,
        pickupDate: pickupDate,
        pickupTime,
        deliveryAddress: deliveryPreference !== "store-pickup" ? [
          address.block && `Block ${address.block}`,
          address.road && `Road ${address.road}`,
          address.building && `Building ${address.building}`,
          address.landmark && address.landmark,
          address.city
        ].filter(Boolean).join(", ") : "",
        notes,
        status: "pending" as any
      };

      await addOrder(orderData);
      
      toast.success(`Order placed successfully! Customer account created. We'll contact you soon.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label 
                    htmlFor={option.id} 
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {option.icon}
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Service Type */}
      <Card>
        <CardHeader>
          <CardTitle>Service Options</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={deliveryPreference} onValueChange={setDeliveryPreference}>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="store-pickup" id="store-pickup" />
                <Label htmlFor="store-pickup">Store Pickup (Free)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="home-pickup" id="home-pickup" />
                <Label htmlFor="home-pickup">Home Pickup + Store Return (3.00 BD)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="home-delivery" id="home-delivery" />
                <Label htmlFor="home-delivery">Complete Home Service (5.00 BD)</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Address (for home services) */}
      {(deliveryPreference === "home-pickup" || deliveryPreference === "home-delivery") && (
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>City *</Label>
              <Select value={address.city} onValueChange={(value) => setAddress(prev => ({ ...prev, city: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Block No</Label>
                <Input
                  value={address.block}
                  onChange={(e) => setAddress(prev => ({ ...prev, block: e.target.value }))}
                  placeholder="Block"
                />
              </div>
              <div>
                <Label>Road No</Label>
                <Input
                  value={address.road}
                  onChange={(e) => setAddress(prev => ({ ...prev, road: e.target.value }))}
                  placeholder="Road"
                />
              </div>
              <div>
                <Label>Building No</Label>
                <Input
                  value={address.building}
                  onChange={(e) => setAddress(prev => ({ ...prev, building: e.target.value }))}
                  placeholder="Building"
                />
              </div>
            </div>
            <div>
              <Label>Landmark (Optional)</Label>
              <Input
                value={address.landmark}
                onChange={(e) => setAddress(prev => ({ ...prev, landmark: e.target.value }))}
                placeholder="Nearby landmark"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduling */}
      {deliveryPreference !== "store-pickup" && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pickup Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !pickupDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={handlePickupDateChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Pickup Time *</Label>
                <Select value={pickupTime} onValueChange={setPickupTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {deliveryPreference === "home-delivery" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Delivery Date * (48 hours after pickup)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground"
                        )}
                        disabled={!pickupDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        disabled={(date) => !pickupDate || date < addDays(pickupDate, 2)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Delivery Time *</Label>
                  <Select value={deliveryTime} onValueChange={setDeliveryTime} disabled={!deliveryDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Special Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions or notes..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
