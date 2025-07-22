
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone } from "lucide-react";

interface EnhancedStorefrontHeroProps {
  tenantName?: string;
}

export function EnhancedStorefrontHero({ tenantName }: EnhancedStorefrontHeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-12 md:py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-medium">
              ✨ Premium Laundry Services
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            {tenantName || "Premium Laundry"}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Professional cleaning services with pickup & delivery to your doorstep
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-200" />
              <span>24hr Express Service</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-200" />
              <span>Free Pickup & Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-200" />
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
