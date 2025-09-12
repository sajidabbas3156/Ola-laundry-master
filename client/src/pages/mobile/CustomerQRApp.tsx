import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { laundryItems, laundryServices, finishingOptions } from "@/lib/laundryItems";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarIcon,
  QrCode,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Tag,
  ChevronRight,
  Check
} from "lucide-react";

interface OrderItem {
  itemId: string;
  service: string;
  quantity: number;
  finishing: string;
}

export default function CustomerQRApp() {
  const { toast } = useToast();
  const [step, setStep] = useState<'auth' | 'info' | 'service' | 'items' | 'schedule' | 'payment' | 'confirm'>('auth');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  
  // Customer data
  const [customerData, setCustomerData] = useState({
    phone: '',
    name: '',
    flatNo: '',
    buildingNo: '',
    roadNo: '',
    city: 'Manama'
  });
  
  // Order data
  const [selectedService, setSelectedService] = useState('wash_iron');
  const [selectedFinishing, setSelectedFinishing] = useState('fold');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState('09:00');
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryTime, setDeliveryTime] = useState('18:00');
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleItemToggle = (itemId: string) => {
    const existing = selectedItems.find(item => item.itemId === itemId);
    if (existing) {
      setSelectedItems(selectedItems.filter(item => item.itemId !== itemId));
    } else {
      setSelectedItems([...selectedItems, {
        itemId,
        service: selectedService,
        quantity: 1,
        finishing: selectedFinishing
      }]);
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter(item => item.itemId !== itemId));
    } else {
      setSelectedItems(selectedItems.map(item => 
        item.itemId === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, orderItem) => {
      const item = laundryItems.find(i => i.id === orderItem.itemId);
      const service = laundryServices.find(s => s.id === orderItem.service);
      if (item && service) {
        return total + (item.basePrice * service.priceMultiplier * orderItem.quantity);
      }
      return total;
    }, 0);
  };

  const handleNext = () => {
    const steps: typeof step[] = ['auth', 'info', 'service', 'items', 'schedule', 'payment', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: typeof step[] = ['auth', 'info', 'service', 'items', 'schedule', 'payment', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmitOrder = () => {
    toast({
      title: "Order Placed Successfully!",
      description: "Your order has been confirmed. We'll send you updates via SMS.",
    });
    // Reset form or redirect
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <QrCode className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">OLA Quick Order</h1>
          </div>
          <p className="text-muted-foreground">Fast & easy laundry service booking</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {['Login', 'Info', 'Service', 'Items', 'Schedule', 'Payment'].map((label, index) => (
            <div key={label} className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                index <= ['auth', 'info', 'service', 'items', 'schedule', 'payment', 'confirm'].indexOf(step)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          {/* Auth Step */}
          {step === 'auth' && (
            <>
              <CardHeader>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>Enter your phone number to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+973-XXXX-XXXX"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => {
                    setIsNewCustomer(true); // Simulate new customer
                    handleNext();
                  }}
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  No app download required! Book your laundry service in minutes.
                </p>
              </CardContent>
            </>
          )}

          {/* Info Step (for new customers) */}
          {step === 'info' && isNewCustomer && (
            <>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
                <CardDescription>We need your address for pickup & delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="flat">Flat No</Label>
                    <Input
                      id="flat"
                      placeholder="123"
                      value={customerData.flatNo}
                      onChange={(e) => setCustomerData({ ...customerData, flatNo: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      placeholder="456"
                      value={customerData.buildingNo}
                      onChange={(e) => setCustomerData({ ...customerData, buildingNo: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="road">Road</Label>
                    <Input
                      id="road"
                      placeholder="789"
                      value={customerData.roadNo}
                      onChange={(e) => setCustomerData({ ...customerData, roadNo: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={customerData.city}
                    onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                  <Button className="flex-1" onClick={handleNext}>Next</Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Service Selection */}
          {step === 'service' && (
            <>
              <CardHeader>
                <CardTitle>Select Service & Finishing</CardTitle>
                <CardDescription>Choose how you want your clothes cleaned</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Service Type</Label>
                  <RadioGroup value={selectedService} onValueChange={setSelectedService}>
                    {laundryServices.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                        <RadioGroupItem value={service.id} id={service.id} />
                        <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{service.icon}</span>
                            <span>{service.name}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Finishing Option</Label>
                  <RadioGroup value={selectedFinishing} onValueChange={setSelectedFinishing}>
                    <div className="flex gap-4">
                      {finishingOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`finish-${option.id}`} />
                          <Label htmlFor={`finish-${option.id}`} className="cursor-pointer">
                            <span className="mr-1">{option.icon}</span>
                            {option.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                  <Button className="flex-1" onClick={handleNext}>Next</Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Items Selection */}
          {step === 'items' && (
            <>
              <CardHeader>
                <CardTitle>Select Items</CardTitle>
                <CardDescription>Tap items to add them to your order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {laundryItems.slice(0, 12).map((item) => {
                    const orderItem = selectedItems.find(i => i.itemId === item.id);
                    const isSelected = !!orderItem;
                    
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "p-3 border rounded-lg text-center cursor-pointer transition-colors",
                          isSelected ? "border-primary bg-primary/10" : "hover:bg-muted"
                        )}
                        onClick={() => handleItemToggle(item.id)}
                      >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(item.basePrice * laundryServices.find(s => s.id === selectedService)!.priceMultiplier).toFixed(2)} BHD
                        </p>
                        {isSelected && (
                          <div className="flex items-center justify-center mt-2 space-x-2">
                            <button
                              className="w-6 h-6 bg-primary text-primary-foreground rounded flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateItemQuantity(item.id, orderItem.quantity - 1);
                              }}
                            >
                              -
                            </button>
                            <span className="text-sm font-medium">{orderItem.quantity}</span>
                            <button
                              className="w-6 h-6 bg-primary text-primary-foreground rounded flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateItemQuantity(item.id, orderItem.quantity + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-medium">{selectedItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Total:</span>
                    <span className="font-bold text-primary">{calculateTotal().toFixed(2)} BHD</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleNext}
                    disabled={selectedItems.length === 0}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Schedule Step */}
          {step === 'schedule' && (
            <>
              <CardHeader>
                <CardTitle>Schedule Pickup & Delivery</CardTitle>
                <CardDescription>Choose convenient times for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Pickup Date & Time</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1 justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={pickupDate}
                          onSelect={setPickupDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <select
                      className="px-3 py-2 border rounded-md"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label>Delivery Date & Time</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1 justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate ? format(deliveryDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <select
                      className="px-3 py-2 border rounded-md"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Express service available for same-day delivery!
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                  <Button className="flex-1" onClick={handleNext}>Next</Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Choose payment method and apply coupon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <span className="mr-2">💵</span>
                            Cash on Delivery
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Credit/Debit Card
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline">
                      <Tag className="mr-2 h-4 w-4" />
                      Apply
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{calculateTotal().toFixed(2)} BHD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>2.00 BHD</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Discount:</span>
                    <span>-0.00 BHD</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{(calculateTotal() + 2).toFixed(2)} BHD</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                  <Button className="flex-1" onClick={handleNext}>Review Order</Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Confirmation Step */}
          {step === 'confirm' && (
            <>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
                <CardDescription>Please confirm all details are correct</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{customerData.name || 'Customer'}</p>
                      <p className="text-sm text-muted-foreground">{customerData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Flat {customerData.flatNo}, Building {customerData.buildingNo}, 
                        Road {customerData.roadNo}, {customerData.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">
                        Pickup: {pickupDate && format(pickupDate, "PPP")} at {pickupTime}
                      </p>
                      <p className="text-sm">
                        Delivery: {deliveryDate && format(deliveryDate, "PPP")} at {deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/10 rounded-lg text-center">
                  <Check className="h-12 w-12 text-secondary mx-auto mb-2" />
                  <p className="font-medium text-foreground">Order Total: {(calculateTotal() + 2).toFixed(2)} BHD</p>
                  <p className="text-sm text-secondary mt-1">Payment: {paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card Payment'}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                  <Button className="flex-1" onClick={handleSubmitOrder}>
                    Confirm Order
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}