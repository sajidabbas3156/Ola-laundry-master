import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Droplets, Shirt, Sparkles } from "lucide-react";

type ServiceType = "wash" | "iron" | "wash_iron";

interface Service {
  id: ServiceType;
  name: string;
  description: string;
  icon: typeof Droplets;
  price: string;
  features: string[];
}

export default function ServiceSelection() {
  const [, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const services: Service[] = [
    {
      id: "wash",
      name: "Wash Only",
      description: "Professional washing service for your clothes",
      icon: Droplets,
      price: "2.5 BHD/kg",
      features: [
        "Deep cleaning",
        "Fabric softener included",
        "Fresh scent",
        "48-hour turnaround"
      ]
    },
    {
      id: "iron",
      name: "Iron Only",
      description: "Expert ironing for crisp, wrinkle-free clothes",
      icon: Shirt,
      price: "1.5 BHD/item",
      features: [
        "Professional pressing",
        "Starch available",
        "Crease-free finish",
        "24-hour turnaround"
      ]
    },
    {
      id: "wash_iron",
      name: "Wash + Iron",
      description: "Complete laundry care from wash to press",
      icon: Sparkles,
      price: "3.5 BHD/kg",
      features: [
        "Complete service",
        "Deep cleaning + pressing",
        "Best value",
        "72-hour turnaround"
      ]
    }
  ];

  const handleContinue = () => {
    if (selectedService) {
      // TODO: Navigate to order details page with selected service
      console.log("Selected service:", selectedService);
      // For now, go back to customer app
      setLocation("/customer-app");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/customer-app")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-foreground">Select Service</h1>
            <p className="text-xs text-muted-foreground">Choose your laundry service</p>
          </div>
        </div>
      </header>

      {/* Service Cards */}
      <div className="p-4 space-y-4 pb-24">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;
          
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedService(service.id)}
              data-testid={`card-service-${service.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected ? "bg-primary" : "bg-accent"
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isSelected ? "text-primary-foreground" : "text-primary"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge variant="default" data-testid={`badge-selected-${service.id}`}>
                      Selected
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                </div>

                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button
          className="w-full"
          size="lg"
          disabled={!selectedService}
          onClick={handleContinue}
          data-testid="button-continue"
        >
          Continue with {selectedService ? services.find(s => s.id === selectedService)?.name : "Service"}
        </Button>
      </div>
    </div>
  );
}
