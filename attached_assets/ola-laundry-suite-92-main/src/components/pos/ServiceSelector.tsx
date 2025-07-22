
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface LaundryService {
  id: string;
  name: string;
  description: string;
  category: 'wash' | 'delivery' | 'special';
}

export const defaultLaundryServices: LaundryService[] = [
  {
    id: "wash-fold",
    name: "Wash & Fold",
    description: "Standard wash and fold service",
    category: 'wash'
  },
  {
    id: "dry-clean",
    name: "Dry Cleaning",
    description: "Professional dry cleaning service",
    category: 'wash'
  },
  {
    id: "express-wash",
    name: "Express Wash",
    description: "Same day wash service",
    category: 'wash'
  },
  {
    id: "home-pickup",
    name: "Home Pickup",
    description: "Pickup from your location",
    category: 'delivery'
  },
  {
    id: "home-delivery",
    name: "Home Delivery",
    description: "Delivery to your location",
    category: 'delivery'
  },
  {
    id: "pickup-delivery",
    name: "Pickup & Delivery",
    description: "Complete pickup and delivery service",
    category: 'delivery'
  }
];

interface ServiceSelectorProps {
  selectedServiceId: string;
  setSelectedServiceId: (serviceId: string) => void;
  availableServices?: string[];
}

export function ServiceSelector({
  selectedServiceId,
  setSelectedServiceId,
  availableServices
}: ServiceSelectorProps) {
  const services = availableServices 
    ? defaultLaundryServices.filter(service => availableServices.includes(service.id))
    : defaultLaundryServices;

  return (
    <div className="space-y-2">
      <Label htmlFor="service">Select Service</Label>
      <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
        <SelectTrigger>
          <SelectValue placeholder="Choose service type" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              <div className="flex flex-col">
                <span className="font-medium">{service.name}</span>
                <span className="text-sm text-muted-foreground">
                  {service.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
