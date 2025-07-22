
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Store, MapPin, Clock } from "lucide-react";

interface DeliveryPreferenceSelectorProps {
  deliveryPreference: string;
  setDeliveryPreference: (preference: string) => void;
  pickupDate?: string;
  setPickupDate?: (date: string) => void;
  pickupTime?: string;
  setPickupTime?: (time: string) => void;
  deliveryAddress?: string;
  setDeliveryAddress?: (address: string) => void;
  specialInstructions?: string;
  setSpecialInstructions?: (instructions: string) => void;
  showScheduling?: boolean;
}

export function DeliveryPreferenceSelector({
  deliveryPreference,
  setDeliveryPreference,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  deliveryAddress,
  setDeliveryAddress,
  specialInstructions,
  setSpecialInstructions,
  showScheduling = true
}: DeliveryPreferenceSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-3 block">Service Options</Label>
        <RadioGroup 
          value={deliveryPreference}
          onValueChange={setDeliveryPreference}
          className="grid grid-cols-1 gap-3"
        >
          <Card className={`cursor-pointer transition-all ${deliveryPreference === 'pickup' ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="pickup" id="pickup" />
                <Store className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <Label htmlFor="pickup" className="font-medium cursor-pointer">Store Pickup</Label>
                  <p className="text-sm text-muted-foreground">Pick up from our store location</p>
                </div>
                <span className="text-sm font-medium text-green-600">Free</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${deliveryPreference === 'home-pickup' ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="home-pickup" id="home-pickup" />
                <MapPin className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <Label htmlFor="home-pickup" className="font-medium cursor-pointer">Home Pickup</Label>
                  <p className="text-sm text-muted-foreground">We'll pick up from your location</p>
                </div>
                <span className="text-sm font-medium text-blue-600">+$3.00</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${deliveryPreference === 'delivery' ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="delivery" id="delivery" />
                <Truck className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <Label htmlFor="delivery" className="font-medium cursor-pointer">Home Delivery</Label>
                  <p className="text-sm text-muted-foreground">We'll deliver to your address</p>
                </div>
                <span className="text-sm font-medium text-blue-600">+$5.00</span>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>

      {(deliveryPreference === 'home-pickup' || deliveryPreference === 'delivery') && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="address" className="flex items-center gap-1 mb-1">
              <MapPin className="h-4 w-4" />
              Address *
            </Label>
            <Textarea 
              id="address"
              placeholder="Enter your full address with landmarks"
              value={deliveryAddress || ''}
              onChange={(e) => setDeliveryAddress?.(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {showScheduling && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date" className="flex items-center gap-1 mb-1">
              <Clock className="h-4 w-4" />
              Preferred Date *
            </Label>
            <Input 
              id="date"
              type="date"
              value={pickupDate || ''}
              onChange={(e) => setPickupDate?.(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <Label htmlFor="time" className="flex items-center gap-1 mb-1">
              <Clock className="h-4 w-4" />
              Preferred Time *
            </Label>
            <Input 
              id="time"
              type="time"
              value={pickupTime || ''}
              onChange={(e) => setPickupTime?.(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="instructions">Special Instructions</Label>
        <Textarea 
          id="instructions"
          placeholder="Any special handling instructions or notes..."
          value={specialInstructions || ''}
          onChange={(e) => setSpecialInstructions?.(e.target.value)}
        />
      </div>
    </div>
  );
}
