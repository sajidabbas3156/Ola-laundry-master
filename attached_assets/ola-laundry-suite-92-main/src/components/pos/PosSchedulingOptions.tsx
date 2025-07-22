
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, Home, Store, Truck, MapPin } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface PosSchedulingOptionsProps {
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

export function PosSchedulingOptions({
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
}: PosSchedulingOptionsProps) {
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [deliveryTime, setDeliveryTime] = useState("");

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
      label: "Home Pickup",
      description: "We collect from customer's location",
      icon: <Home className="h-5 w-5" />,
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      id: "home-delivery",
      label: "Home Delivery",
      description: "Complete pickup and delivery service",
      icon: <Truck className="h-5 w-5" />,
      color: "bg-purple-50 border-purple-200 text-purple-700"
    }
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  // Calculate minimum delivery date (2 days after pickup)
  const minDeliveryDate = pickupDate ? addDays(pickupDate, 2) : addDays(new Date(), 2);

  return (
    <Card className="border-0 bg-gray-50 rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Service & Scheduling Options
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
            {/* Pickup Date Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Pickup Date</Label>
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

            {/* Pickup Time Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Pickup Time</Label>
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

            {/* Location Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pickup Location
              </Label>
              <Textarea
                placeholder="Enter complete pickup address with landmarks..."
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
            <div className="space-y-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Pickup Details
              </h4>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Pickup Date</Label>
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
                        // Reset delivery date if it's now invalid
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

              <div className="space-y-3">
                <Label className="text-sm font-medium">Pickup Time</Label>
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
            </div>

            {/* Delivery Section */}
            <div className="space-y-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Delivery Details
              </h4>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Delivery Date (minimum 2 days after pickup)
                </Label>
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
                      {deliveryDate ? format(deliveryDate, "PPP") : "Select delivery date"}
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
                  <p className="text-xs text-gray-500">Please select pickup date first</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Delivery Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={deliveryTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDeliveryTime(time)}
                      className="text-xs"
                      disabled={!deliveryDate}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pickup & Delivery Location
              </Label>
              <Textarea
                placeholder="Enter complete address with landmarks..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </>
        )}

        {/* Special Instructions - Always shown */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Special Instructions</Label>
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
