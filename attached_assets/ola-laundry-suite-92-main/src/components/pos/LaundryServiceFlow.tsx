
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shirt, 
  Sparkles, 
  Wind, 
  Zap,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LaundryItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  icon: string;
}

interface LaundryService {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  icon: any;
  duration: string;
  color: string;
}

const laundryServices: LaundryService[] = [
  {
    id: 'wash-fold',
    name: 'Wash & Fold',
    description: 'Basic washing and folding service',
    priceMultiplier: 1.0,
    icon: Shirt,
    duration: '24-48 hrs',
    color: 'bg-blue-500'
  },
  {
    id: 'wash-iron',
    name: 'Wash & Iron',
    description: 'Washing with professional ironing',
    priceMultiplier: 1.5,
    icon: Zap,
    duration: '48-72 hrs',
    color: 'bg-green-500'
  },
  {
    id: 'dry-cleaning',
    name: 'Dry Cleaning',
    description: 'Professional dry cleaning service',
    priceMultiplier: 2.0,
    icon: Sparkles,
    duration: '3-5 days',
    color: 'bg-purple-500'
  },
  {
    id: 'iron-only',
    name: 'Iron Only',
    description: 'Professional ironing service',
    priceMultiplier: 0.8,
    icon: Wind,
    duration: '24 hrs',
    color: 'bg-orange-500'
  }
];

interface LaundryServiceFlowProps {
  item: LaundryItem;
  onComplete: (item: LaundryItem, service: LaundryService, scheduling: any, payment: any) => void;
  onCancel: () => void;
}

export function LaundryServiceFlow({ item, onComplete, onCancel }: LaundryServiceFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<LaundryService | null>(null);
  const [scheduling, setScheduling] = useState({
    type: 'pickup',
    date: '',
    time: '',
    address: ''
  });
  const [payment, setPayment] = useState({
    method: 'cash',
    amount: 0
  });

  const steps = [
    { number: 1, title: 'Service Selection', icon: Sparkles },
    { number: 2, title: 'Scheduling', icon: Calendar },
    { number: 3, title: 'Payment', icon: CreditCard },
    { number: 4, title: 'Confirmation', icon: CheckCircle }
  ];

  const calculatePrice = () => {
    if (!selectedService) return item.basePrice;
    return item.basePrice * selectedService.priceMultiplier;
  };

  const handleServiceSelect = (service: LaundryService) => {
    setSelectedService(service);
    setPayment(prev => ({ ...prev, amount: item.basePrice * service.priceMultiplier }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(item, selectedService!, scheduling, payment);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return scheduling.type && scheduling.date && scheduling.time;
      case 3: return payment.method && payment.amount > 0;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                isActive 
                  ? "bg-blue-500 border-blue-500 text-white" 
                  : "bg-gray-200 border-gray-300 text-gray-500"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <p className={cn(
                "text-xs mt-2 text-center",
                isActive ? "text-blue-600 font-medium" : "text-gray-500"
              )}>
                {step.title}
              </p>
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute top-5 h-0.5 w-full -translate-y-1/2",
                  isActive && currentStep > step.number 
                    ? "bg-blue-500" 
                    : "bg-gray-200"
                )} style={{ left: '50%', width: 'calc(50% - 1.25rem)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Item Info */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 capitalize">{item.category}</p>
              <p className="text-sm text-gray-500">Base Price: ${item.basePrice.toFixed(2)}</p>
            </div>
            {selectedService && (
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ${calculatePrice().toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{selectedService.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Laundry Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {laundryServices.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedService?.id === service.id;
              
              return (
                <div
                  key={service.id}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                    isSelected 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-full text-white", service.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">{service.duration}</Badge>
                        <span className="text-lg font-semibold text-green-600">
                          ${(item.basePrice * service.priceMultiplier).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule Pickup/Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={scheduling.type === 'pickup' ? 'default' : 'outline'}
                onClick={() => setScheduling(prev => ({ ...prev, type: 'pickup' }))}
                className="h-12"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Pickup
              </Button>
              <Button
                variant={scheduling.type === 'delivery' ? 'default' : 'outline'}
                onClick={() => setScheduling(prev => ({ ...prev, type: 'delivery' }))}
                className="h-12"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Home Delivery
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                  value={scheduling.date}
                  onChange={(e) => setScheduling(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={scheduling.time}
                  onChange={(e) => setScheduling(prev => ({ ...prev, time: e.target.value }))}
                >
                  <option value="">Select time</option>
                  <option value="9:00-12:00">9:00 AM - 12:00 PM</option>
                  <option value="12:00-15:00">12:00 PM - 3:00 PM</option>
                  <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
                  <option value="18:00-21:00">6:00 PM - 9:00 PM</option>
                </select>
              </div>
            </div>

            {scheduling.type === 'delivery' && (
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Address</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="Enter your delivery address..."
                  value={scheduling.address}
                  onChange={(e) => setScheduling(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {['cash', 'card', 'digital'].map((method) => (
                <Button
                  key={method}
                  variant={payment.method === method ? 'default' : 'outline'}
                  onClick={() => setPayment(prev => ({ ...prev, method }))}
                  className="h-16 flex flex-col"
                >
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span className="capitalize">{method}</span>
                </Button>
              ))}
            </div>
            
            <Separator />
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Service Cost:</span>
                <span>${calculatePrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tax (5%):</span>
                <span>${(calculatePrice() * 0.05).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${(calculatePrice() * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <p className="font-medium">Your order has been confirmed</p>
              <p className="text-sm text-gray-600">
                {selectedService?.name} for {item.name}
              </p>
              <p className="text-sm text-gray-600">
                {scheduling.type === 'pickup' ? 'Pickup' : 'Delivery'} on {scheduling.date} at {scheduling.time}
              </p>
              <p className="text-lg font-semibold text-green-600">
                Total: ${(calculatePrice() * 1.05).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : () => setCurrentStep(currentStep - 1)}
          className="flex-1"
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1"
        >
          {currentStep === 4 ? 'Complete Order' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
