
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, Trash2, ShoppingCart, User, CalendarIcon, Clock, Store, Home, Truck, X, MapPin } from "lucide-react";
import { CartItem } from "@/types/pos";
import { CustomerSelector } from "@/components/pos/CustomerSelector";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedMobileCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onUpdateCart: (itemId: string, change: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  formatCurrency: (amount: number) => string;
  tenantCustomers: any[];
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
  onCompleteOrder: () => void;
  serviceType: string;
  setServiceType: (type: string) => void;
  pickupDate: Date | undefined;
  setPickupDate: (date: Date | undefined) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (instructions: string) => void;
}

export function EnhancedMobileCartModal({
  open,
  onOpenChange,
  cart,
  onUpdateCart,
  onRemoveFromCart,
  formatCurrency,
  tenantCustomers,
  selectedCustomer,
  setSelectedCustomer,
  onCompleteOrder,
  serviceType,
  setServiceType,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  deliveryAddress,
  setDeliveryAddress,
  specialInstructions,
  setSpecialInstructions
}: EnhancedMobileCartModalProps) {
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [activeTab, setActiveTab] = useState<"cart" | "scheduling">("cart");
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxTotal = cartTotal * 0.05;
  const serviceCharge = serviceType === "home-delivery" ? 10 : serviceType === "home-pickup" ? 5 : 0;
  const grandTotal = cartTotal + taxTotal + serviceCharge;

  const serviceOptions = [
    {
      id: "store-pickup",
      label: "Store Pickup",
      description: "Collect from our location",
      icon: <Store className="h-5 w-5" />,
      color: "bg-blue-500"
    },
    {
      id: "home-pickup",
      label: "Home Pickup",
      description: "We collect from you",
      icon: <Home className="h-5 w-5" />,
      color: "bg-green-500"
    },
    {
      id: "home-delivery",
      label: "Home Delivery",
      description: "Complete pickup and delivery service",
      icon: <Truck className="h-5 w-5" />,
      color: "bg-purple-500"
    }
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  // Calculate minimum delivery date (2 days after pickup)
  const minDeliveryDate = pickupDate ? addDays(pickupDate, 2) : addDays(new Date(), 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Order Summary</h2>
                <p className="text-sm text-gray-500">{cart.length} items</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <Button
            variant={activeTab === "cart" ? "default" : "ghost"}
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
            onClick={() => setActiveTab("cart")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
          </Button>
          <Button
            variant={activeTab === "scheduling" ? "default" : "ghost"}
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
            onClick={() => setActiveTab("scheduling")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "cart" && (
            <>
              {/* Customer Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </Label>
                <CustomerSelector
                  tenantCustomers={tenantCustomers}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                />
              </div>

              <Separator />

              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-600">Cart is empty</p>
                  <p className="text-sm text-gray-500 mt-1">Add services to start an order</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          {item.service && (
                            <Badge variant="outline" className="text-xs mt-1 bg-blue-50 text-blue-700 border-blue-200">
                              {item.service.name}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateCart(item.id, -1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateCart(item.id, 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold text-lg">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "scheduling" && (
            <>
              {/* Service Type */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Service Type</Label>
                <RadioGroup value={serviceType} onValueChange={setServiceType}>
                  <div className="space-y-2">
                    {serviceOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label 
                          htmlFor={option.id} 
                          className="flex-1 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg text-white", option.color)}>
                              {option.icon}
                            </div>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-500">{option.description}</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Store Pickup - No scheduling needed */}
              {serviceType === "store-pickup" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Store className="h-5 w-5" />
                    <span className="font-medium">No scheduling required</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Items will be ready for pickup during business hours
                  </p>
                </div>
              )}

              {/* Home Pickup - Only pickup scheduling */}
              {serviceType === "home-pickup" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Pickup Date</Label>
                    <Popover open={showPickupCalendar} onOpenChange={setShowPickupCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "PPP") : "Select pickup date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={pickupDate}
                          onSelect={(date) => {
                            setPickupDate(date);
                            setShowPickupCalendar(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Pickup Time</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={pickupTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPickupTime(time)}
                          className="text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Pickup Location
                    </Label>
                    <Textarea
                      placeholder="Enter complete pickup address..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </>
              )}

              {/* Home Delivery - Pickup and delivery scheduling */}
              {serviceType === "home-delivery" && (
                <>
                  {/* Pickup Section */}
                  <div className="space-y-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-medium text-green-800 flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Pickup Details
                    </h4>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Pickup Date</Label>
                      <Popover open={showPickupCalendar} onOpenChange={setShowPickupCalendar}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left text-sm">
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {pickupDate ? format(pickupDate, "PP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={pickupDate}
                            onSelect={(date) => {
                              setPickupDate(date);
                              setShowPickupCalendar(false);
                              if (deliveryDate && date && deliveryDate <= addDays(date, 1)) {
                                setDeliveryDate(undefined);
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Pickup Time</Label>
                      <div className="grid grid-cols-3 gap-1">
                        {timeSlots.slice(0, 6).map((time) => (
                          <Button
                            key={time}
                            variant={pickupTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPickupTime(time)}
                            className="text-xs py-1"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Section */}
                  <div className="space-y-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <h4 className="font-medium text-purple-800 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Delivery Details
                    </h4>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">
                        Delivery Date (min. 2 days after pickup)
                      </Label>
                      <Popover open={showDeliveryCalendar} onOpenChange={setShowDeliveryCalendar}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left text-sm"
                            disabled={!pickupDate}
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {deliveryDate ? format(deliveryDate, "PP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={deliveryDate}
                            onSelect={(date) => {
                              setDeliveryDate(date);
                              setShowDeliveryCalendar(false);
                            }}
                            disabled={(date) => date < minDeliveryDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Delivery Time</Label>
                      <div className="grid grid-cols-3 gap-1">
                        {timeSlots.slice(0, 6).map((time) => (
                          <Button
                            key={time}
                            variant={deliveryTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDeliveryTime(time)}
                            className="text-xs py-1"
                            disabled={!deliveryDate}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Pickup & Delivery Location
                    </Label>
                    <Textarea
                      placeholder="Enter complete address..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </>
              )}

              {/* Special Instructions */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Special Instructions</Label>
                <Textarea
                  placeholder="Any special handling instructions..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </>
          )}
        </div>

        {/* Order Summary and Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-white space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%):</span>
                <span>{formatCurrency(taxTotal)}</span>
              </div>
              {serviceCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Service Charge:</span>
                  <span>{formatCurrency(serviceCharge)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
              onClick={onCompleteOrder}
              disabled={!selectedCustomer}
            >
              Complete Order • {formatCurrency(grandTotal)}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
