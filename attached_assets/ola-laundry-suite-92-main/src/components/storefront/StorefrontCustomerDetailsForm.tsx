
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock } from "lucide-react";

interface StorefrontCustomerDetailsFormProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  pickupDate: string;
  setPickupDate: (date: string) => void;
  deliveryPreference: string;
  setDeliveryPreference: (preference: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export function StorefrontCustomerDetailsForm({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerEmail,
  setCustomerEmail,
  pickupTime,
  setPickupTime,
  pickupDate,
  setPickupDate,
  deliveryPreference,
  setDeliveryPreference,
  notes,
  setNotes
}: StorefrontCustomerDetailsFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Name *</Label>
          <Input 
            id="customerName" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone *</Label>
          <Input 
            id="customerPhone" 
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="customerEmail">Email</Label>
        <Input 
          id="customerEmail" 
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Delivery Preference</Label>
        <RadioGroup 
          value={deliveryPreference}
          onValueChange={setDeliveryPreference}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup">Store Pickup</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery">Home Delivery (+$5.00)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pickupDate" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Date *</span>
          </Label>
          <Input 
            id="pickupDate" 
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pickupTime" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Time *</span>
          </Label>
          <Input 
            id="pickupTime" 
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Special Instructions</Label>
        <Textarea 
          id="notes" 
          placeholder="Add any special instructions here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </>
  );
}
