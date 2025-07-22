
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Tenant } from "@/types/tenant-management";
import { TenantSearchFilters } from "@/components/admin/tenant-management/TenantSearchFilters";
import { TenantCard } from "@/components/admin/tenant-management/TenantCard";
import { EmptyTenantsState } from "@/components/admin/tenant-management/EmptyTenantsState";
import { LoadingSpinner, ErrorState } from "@/components/ui/enhanced-loading-states";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";

export default function TenantManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "ABC Laundry",
      subdomain: "abc-laundry",
      email: "admin@abclaundry.com",
      status: "active",
      subscriptionPlan: "premium",
      createdAt: "2024-01-15",
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
      id: "2", 
      name: "Quick Clean",
      subdomain: "quick-clean",
      email: "owner@quickclean.com",
      status: "trial",
      subscriptionPlan: "basic",
      createdAt: "2024-02-20",
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

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFeatureToggle = async (tenantId: string, featureId: string, enabled: boolean) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTenants(prev =>
        prev.map(tenant =>
          tenant.id === tenantId
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
      
      const tenant = tenants.find(t => t.id === tenantId);
      const featureNames: Record<string, string> = {
        pos: "POS System",
        storefront: "Online Storefront",
        inventory: "Inventory Management",
        customization: "Store Customization",
        promotions: "Promotions & Discounts",
        reviews: "Customer Reviews",
        scheduling: "Appointment Scheduling",
        delivery: "Delivery Management",
        reports: "Analytics & Reports"
      };
      
      toast.success(`${enabled ? "Enabled" : "Disabled"} ${featureNames[featureId]} for ${tenant?.name}`);
    } catch (error) {
      toast.error("Failed to update feature. Please try again.");
      setError("Failed to update tenant feature");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tenantId: string, newStatus: "active" | "inactive" | "trial") => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTenants(prev =>
        prev.map(tenant =>
          tenant.id === tenantId ? { ...tenant, status: newStatus } : tenant
        )
      );
      
      const tenant = tenants.find(t => t.id === tenantId);
      toast.success(`Updated ${tenant?.name} status to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
      setError("Failed to update tenant status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChange = async (tenantId: string, newPlan: "basic" | "premium" | "enterprise") => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTenants(prev =>
        prev.map(t => t.id === tenantId ? { ...t, subscriptionPlan: newPlan } : t)
      );
      
      const tenant = tenants.find(t => t.id === tenantId);
      toast.success(`Updated ${tenant?.name} to ${newPlan} plan`);
    } catch (error) {
      toast.error("Failed to update subscription. Please try again.");
      setError("Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Tenant data refreshed successfully");
    } catch (error) {
      setError("Failed to refresh data");
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const getEnabledFeatureCount = (tenant: Tenant) => {
    return Object.values(tenant.features).filter(Boolean).length;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default" as const;
      case "trial": return "secondary" as const;
      case "inactive": return "destructive" as const;
      default: return "outline" as const;
    }
  };

  if (error) {
    return (
      <ErrorState 
        message={error} 
        retry={() => {
          setError(null);
          handleRefresh();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-gray-600 mt-1">Manage tenant features, subscriptions, and settings</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>

      <TenantSearchFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      <div className="grid gap-6">
        {filteredTenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            onFeatureToggle={handleFeatureToggle}
            onStatusChange={handleStatusChange}
            onSubscriptionChange={handleSubscriptionChange}
            getEnabledFeatureCount={getEnabledFeatureCount}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        ))}
      </div>

      {filteredTenants.length === 0 && !loading && <EmptyTenantsState />}
    </div>
  );
}
