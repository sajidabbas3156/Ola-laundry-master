
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Route, Play, Pause, CheckCircle } from "lucide-react";
import { useData, DeliveryRoute } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";

export function RouteTracking() {
  const { currentTenant } = useTenant();
  const { 
    routes, 
    drivers, 
    orders, 
    updateRoute, 
    getDriversByTenant,
    getOrdersByTenant 
  } = useData();

  const tenantDrivers = currentTenant?.id ? getDriversByTenant(currentTenant.id) : [];
  const tenantOrders = currentTenant?.id ? getOrdersByTenant(currentTenant.id) : [];
  const activeRoutes = routes.filter(route => 
    tenantDrivers.some(driver => driver.id === route.driverId)
  );

  const handleStartRoute = (routeId: string) => {
    updateRoute(routeId, {
      status: "in-progress",
      startTime: new Date()
    });
    toast.success("Route started!");
  };

  const handleCompleteRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (route?.startTime) {
      const actualTime = Math.floor((Date.now() - route.startTime.getTime()) / (1000 * 60));
      updateRoute(routeId, {
        status: "completed",
        endTime: new Date(),
        actualTime
      });
      
      // Update driver status to available
      const driver = tenantDrivers.find(d => d.id === route.driverId);
      if (driver) {
        // This would update driver status - simplified for demo
        toast.success(`Route completed in ${actualTime} minutes!`);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDriverName = (driverId: string) => {
    const driver = tenantDrivers.find(d => d.id === driverId);
    return driver?.name || "Unknown Driver";
  };

  const getOrderDetails = (orderId: string) => {
    const order = tenantOrders.find(o => o.id === orderId);
    return order ? `${order.customerName} - #${order.id.slice(-4)}` : "Unknown Order";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Route className="h-6 w-6" />
          Route Tracking
        </h2>
      </div>

      {activeRoutes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No active routes</p>
            <p className="text-sm text-gray-500">
              Assign orders to drivers and optimize routes to see tracking information
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {activeRoutes.map((route) => (
            <Card key={route.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Route #{route.id.slice(-6)}
                  </CardTitle>
                  <Badge className={getStatusColor(route.status)}>
                    {route.status.replace("-", " ")}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Driver</h4>
                    <p className="text-sm text-gray-600">
                      {getDriverName(route.driverId)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Estimated Time</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{route.estimatedTime} minutes</span>
                    </div>
                    {route.actualTime && (
                      <div className="text-sm text-gray-500 mt-1">
                        Actual: {route.actualTime} minutes
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Orders</h4>
                    <Badge variant="outline">
                      {route.orders.length} deliveries
                    </Badge>
                  </div>
                </div>

                {/* Route Orders */}
                <div>
                  <h4 className="font-medium mb-3">Delivery Stops</h4>
                  <div className="space-y-2">
                    {route.optimizedRoute.map((stop, index) => (
                      <div key={stop.orderId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {getOrderDetails(stop.orderId)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {stop.address}
                          </div>
                        </div>
                        {route.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Tracking */}
                {route.startTime && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Route Started</p>
                        <p className="text-sm text-gray-600">
                          {route.startTime.toLocaleTimeString()}
                        </p>
                      </div>
                      {route.endTime && (
                        <div className="text-right">
                          <p className="text-sm font-medium">Completed</p>
                          <p className="text-sm text-gray-600">
                            {route.endTime.toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Route Actions */}
                <div className="flex gap-2 pt-2">
                  {route.status === "pending" && (
                    <Button
                      onClick={() => handleStartRoute(route.id)}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start Route
                    </Button>
                  )}
                  
                  {route.status === "in-progress" && (
                    <Button
                      onClick={() => handleCompleteRoute(route.id)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Complete
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
