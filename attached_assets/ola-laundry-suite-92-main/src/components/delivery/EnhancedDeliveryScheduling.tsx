
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Clock, Store, Home, Truck, MapPin } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedDeliverySchedulingProps {
  serviceType: string;
  setServiceType: (type: string) => void;
  pickupDate: Date | undefined;
  setPickupDate: (date: Date | undefined) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  deliveryDate: Date | undefined;
  setDeliveryDate: (date: Date | undefined) => void;
  deliveryTime: string;
  setDeliveryTime: (time: string) => void;
  address: {
    city: string;
    block: string;
    road: string;
    building: string;
    landmark: string;
  };
  setAddress: (address: any) => void;
  specialInstructions: string;
  setSpecialInstructions: (instructions: string) => void;
}

export function EnhancedDeliveryScheduling({
  serviceType,
  setServiceType,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  address,
  setAddress,
  specialInstructions,
  setSpecialInstructions
}: EnhancedDeliverySchedulingProps) {
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);

  const cities = [
    "Manama", "Muharraq", "Riffa", "Hamad Town", "A'ali", "Isa Town", 
    "Sitra", "Budaiya", "Jidhafs", "Al-Manamah"
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const serviceOptions = [
    {
      id: "store-pickup",
      label: "Store Pickup",
      description: "Customer collects from our location",
      icon: <Store className="h-5 w-5" />,
      color: "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
      id: "home-pickup",
      label: "Home Pickup & Store Return",
      description: "We collect and customer picks up from store",
      icon: <Home className="h-5 w-5" />,
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      id: "home-delivery",
      label: "Complete Home Service",
      description: "Pickup and delivery to customer location",
      icon: <Truck className="h-5 w-5" />,
      color: "bg-purple-50 border-purple-200 text-purple-700"
    }
  ];

  // Auto-set delivery date 48 hours after pickup when pickup date changes
  const handlePickupDateChange = (date: Date | undefined) => {
    setPickupDate(date);
    if (date && serviceType === "home-delivery") {
      const minDeliveryDate = addDays(date, 2); // 48 hours later
      setDeliveryDate(minDeliveryDate);
    }
  };

  const minDeliveryDate = pickupDate ? addDays(pickupDate, 2) : addDays(new Date(), 2);

  return (
    <Card className="border-0 bg-gray-50 rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Service & Delivery Options
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Service Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Service Type</Label>
          <RadioGroup value={serviceType} onValueChange={setServiceType}>
            <div className="grid grid-cols-1 gap-3">
              {serviceOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label 
                    htmlFor={option.id} 
                    className={cn(
                      "flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      serviceType === option.id ? option.color : "bg-white border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {option.icon}
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

        {/* Address Section for pickup/delivery services */}
        {serviceType !== "store-pickup" && (
          <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {serviceType === "home-pickup" ? "Pickup Location" : "Pickup & Delivery Location"}
            </h4>
            
            <div>
              <Label>City</Label>
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
          </div>
        )}

        {/* Pickup Scheduling */}
        {serviceType !== "store-pickup" && (
          <div className="space-y-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800">Pickup Schedule</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pickup Date</Label>
                <Popover open={showPickupCalendar} onOpenChange={setShowPickupCalendar}>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={(date) => {
                        handlePickupDateChange(date);
                        setShowPickupCalendar(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Pickup Time</Label>
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
          </div>
        )}

        {/* Delivery Scheduling - Only for home delivery */}
        {serviceType === "home-delivery" && (
          <div className="space-y-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800">Delivery Schedule (48 hours minimum after pickup)</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Delivery Date</Label>
                <Popover open={showDeliveryCalendar} onOpenChange={setShowDeliveryCalendar}>
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
                {!pickupDate && (
                  <p className="text-xs text-gray-500 mt-1">Select pickup date first</p>
                )}
              </div>

              <div>
                <Label>Delivery Time</Label>
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
          </div>
        )}

        {/* Special Instructions */}
        <div className="space-y-3">
          <Label>Special Instructions</Label>
          <Textarea
            placeholder="Any special handling instructions or notes..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="min-h-[60px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
