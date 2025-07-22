import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Plus, Edit, Settings, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Tenant {
  id: number;
  name: string;
  subdomain: string;
  email: string;
  subscriptionStatus: string;
  subscriptionPlan: string;
  isActive: boolean;
  createdAt: string;
}

export default function TenantManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["/api/tenants"],
  });

  const createTenantMutation = useMutation({
    mutationFn: async (tenantData: any) => {
      const response = await apiRequest("POST", "/api/tenants", tenantData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Tenant created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTenantMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const response = await apiRequest("PUT", `/api/tenants/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      setEditingTenant(null);
      toast({
        title: "Success",
        description: "Tenant updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateTenant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const tenantData = {
      name: formData.get("name"),
      subdomain: formData.get("subdomain"),
      email: formData.get("email"),
      contactEmail: formData.get("contactEmail"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      subscriptionPlan: formData.get("subscriptionPlan"),
      subscriptionStatus: "trial",
    };
    createTenantMutation.mutate(tenantData);
  };

  const handleUpdateTenant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingTenant) return;
    
    const formData = new FormData(event.currentTarget);
    const updates = {
      id: editingTenant.id,
      name: formData.get("name"),
      email: formData.get("email"),
      subscriptionPlan: formData.get("subscriptionPlan"),
      subscriptionStatus: formData.get("subscriptionStatus"),
      isActive: formData.get("isActive") === "true",
    };
    updateTenantMutation.mutate(updates);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "trial": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise": return "bg-purple-100 text-purple-800";
      case "premium": return "bg-orange-100 text-orange-800";
      case "basic": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Tenant Management
          </h1>
          <p className="text-muted-foreground">Manage all tenants and their subscriptions</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
              <DialogDescription>
                Add a new tenant to the platform
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input id="subdomain" name="subdomain" required />
              </div>
              <div>
                <Label htmlFor="email">Primary Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" name="contactEmail" type="email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" />
              </div>
              <div>
                <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
                <Select name="subscriptionPlan">
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={createTenantMutation.isPending} className="w-full">
                {createTenantMutation.isPending ? "Creating..." : "Create Tenant"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant: Tenant) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tenant.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTenant(tenant)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>@{tenant.subdomain}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(tenant.subscriptionStatus)}>
                    {tenant.subscriptionStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge className={getPlanColor(tenant.subscriptionPlan)}>
                    {tenant.subscriptionPlan}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Badge variant={tenant.isActive ? "default" : "secondary"}>
                    {tenant.isActive ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">{tenant.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(tenant.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTenant} onOpenChange={() => setEditingTenant(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update tenant information and settings
            </DialogDescription>
          </DialogHeader>
          {editingTenant && (
            <form onSubmit={handleUpdateTenant} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Business Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  defaultValue={editingTenant.name} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Primary Email</Label>
                <Input 
                  id="edit-email" 
                  name="email" 
                  type="email" 
                  defaultValue={editingTenant.email} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-subscriptionPlan">Subscription Plan</Label>
                <Select name="subscriptionPlan" defaultValue={editingTenant.subscriptionPlan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-subscriptionStatus">Subscription Status</Label>
                <Select name="subscriptionStatus" defaultValue={editingTenant.subscriptionStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-isActive">Active Status</Label>
                <Select name="isActive" defaultValue={editingTenant.isActive.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={updateTenantMutation.isPending} className="w-full">
                {updateTenantMutation.isPending ? "Updating..." : "Update Tenant"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}