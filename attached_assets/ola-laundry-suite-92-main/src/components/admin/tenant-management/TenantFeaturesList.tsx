
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, Package, Palette, Percent, Star, BarChart3, Truck, Calendar } from "lucide-react";
import { Tenant, Feature } from "@/types/tenant-management";

const availableFeatures: Feature[] = [
  { id: "pos", name: "POS System", description: "Point of sale system", icon: CreditCard, category: "Sales", enabled: true },
  { id: "storefront", name: "Online Storefront", description: "Customer-facing store", icon: Package, category: "Sales", enabled: true },
  { id: "inventory", name: "Inventory Management", description: "Manage stock and items", icon: Package, category: "Operations", enabled: true },
  { id: "customization", name: "Store Customization", description: "Branding and appearance", icon: Palette, category: "Branding", enabled: true },
  { id: "promotions", name: "Promotions & Discounts", description: "Marketing campaigns", icon: Percent, category: "Marketing", enabled: true },
  { id: "reviews", name: "Customer Reviews", description: "Feedback system", icon: Star, category: "Marketing", enabled: true },
  { id: "scheduling", name: "Appointment Scheduling", description: "Schedule services", icon: Calendar, category: "Operations", enabled: true },
  { id: "delivery", name: "Delivery Management", description: "Track deliveries", icon: Truck, category: "Operations", enabled: true },
  { id: "reports", name: "Analytics & Reports", description: "Business insights", icon: BarChart3, category: "Analytics", enabled: true }
];

interface TenantFeaturesListProps {
  tenant: Tenant;
  onFeatureToggle: (tenantId: string, featureId: string, enabled: boolean) => void;
}

export function TenantFeaturesList({ tenant, onFeatureToggle }: TenantFeaturesListProps) {
  const categories = Array.from(new Set(availableFeatures.map(f => f.category)));

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category}>
          <h3 className="font-medium text-sm text-gray-600 mb-3">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableFeatures
              .filter(feature => feature.category === category)
              .map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <feature.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <Label htmlFor={`${tenant.id}-${feature.id}`} className="font-medium">
                        {feature.name}
                      </Label>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                  <Switch
                    id={`${tenant.id}-${feature.id}`}
                    checked={tenant.features[feature.id] || false}
                    onCheckedChange={(checked) => 
                      onFeatureToggle(tenant.id, feature.id, checked)
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
