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
import { Package, Plus, Minus, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  tenantId: number;
}

export default function InventoryManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [stockAdjustmentItem, setStockAdjustmentItem] = useState<InventoryItem | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  const createItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      const response = await apiRequest("POST", "/api/inventory", itemData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Inventory item created successfully",
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

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const response = await apiRequest("PUT", `/api/inventory/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setEditingItem(null);
      setStockAdjustmentItem(null);
      toast({
        title: "Success",
        description: "Inventory updated successfully",
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

  const handleCreateItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const itemData = {
      name: formData.get("name"),
      category: formData.get("category"),
      currentStock: parseInt(formData.get("currentStock") as string),
      minStockLevel: parseInt(formData.get("minStockLevel") as string),
      unit: formData.get("unit"),
      costPerUnit: parseFloat(formData.get("costPerUnit") as string),
      supplier: formData.get("supplier"),
      tenantId: 1, // Default tenant for now
    };
    createItemMutation.mutate(itemData);
  };

  const handleStockAdjustment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stockAdjustmentItem) return;
    
    const formData = new FormData(event.currentTarget);
    const adjustmentType = formData.get("adjustmentType") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    
    let newStock = stockAdjustmentItem.currentStock;
    if (adjustmentType === "add") {
      newStock += quantity;
    } else {
      newStock = Math.max(0, newStock - quantity);
    }
    
    updateItemMutation.mutate({
      id: stockAdjustmentItem.id,
      currentStock: newStock,
      lastRestocked: adjustmentType === "add" ? new Date().toISOString() : stockAdjustmentItem.lastRestocked,
    });
  };

  const getLowStockItems = () => {
    return inventory.filter((item: InventoryItem) => item.currentStock <= item.minStockLevel);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (item.currentStock <= item.minStockLevel) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { status: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const getTotalInventoryValue = () => {
    return inventory.reduce((total: number, item: InventoryItem) => 
      total + (item.currentStock * item.costPerUnit), 0
    ).toFixed(2);
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

  const lowStockItems = getLowStockItems();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground">Track and manage your laundry supplies</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detergent">Detergent</SelectItem>
                    <SelectItem value="fabric_softener">Fabric Softener</SelectItem>
                    <SelectItem value="stain_remover">Stain Remover</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input id="currentStock" name="currentStock" type="number" required />
                </div>
                <div>
                  <Label htmlFor="minStockLevel">Min Stock Level</Label>
                  <Input id="minStockLevel" name="minStockLevel" type="number" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" name="unit" placeholder="kg, liters, pieces" required />
                </div>
                <div>
                  <Label htmlFor="costPerUnit">Cost per Unit (BHD)</Label>
                  <Input id="costPerUnit" name="costPerUnit" type="number" step="0.01" required />
                </div>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" name="supplier" />
              </div>
              <Button type="submit" disabled={createItemMutation.isPending} className="w-full">
                {createItemMutation.isPending ? "Adding..." : "Add Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">BHD {getTotalInventoryValue()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(inventory.map((item: InventoryItem) => item.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-yellow-700">
              {lowStockItems.length} items need restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item: InventoryItem) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-yellow-700">
                    {item.currentStock} {item.unit} left (min: {item.minStockLevel})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item: InventoryItem) => {
          const stockStatus = getStockStatus(item);
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <CardDescription>
                  <Badge className={stockStatus.color}>
                    {stockStatus.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Stock</span>
                    <span className="font-medium">{item.currentStock} {item.unit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Min Level</span>
                    <span className="text-sm">{item.minStockLevel} {item.unit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cost per Unit</span>
                    <span className="text-sm">BHD {item.costPerUnit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="font-medium">
                      BHD {(item.currentStock * item.costPerUnit).toFixed(2)}
                    </span>
                  </div>
                  {item.supplier && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Supplier</span>
                      <span className="text-sm">{item.supplier}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStockAdjustmentItem(item)}
                      className="flex-1"
                    >
                      Adjust Stock
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stock Adjustment Dialog */}
      <Dialog open={!!stockAdjustmentItem} onOpenChange={() => setStockAdjustmentItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Adjust stock levels for {stockAdjustmentItem?.name}
            </DialogDescription>
          </DialogHeader>
          {stockAdjustmentItem && (
            <form onSubmit={handleStockAdjustment} className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Stock:</span>
                  <span className="font-bold">
                    {stockAdjustmentItem.currentStock} {stockAdjustmentItem.unit}
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="adjustmentType">Adjustment Type</Label>
                <Select name="adjustmentType" defaultValue="add">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  min="1" 
                  required 
                />
              </div>
              <Button type="submit" disabled={updateItemMutation.isPending} className="w-full">
                {updateItemMutation.isPending ? "Updating..." : "Update Stock"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}