import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Package, AlertTriangle, TrendingDown, BarChart, ShoppingCart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const inventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.string().min(0, "Quantity must be positive"),
  reorderPoint: z.string().min(0, "Reorder point must be positive"),
  reorderQuantity: z.string().min(1, "Reorder quantity must be positive"),
  unitCost: z.string().min(0, "Unit cost must be positive"),
  supplier: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

export default function InventoryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPurchaseOrderOpen, setIsPurchaseOrderOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: string;
    unit: string;
    quantity: number;
    reorderPoint: number;
    reorderQuantity: number;
    unitCost: number;
    supplier?: string;
  }

  interface PurchaseOrder {
    id: number;
    createdAt: string;
    inventory?: InventoryItem;
    quantity: number;
    supplier?: string;
    totalCost: number;
    status: string;
  }

  const { data: inventory, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: suppliers } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  const { data: purchaseOrders } = useQuery<PurchaseOrder[]>({
    queryKey: ["/api/purchase-orders"],
  });

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      unit: "",
      quantity: "0",
      reorderPoint: "10",
      reorderQuantity: "50",
      unitCost: "0",
      supplier: "",
    },
  });

  const createInventoryMutation = useMutation({
    mutationFn: async (data: InventoryFormValues) => {
      return await apiRequest("POST", "/api/inventory", {
        ...data,
        quantity: parseInt(data.quantity),
        reorderPoint: parseInt(data.reorderPoint),
        reorderQuantity: parseInt(data.reorderQuantity),
        unitCost: parseFloat(data.unitCost),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createPurchaseOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/purchase-orders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-orders"] });
      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });
      setIsPurchaseOrderOpen(false);
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity, type, reason }: any) => {
      return await apiRequest("POST", `/api/inventory/${id}/update-stock`, {
        quantity,
        type,
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    },
  });

  const onSubmit = (data: InventoryFormValues) => {
    createInventoryMutation.mutate(data);
  };

  const handleStockAdjustment = (item: any, type: "add" | "remove") => {
    const quantityStr = prompt(`Enter quantity to ${type}:`);
    if (quantityStr) {
      const quantity = parseInt(quantityStr);
      if (!isNaN(quantity) && quantity > 0) {
        const reason = prompt("Enter reason for adjustment:");
        if (reason) {
          updateStockMutation.mutate({
            id: item.id,
            quantity,
            type,
            reason,
          });
        }
      }
    }
  };

  const handleCreatePurchaseOrder = (item: any) => {
    const quantity = prompt(`Enter quantity to order (suggested: ${item.reorderQuantity}):`);
    if (quantity) {
      createPurchaseOrderMutation.mutate({
        inventoryId: item.id,
        quantity: parseInt(quantity),
        unitCost: item.unitCost,
        totalCost: parseInt(quantity) * item.unitCost,
        supplier: item.supplier,
      });
    }
  };

  const getStockStatus = (item: any) => {
    const percentage = (item.quantity / item.reorderPoint) * 100;
    if (item.quantity <= 0) {
      return <Badge className="bg-red-600">Out of Stock</Badge>;
    } else if (item.quantity <= item.reorderPoint) {
      return <Badge className="bg-orange-500">Low Stock</Badge>;
    } else if (percentage < 200) {
      return <Badge className="bg-yellow-500">Normal</Badge>;
    } else {
      return <Badge className="bg-green-500">Well Stocked</Badge>;
    }
  };

  const calculateInventoryValue = () => {
    return inventory?.reduce((sum: number, item: any) => sum + (item.quantity * item.unitCost), 0) || 0;
  };

  const getLowStockItems = () => {
    return inventory?.filter((item: any) => item.quantity <= item.reorderPoint) || [];
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage your stock levels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Detergent - 5L" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="DET-5L-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="detergents">Detergents</SelectItem>
                            <SelectItem value="fabric_softeners">Fabric Softeners</SelectItem>
                            <SelectItem value="stain_removers">Stain Removers</SelectItem>
                            <SelectItem value="packaging">Packaging</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="consumables">Consumables</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit of Measure</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pieces">Pieces</SelectItem>
                            <SelectItem value="liters">Liters</SelectItem>
                            <SelectItem value="kilograms">Kilograms</SelectItem>
                            <SelectItem value="boxes">Boxes</SelectItem>
                            <SelectItem value="bottles">Bottles</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reorderPoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reorder Point</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} />
                        </FormControl>
                        <FormDescription>Min stock level</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reorderQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reorder Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50" {...field} />
                        </FormControl>
                        <FormDescription>Order size</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unitCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Cost ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="15.99" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Supplies Co." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createInventoryMutation.isPending}>
                    Create Item
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory?.length || 0}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${calculateInventoryValue().toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Stock value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getLowStockItems().length}
            </div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchaseOrders?.filter((po: any) => po.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {getLowStockItems().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>These items need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getLowStockItems().map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} / {item.reorderPoint} {item.unit}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleCreatePurchaseOrder(item)}
                  >
                    Order
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Stock</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="transactions">Stock Movement</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>All items in your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.quantity} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell>{item.reorderPoint} {item.unit}</TableCell>
                      <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">
                        ${(item.quantity * item.unitCost).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStockStatus(item)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockAdjustment(item, "add")}
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockAdjustment(item, "remove")}
                          >
                            Remove
                          </Button>
                          {item.quantity <= item.reorderPoint && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCreatePurchaseOrder(item)}
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Track incoming inventory orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders?.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell>PO-{order.id.toString().padStart(5, '0')}</TableCell>
                      <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>{order.inventory?.name}</TableCell>
                      <TableCell>{order.quantity} {order.inventory?.unit}</TableCell>
                      <TableCell>{order.supplier || "-"}</TableCell>
                      <TableCell>${order.totalCost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'received' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            Mark Received
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}