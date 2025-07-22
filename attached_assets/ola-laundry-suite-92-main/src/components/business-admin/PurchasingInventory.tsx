
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ShoppingCart, Package, Plus, AlertTriangle, TrendingDown, Building } from "lucide-react";
import { Purchase, ConsumableItem, Vendor, StockMovement } from "@/types/business-admin";

export function PurchasingInventory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [consumables, setConsumables] = useState<ConsumableItem[]>([
    {
      id: "1",
      name: "Detergent Powder",
      category: "Cleaning Supplies",
      currentStock: 50,
      reorderLevel: 20,
      unit: "kg",
      lastRestockDate: new Date(),
      costPerUnit: 3.50,
      supplier: "CleanCorp"
    },
    {
      id: "2",
      name: "Fabric Softener",
      category: "Cleaning Supplies",
      currentStock: 15,
      reorderLevel: 25,
      unit: "liters",
      lastRestockDate: new Date(),
      costPerUnit: 5.00,
      supplier: "CleanCorp"
    }
  ]);
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "1",
      name: "CleanCorp",
      contactPerson: "John Doe",
      email: "john@cleancorp.com",
      phone: "+1234567890",
      address: "123 Supply St",
      category: "Cleaning Supplies"
    }
  ]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isConsumableDialogOpen, setIsConsumableDialogOpen] = useState(false);
  const [isStockMovementOpen, setIsStockMovementOpen] = useState(false);

  const [newPurchase, setNewPurchase] = useState({
    vendorId: "",
    items: [],
    paymentMethod: "",
    notes: ""
  });

  const [newVendor, setNewVendor] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    category: ""
  });

  const [newConsumable, setNewConsumable] = useState({
    name: "",
    category: "",
    currentStock: "",
    reorderLevel: "",
    unit: "",
    costPerUnit: "",
    supplier: ""
  });

  const [stockMovement, setStockMovement] = useState({
    itemId: "",
    type: "in" as "in" | "out",
    quantity: "",
    reason: ""
  });

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.contactPerson) {
      toast.error("Please fill in required fields");
      return;
    }

    const vendor: Vendor = {
      id: Date.now().toString(),
      ...newVendor
    };

    setVendors(prev => [...prev, vendor]);
    setNewVendor({ name: "", contactPerson: "", email: "", phone: "", address: "", category: "" });
    setIsVendorDialogOpen(false);
    toast.success("Vendor added successfully!");
  };

  const handleAddConsumable = () => {
    if (!newConsumable.name || !newConsumable.currentStock) {
      toast.error("Please fill in required fields");
      return;
    }

    const consumable: ConsumableItem = {
      id: Date.now().toString(),
      name: newConsumable.name,
      category: newConsumable.category,
      currentStock: parseInt(newConsumable.currentStock),
      reorderLevel: parseInt(newConsumable.reorderLevel),
      unit: newConsumable.unit,
      lastRestockDate: new Date(),
      costPerUnit: parseFloat(newConsumable.costPerUnit),
      supplier: newConsumable.supplier
    };

    setConsumables(prev => [...prev, consumable]);
    setNewConsumable({ name: "", category: "", currentStock: "", reorderLevel: "", unit: "", costPerUnit: "", supplier: "" });
    setIsConsumableDialogOpen(false);
    toast.success("Consumable item added successfully!");
  };

  const handleStockMovement = () => {
    if (!stockMovement.itemId || !stockMovement.quantity) {
      toast.error("Please fill in all fields");
      return;
    }

    const movement: StockMovement = {
      id: Date.now().toString(),
      itemId: stockMovement.itemId,
      type: stockMovement.type,
      quantity: parseInt(stockMovement.quantity),
      date: new Date(),
      reason: stockMovement.reason,
      staffId: "current-user" // This would come from auth context
    };

    setStockMovements(prev => [...prev, movement]);

    // Update stock levels
    setConsumables(prev => prev.map(item => {
      if (item.id === stockMovement.itemId) {
        const newStock = stockMovement.type === "in" 
          ? item.currentStock + parseInt(stockMovement.quantity)
          : item.currentStock - parseInt(stockMovement.quantity);
        return { ...item, currentStock: Math.max(0, newStock) };
      }
      return item;
    }));

    setStockMovement({ itemId: "", type: "in", quantity: "", reason: "" });
    setIsStockMovementOpen(false);
    toast.success("Stock movement recorded!");
  };

  const lowStockItems = consumables.filter(item => item.currentStock <= item.reorderLevel);

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <Badge variant="destructive">
                    {item.currentStock} {item.unit} remaining
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchasing & Inventory</h2>
        <div className="flex gap-2">
          <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Building className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person *</Label>
                    <Input
                      value={newVendor.contactPerson}
                      onChange={(e) => setNewVendor({...newVendor, contactPerson: e.target.value})}
                      placeholder="Contact person"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newVendor.email}
                      onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                      placeholder="email@vendor.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                    placeholder="Full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newVendor.category} onValueChange={(value) => setNewVendor({...newVendor, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning-supplies">Cleaning Supplies</SelectItem>
                      <SelectItem value="packaging">Packaging Materials</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsVendorDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddVendor} className="flex-1">
                    Add Vendor
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isConsumableDialogOpen} onOpenChange={setIsConsumableDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Consumable Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name *</Label>
                    <Input
                      value={newConsumable.name}
                      onChange={(e) => setNewConsumable({...newConsumable, name: e.target.value})}
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={newConsumable.category}
                      onChange={(e) => setNewConsumable({...newConsumable, category: e.target.value})}
                      placeholder="Category"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Stock *</Label>
                    <Input
                      type="number"
                      value={newConsumable.currentStock}
                      onChange={(e) => setNewConsumable({...newConsumable, currentStock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reorder Level</Label>
                    <Input
                      type="number"
                      value={newConsumable.reorderLevel}
                      onChange={(e) => setNewConsumable({...newConsumable, reorderLevel: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={newConsumable.unit} onValueChange={(value) => setNewConsumable({...newConsumable, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="boxes">Boxes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cost per Unit</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newConsumable.costPerUnit}
                      onChange={(e) => setNewConsumable({...newConsumable, costPerUnit: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Input
                    value={newConsumable.supplier}
                    onChange={(e) => setNewConsumable({...newConsumable, supplier: e.target.value})}
                    placeholder="Supplier name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsConsumableDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddConsumable} className="flex-1">
                    Add Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isStockMovementOpen} onOpenChange={setIsStockMovementOpen}>
            <DialogTrigger asChild>
              <Button>
                <TrendingDown className="h-4 w-4 mr-2" />
                Record Stock Movement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Item</Label>
                  <Select value={stockMovement.itemId} onValueChange={(value) => setStockMovement({...stockMovement, itemId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {consumables.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} (Current: {item.currentStock} {item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={stockMovement.type} onValueChange={(value: "in" | "out") => setStockMovement({...stockMovement, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Stock In</SelectItem>
                        <SelectItem value="out">Stock Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={stockMovement.quantity}
                      onChange={(e) => setStockMovement({...stockMovement, quantity: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Input
                    value={stockMovement.reason}
                    onChange={(e) => setStockMovement({...stockMovement, reason: e.target.value})}
                    placeholder="Reason for stock movement"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsStockMovementOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleStockMovement} className="flex-1">
                    Record Movement
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Consumable Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Consumable Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consumables.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{item.name}</h3>
                  <Badge variant={item.currentStock <= item.reorderLevel ? "destructive" : "outline"}>
                    {item.category}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Stock:</span>
                    <span className="font-medium">
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reorder Level:</span>
                    <span>{item.reorderLevel} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Unit:</span>
                    <span>${item.costPerUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier:</span>
                    <span>{item.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Restock:</span>
                    <span>{item.lastRestockDate.toLocaleDateString()}</span>
                  </div>
                </div>
                {item.currentStock <= item.reorderLevel && (
                  <Badge variant="destructive" className="w-full justify-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Reorder Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendors */}
      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{vendor.name}</h3>
                  <Badge variant="outline">{vendor.category}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <p><strong>Contact:</strong> {vendor.contactPerson}</p>
                  <p><strong>Email:</strong> {vendor.email}</p>
                  <p><strong>Phone:</strong> {vendor.phone}</p>
                  <p><strong>Address:</strong> {vendor.address}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
