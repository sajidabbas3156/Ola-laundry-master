
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Package, MapPin, Clock, AlertCircle } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";

export function EnhancedDriverAssignment() {
  const { currentTenant } = useTenant();
  const { 
    drivers, 
    orders, 
    getDriversByTenant, 
    getOrdersByTenant, 
    assignOrdersToDriver,
    updateOrder
  } = useData();
  
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  const tenantDrivers = currentTenant ? getDriversByTenant(currentTenant.id) : [];
  const tenantOrders = currentTenant ? getOrdersByTenant(currentTenant.id) : [];
  
  // Get unassigned orders (not already assigned to any driver)
  const unassignedOrders = tenantOrders.filter(order => 
    order.status === "pending" && 
    !tenantDrivers.some(driver => driver.assignedOrders.includes(order.id))
  );
  
  // Get available drivers (not busy or have capacity)
  const availableDrivers = tenantDrivers.filter(driver => 
    driver.status === "available" || 
    (driver.status === "busy" && driver.assignedOrders.length < 5) // Max 5 orders per driver
  );

  const handleAssignOrders = () => {
    if (!selectedDriver || selectedOrders.length === 0) {
      toast.error("Please select a driver and at least one order");
      return;
    }

    const driver = tenantDrivers.find(d => d.id === selectedDriver);
    if (!driver) {
      toast.error("Driver not found");
      return;
    }

    // Check for overlaps - ensure orders aren't already assigned
    const alreadyAssigned = selectedOrders.filter(orderId => 
      tenantDrivers.some(d => d.assignedOrders.includes(orderId))
    );

    if (alreadyAssigned.length > 0) {
      toast.error(`Orders already assigned: ${alreadyAssigned.join(", ")}`);
      return;
    }

    // Assign orders to driver
    assignOrdersToDriver(selectedDriver, selectedOrders);
    
    // Update order status
    selectedOrders.forEach(orderId => {
      updateOrder(orderId, { status: "processing" as any });
    });

    toast.success(`Assigned ${selectedOrders.length} orders to ${driver.name}`);
    setSelectedOrders([]);
    setSelectedDriver("");
  };

  const getDriverWorkload = (driver: any) => {
    const assignedCount = driver.assignedOrders.length;
    const maxCapacity = 5;
    const percentage = (assignedCount / maxCapacity) * 100;
    
    return {
      count: assignedCount,
      max: maxCapacity,
      percentage,
      status: percentage >= 100 ? "full" : percentage >= 80 ? "high" : "normal"
    };
  };

  return (
    <div className="space-y-6">
      {/* Assignment Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Assign Orders to Drivers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Driver Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Driver</label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Choose available driver" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.map(driver => {
                  const workload = getDriverWorkload(driver);
                  return (
                    <SelectItem key={driver.id} value={driver.id}>
                      <div className="flex items-center gap-2">
                        <span>{driver.name}</span>
                        <Badge 
                          variant={workload.status === "full" ? "destructive" : 
                                  workload.status === "high" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {workload.count}/{workload.max}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Order Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Unassigned Orders ({unassignedOrders.length})
            </label>
            <div className="border rounded-lg max-h-40 overflow-y-auto">
              {unassignedOrders.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No unassigned orders available
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {unassignedOrders.map(order => (
                    <label key={order.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(prev => [...prev, order.id]);
                          } else {
                            setSelectedOrders(prev => prev.filter(id => id !== order.id));
                          }
                        }}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">#{order.id.slice(-6)}</div>
                        <div className="text-xs text-gray-500">{order.customerName}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        ${order.total.toFixed(2)}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={handleAssignOrders}
            disabled={!selectedDriver || selectedOrders.length === 0}
            className="w-full"
          >
            Assign {selectedOrders.length} Orders to Driver
          </Button>
        </CardContent>
      </Card>

      {/* Driver Status Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Driver Status & Assigned Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Workload</TableHead>
                <TableHead>Assigned Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantDrivers.map(driver => {
                const workload = getDriverWorkload(driver);
                const assignedOrders = tenantOrders.filter(order => 
                  driver.assignedOrders.includes(order.id)
                );
                
                return (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        driver.status === "available" ? "default" :
                        driver.status === "busy" ? "secondary" : "outline"
                      }>
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          workload.status === "full" ? "bg-red-500" :
                          workload.status === "high" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                        <span className="text-sm">{workload.count}/{workload.max}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignedOrders.length === 0 ? (
                        <span className="text-gray-400 text-sm">No orders</span>
                      ) : (
                        <div className="space-y-1">
                          {assignedOrders.slice(0, 2).map(order => (
                            <div key={order.id} className="text-xs bg-blue-50 px-2 py-1 rounded">
                              #{order.id.slice(-6)} - {order.customerName}
                            </div>
                          ))}
                          {assignedOrders.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{assignedOrders.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
