
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shirt, Sparkles, Zap, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const { tenantSlug } = useParams();

  const services = [
    {
      icon: Shirt,
      name: "Wash & Fold",
      description: "Regular washing and careful folding of your everyday clothes",
      price: "From $5.99",
      features: ["Regular wash cycle", "Fabric softener", "Careful folding", "Same day service"],
      multiplier: "1.0x",
      color: "blue"
    },
    {
      icon: Zap,
      name: "Wash & Iron",
      description: "Complete washing service with professional ironing and pressing",
      price: "From $7.99",
      features: ["Premium wash", "Professional ironing", "Wrinkle-free finish", "Hanging service"],
      multiplier: "1.5x",
      color: "green"
    },
    {
      icon: Sparkles,
      name: "Dry Cleaning",
      description: "Professional dry cleaning for delicate and special garments",
      price: "From $8.99",
      features: ["Chemical cleaning", "Delicate handling", "Professional finishing", "Stain treatment"],
      multiplier: "2.0x",
      color: "purple"
    },
    {
      icon: Package,
      name: "Iron Only",
      description: "Professional ironing service for your already clean clothes",
      price: "From $4.99",
      features: ["Steam ironing", "Crease removal", "Professional finish", "Quick service"],
      multiplier: "0.8x",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional laundry services tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(service.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{service.price}</Badge>
                        <Badge className={getColorClasses(service.color)}>{service.multiplier}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{service.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/tenant/${tenantSlug}/storefront`)}
                  >
                    Order This Service
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6">
              Choose your items, select a service, and let us handle the rest
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate(`/tenant/${tenantSlug}/storefront`)}
            >
              Start Your Order Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
