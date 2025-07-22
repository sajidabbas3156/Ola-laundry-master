
import { Truck, Clock, Shield, Star } from "lucide-react";

interface StorefrontHeroProps {
  tenantName?: string;
}

export function StorefrontHero({ tenantName }: StorefrontHeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {tenantName || "Premium Laundry Service"}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            Professional laundry and dry cleaning services at your fingertips
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span className="text-sm md:text-base">Free Pickup & Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm md:text-base">24-48 Hour Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm md:text-base">Insured & Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span className="text-sm md:text-base">5-Star Rated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
