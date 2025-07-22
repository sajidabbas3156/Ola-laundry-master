
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Search, Settings, Users, Package, CreditCard, Palette, Percent, Star, BarChart3, Truck, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
}

interface TenantFeatures {
  tenantId: string;
  tenantName: string;
  features: Record<string, boolean>;
}

const availableFeatures: Feature[] = [
  {
    id: "pos",
    name: "POS System",
    description: "Point of sale system for in-store transactions",
    icon: CreditCard,
    category: "Sales"
  },
  {
    id: "storefront",
    name: "Online Storefront",
    description: "Customer-facing online ordering system",
    icon: Package,
    category: "Sales"
  },
  {
    id: "inventory",
    name: "Inventory Management",
    description: "Manage items, pricing, and stock levels",
    icon: Package,
    category: "Operations"
  },
  {
    id: "customization",
    name: "Store Customization",
    description: "Customize store appearance and branding",
    icon: Palette,
    category: "Branding"
  },
  {
    id: "promotions",
    name: "Promotions & Discounts",
    description: "Create and manage promotional campaigns",
    icon: Percent,
    category: "Marketing"
  },
  {
    id: "reviews",
    name: "Customer Reviews",
    description: "Collect and manage customer feedback",
    icon: Star,
    category: "Marketing"
  },
  {
    id: "scheduling",
    name: "Appointment Scheduling",
    description: "Schedule pickups and deliveries",
    icon: Calendar,
    category: "Operations"
  },
  {
    id: "delivery",
    name: "Delivery Management",
    description: "Track and manage deliveries",
    icon: Truck,
    category: "Operations"
  },
  {
    id: "reports",
    name: "Analytics & Reports",
    description: "Business insights and reporting",
    icon: BarChart3,
    category: "Analytics"
  }
];

export default function FeatureManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tenantFeatures, setTenantFeatures] = useState<TenantFeatures[]>([
    {
      tenantId: "1",
      tenantName: "ABC Laundry",
      features: {
        pos: true,
        storefront: true,
        inventory: true,
        customization: false,
        promotions: true,
        reviews: false,
        scheduling: true,
        delivery: true,
        reports: false
      }
    },
    {
      tenantId: "2", 
      tenantName: "Quick Clean",
      features: {
        pos: true,
        storefront: true,
        inventory: true,
        customization: true,
        promotions: false,
        reviews: true,
        scheduling: false,
        delivery: false,
        reports: true
      }
    }
  ]);

  const filteredTenants = tenantFeatures.filter(tenant =>
    tenant.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFeatureToggle = (tenantId: string, featureId: string, enabled: boolean) => {
    setTenantFeatures(prev =>
      prev.map(tenant =>
        tenant.tenantId === tenantId
          ? {
              ...tenant,
              features: {
                ...tenant.features,
                [featureId]: enabled
              }
            }
          : tenant
      )
    );
    
    const tenant = tenantFeatures.find(t => t.tenantId === tenantId);
    const feature = availableFeatures.find(f => f.id === featureId);
    toast.success(`${enabled ? "Enabled" : "Disabled"} ${feature?.name} for ${tenant?.tenantName}`);
  };

  const getEnabledFeatureCount = (tenant: TenantFeatures) => {
    return Object.values(tenant.features).filter(Boolean).length;
  };

  const categories = Array.from(new Set(availableFeatures.map(f => f.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Feature Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tenants..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.tenantId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {tenant.tenantName.charAt(0)}
                  </div>
                  {tenant.tenantName}
                </CardTitle>
                <Badge variant="outline">
                  {getEnabledFeatureCount(tenant)}/{availableFeatures.length} features enabled
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
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
                                <Label htmlFor={`${tenant.tenantId}-${feature.id}`} className="font-medium">
                                  {feature.name}
                                </Label>
                                <p className="text-xs text-gray-500">{feature.description}</p>
                              </div>
                            </div>
                            <Switch
                              id={`${tenant.tenantId}-${feature.id}`}
                              checked={tenant.features[feature.id] || false}
                              onCheckedChange={(checked) => 
                                handleFeatureToggle(tenant.tenantId, feature.id, checked)
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No tenants found</h3>
          <p className="text-sm text-muted-foreground">
            No tenants match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
