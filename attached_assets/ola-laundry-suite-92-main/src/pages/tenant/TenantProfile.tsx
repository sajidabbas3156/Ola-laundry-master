
import { TenantProfileCard } from "@/components/tenant/TenantProfileCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shirt, 
  Droplets, 
  Wind, 
  Sparkles, 
  Clock, 
  MapPin,
  Edit,
  Save,
  Camera
} from "lucide-react";

export default function TenantProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tenant Profile</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Main Profile Card */}
      <TenantProfileCard />

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Monday - Friday</span>
                <span className="text-blue-600">7:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Saturday</span>
                <span className="text-blue-600">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Sunday</span>
                <span className="text-gray-500">Closed</span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Special Hours</h4>
              <p className="text-sm text-blue-700">Express pickup available 24/7 with advance notice</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Service Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Wash & Fold", icon: Droplets, price: "from $12", status: "active" },
              { name: "Dry Cleaning", icon: Sparkles, price: "from $25", status: "active" },
              { name: "Express Service", icon: Wind, price: "from $18", status: "active" },
              { name: "Ironing & Press", icon: Shirt, price: "from $8", status: "maintenance" }
            ].map((service) => (
              <div key={service.name} className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.price}</p>
                  </div>
                </div>
                <Badge 
                  variant={service.status === 'active' ? 'default' : 'secondary'}
                  className="w-full justify-center"
                >
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
