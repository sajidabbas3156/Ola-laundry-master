import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Tag,
  Plus,
  Settings,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { WelcomeBanner } from "@/components/common/welcome-banner";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: string;
  minStockLevel: string;
  unit: string;
  costPerUnit: string;
  supplierId?: number;
  location?: string;
  notes?: string;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

interface Supplier {
  id: number;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  tenantId: number;
}

export default function InventoryManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory data
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  const { data: reorderAlerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/inventory/reorder-alerts"],
  });

  // Mutations for inventory actions
  const autoReorderMutation = useMutation({
    mutationFn: () => fetch("/api/inventory/auto-reorder", { method: "POST" }).then(r => r.json()),
    onSuccess: () => {
      toast({
        title: "Auto-reorder processed",
        description: "Purchase orders have been created for low stock items.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process auto-reorder.",
        variant: "destructive",
      });
    },
  });

  const updateUsageRatesMutation = useMutation({
    mutationFn: () => fetch("/api/inventory/update-usage-rates", { method: "POST" }).then(r => r.json()),
    onSuccess: () => {
      toast({
        title: "Usage rates updated",
        description: "Inventory usage rates have been recalculated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update usage rates.",
        variant: "destructive",
      });
    },
  });

  // Calculate dashboard metrics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter((item: InventoryItem) => 
    parseFloat(item.currentStock) <= parseFloat(item.minStockLevel)
  ).length;
  const totalValue = inventory.reduce((sum: number, item: InventoryItem) => 
    sum + (parseFloat(item.currentStock) * parseFloat(item.costPerUnit)), 0
  );
  const categories = [...new Set(inventory.map((item: InventoryItem) => item.category))].length;

  if (inventoryLoading || suppliersLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner />
        
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Inventory Management</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Keep your supplies in check with smart tracking and automatic reordering
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => updateUsageRatesMutation.mutate()}
            disabled={updateUsageRatesMutation.isPending}
            variant="outline"
            className="shadow-md hover:shadow-lg transition-all duration-200"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Update Usage Rates
          </Button>
          <Button
            onClick={() => autoReorderMutation.mutate()}
            disabled={autoReorderMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Smart Reorder
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reorderAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Automatic alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toFixed(2)} BHD</div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Active suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories}</div>
            <p className="text-xs text-muted-foreground">Item categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventory Items
            </CardTitle>
            <CardDescription>Manage your inventory stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Supplier Management
            </CardTitle>
            <CardDescription>Manage relationships with suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/suppliers">
              <Button className="w-full" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Manage Suppliers
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Purchase Orders
            </CardTitle>
            <CardDescription>Create and track purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/purchase-orders">
              <Button className="w-full" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Current Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>Overview of all inventory items and their stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Item Name</th>
                  <th className="text-left p-2 font-medium">Category</th>
                  <th className="text-left p-2 font-medium">Current Stock</th>
                  <th className="text-left p-2 font-medium">Min Level</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Cost/Unit</th>
                  <th className="text-left p-2 font-medium">Location</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item: InventoryItem) => {
                  const isLowStock = parseFloat(item.currentStock) <= parseFloat(item.minStockLevel);
                  return (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2">
                        <Badge variant="secondary">{item.category}</Badge>
                      </td>
                      <td className="p-2">{item.currentStock} {item.unit}</td>
                      <td className="p-2">{item.minStockLevel} {item.unit}</td>
                      <td className="p-2">
                        {isLowStock ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : (
                          <Badge variant="default">In Stock</Badge>
                        )}
                      </td>
                      <td className="p-2">{item.costPerUnit} BHD</td>
                      <td className="p-2">{item.location || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}