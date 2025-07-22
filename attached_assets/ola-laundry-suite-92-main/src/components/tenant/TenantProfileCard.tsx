
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  Edit,
  Shirt,
  Droplets,
  Wind,
  Sparkles
} from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";

export function TenantProfileCard() {
  const { currentTenant } = useTenant();

  if (!currentTenant) return null;

  const services = [
    { name: "Wash & Fold", icon: Droplets, status: "active" },
    { name: "Dry Cleaning", icon: Sparkles, status: "active" },
    { name: "Express Service", icon: Wind, status: "active" },
    { name: "Ironing", icon: Shirt, status: "maintenance" }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{currentTenant.name}</CardTitle>
              <p className="text-blue-100 text-sm">Laundry & Dry Cleaning</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Business Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">123 Business Street, City</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="text-sm">contact@{currentTenant.slug}.com</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Mon-Fri: 7AM - 8PM</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">4.8 Rating (245 reviews)</span>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Service Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {services.map((service) => (
              <div key={service.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/70">
                <service.icon className="h-4 w-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{service.name}</p>
                  <Badge 
                    variant={service.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
