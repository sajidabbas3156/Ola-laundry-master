
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, MapPin, Phone, User, Plus, Edit, Trash2, Route } from "lucide-react";
import { useData, Driver } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";

export function DriverManagement() {
  const { currentTenant } = useTenant();
  const { 
    drivers, 
    addDriver, 
    updateDriver, 
    removeDriver, 
    getDriversByTenant,
    assignOrdersToDriver,
    optimizeRoute,
    getOrdersByTenant
  } = useData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicleType: "",
    vehiclePlate: ""
  });

  const tenantDrivers = currentTenant?.id ? getDriversByTenant(currentTenant.id) : [];
  const tenantOrders = currentTenant?.id ? getOrdersByTenant(currentTenant.id) : [];
  const availableOrders = tenantOrders.filter(order => order.status === "pending");

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      vehicleType: "",
      vehiclePlate: ""
    });
    setEditingDriver(null);
  };

  const handleSubmit = () => {
    if (!currentTenant?.id) {
      toast.error("No tenant selected");
      return;
    }

    if (!formData.name || !formData.phone || !formData.vehicleType || !formData.vehiclePlate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const driverData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      status: "available" as const,
      assignedOrders: [],
      vehicleInfo: {
        type: formData.vehicleType,
        plate: formData.vehiclePlate
      },
      tenantId: currentTenant.id
    };

    if (editingDriver) {
      updateDriver(editingDriver.id, driverData);
    } else {
      addDriver(driverData);
    }

    setShowAddDialog(false);
    resetForm();
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      vehicleType: driver.vehicleInfo.type,
      vehiclePlate: driver.vehicleInfo.plate
    });
    setShowAddDialog(true);
  };

  const handleDelete = (driverId: string) => {
    if (confirm("Are you sure you want to remove this driver?")) {
      removeDriver(driverId);
    }
  };

  const handleAssignOrders = (driverId: string, orderIds: string[]) => {
    if (orderIds.length === 0) {
      toast.error("Please select orders to assign");
      return;
    }
    assignOrdersToDriver(driverId, orderIds);
  };

  const handleOptimizeRoute = (driverId: string) => {
    const route = optimizeRoute(driverId);
    if (!route) {
      toast.error("No orders assigned to optimize route");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-blue-100 text-blue-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6" />
          Driver Management
        </h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDriver ? "Edit Driver" : "Add New Driver"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter driver's full name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+973 1234 5678"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="driver@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                <Select 
                  value={formData.vehicleType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="vehiclePlate">License Plate *</Label>
                <Input
                  id="vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value }))}
                  placeholder="123456"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingDriver ? "Update Driver" : "Add Driver"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Drivers ({tenantDrivers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tenantDrivers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No drivers added yet</p>
              <p className="text-sm">Add your first driver to start managing deliveries</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{driver.name}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {driver.phone}
                          </div>
                          {driver.email && (
                            <div className="text-sm text-gray-500">
                              {driver.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium capitalize">{driver.vehicleInfo.type}</div>
                          <div className="text-gray-500">{driver.vehicleInfo.plate}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusColor(driver.status)}>
                          {driver.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {driver.assignedOrders.length > 0 ? (
                            <Badge variant="outline">
                              {driver.assignedOrders.length} orders
                            </Badge>
                          ) : (
                            <span className="text-gray-500">No orders</span>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(driver)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          
                          <Select onValueChange={(orderIds) => {
                            if (orderIds) {
                              handleAssignOrders(driver.id, [orderIds]);
                            }
                          }}>
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableOrders.map(order => (
                                <SelectItem key={order.id} value={order.id}>
                                  #{order.id.slice(-4)} - {order.customerName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {driver.assignedOrders.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOptimizeRoute(driver.id)}
                            >
                              <Route className="h-3 w-3" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(driver.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
