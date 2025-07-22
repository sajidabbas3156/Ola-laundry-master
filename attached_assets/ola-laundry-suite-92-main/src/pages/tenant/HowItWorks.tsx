
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Package,
      title: "1. Select Items",
      description: "Choose your laundry items and select the service type you need",
      badge: "Easy Selection"
    },
    {
      icon: Clock,
      title: "2. Schedule Pickup",
      description: "Pick a convenient time for pickup or choose delivery option",
      badge: "Flexible Timing"
    },
    {
      icon: CheckCircle,
      title: "3. We Process",
      description: "Our professional team handles your laundry with care",
      badge: "Quality Service"
    },
    {
      icon: Truck,
      title: "4. Delivery",
      description: "Get your clean clothes delivered back to you on time",
      badge: "On-Time Delivery"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple 4-step process makes getting your laundry done effortless
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">{step.badge}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Wash & Fold</h4>
                  <p className="text-sm text-gray-600">Regular washing and folding service</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Dry Cleaning</h4>
                  <p className="text-sm text-gray-600">Professional dry cleaning for delicate items</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Wash & Iron</h4>
                  <p className="text-sm text-gray-600">Complete wash and professional ironing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Home Pickup & Delivery</h4>
                  <p className="text-sm text-gray-600">We pickup and deliver to your doorstep</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Store Pickup</h4>
                  <p className="text-sm text-gray-600">Drop off and pickup at our store</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
