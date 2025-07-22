
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Truck, MapPin, Clock, Route, User, Phone } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";

export function DeliveryDriverManagement() {
  const { currentTenant } = useTenant();
  const { 
    getDriversByTenant, 
    getOrdersByTenant, 
    assignOrdersToDriver, 
    optimizeRoute 
  } = useData();

  const drivers = currentTenant?.id ? getDriversByTenant(currentTenant.id) : [];
  const orders = currentTenant?.id ? getOrdersByTenant(currentTenant.id) : [];
  const pendingOrders = orders.filter(order => order.status === "pending");

  const handleAssignOrder = (orderId: string, driverId: string) => {
    assignOrdersToDriver(driverId, [orderId]);
  };

  const handleOptimizeRoute = (driverId: string) => {
    optimizeRoute(driverId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Truck className="h-8 w-8" />
          Delivery Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drivers Section */}
        <Card>
          <CardHeader>
            <CardTitle>Drivers ({drivers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No drivers added yet</p>
                  <p className="text-sm">Use the Driver Management tab to add drivers</p>
                </div>
              ) : (
                drivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {driver.phone}
                        </p>
                      </div>
                      <Badge variant={
                        driver.status === "available" ? "default" :
                        driver.status === "busy" ? "secondary" : "destructive"
                      }>
                        {driver.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Vehicle:</span>
                        <p className="capitalize">{driver.vehicleInfo.type} - {driver.vehicleInfo.plate}</p>
                      </div>
                      <div>
                        <span className="font-medium">Orders:</span>
                        <p>{driver.assignedOrders.length} assigned</p>
                      </div>
                    </div>

                    {driver.currentLocation && (
                      <div className="mt-3 p-2 bg-gray-50 rounded flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm">{driver.currentLocation.address}</span>
                      </div>
                    )}

                    <div className="flex space-x-2 mt-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Route className="h-4 w-4 mr-1" />
                            View Route
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{driver.name} - Route Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-center p-4 bg-gray-50 rounded">
                              <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
                              <p className="text-sm">Interactive map would be displayed here</p>
                              <p className="text-xs text-muted-foreground">Showing optimized route for assigned orders</p>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium">Assigned Orders:</h4>
                              {driver.assignedOrders.length === 0 ? (
                                <p className="text-sm text-gray-500">No orders assigned</p>
                              ) : (
                                driver.assignedOrders.map(orderId => {
                                  const order = orders.find(o => o.id === orderId);
                                  return order ? (
                                    <div key={orderId} className="p-2 border rounded text-sm">
                                      <div className="flex justify-between">
                                        <span>{order.customerName}</span>
                                        <Badge variant="outline">#{order.id.slice(-4)}</Badge>
                                      </div>
                                      <p className="text-muted-foreground">Total: ${order.total}</p>
                                    </div>
                                  ) : null;
                                })
                              )}
                            </div>
                            
                            {driver.assignedOrders.length > 0 && (
                              <Button 
                                className="w-full" 
                                onClick={() => handleOptimizeRoute(driver.id)}
                              >
                                <Route className="h-4 w-4 mr-2" />
                                Optimize Route
                              </Button>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {driver.assignedOrders.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOptimizeRoute(driver.id)}
                        >
                          <Route className="h-4 w-4 mr-1" />
                          Optimize
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders ({pendingOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending orders</p>
                  <p className="text-sm">New orders will appear here for assignment</p>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{order.customerName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Order #{order.id.slice(-6)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        ${order.total.toFixed(2)}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Created: {order.createdAt.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Items: </span>
                        <span>{order.items.length} item(s)</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm font-medium">Assign to driver:</label>
                      <div className="flex space-x-2 mt-1">
                        {drivers.filter(d => d.status === "available").length === 0 ? (
                          <p className="text-sm text-gray-500">No available drivers</p>
                        ) : (
                          drivers.filter(d => d.status === "available").map(driver => (
                            <Button
                              key={driver.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssignOrder(order.id, driver.id)}
                            >
                              {driver.name}
                            </Button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
