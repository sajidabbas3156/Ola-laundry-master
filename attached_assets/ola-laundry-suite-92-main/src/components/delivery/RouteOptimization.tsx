
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Route, 
  MapPin, 
  Clock, 
  Fuel, 
  TrendingUp, 
  Settings,
  Play,
  RefreshCw
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";

export function RouteOptimization() {
  const { currentTenant } = useTenant();
  const { 
    routes, 
    drivers, 
    orders, 
    getDriversByTenant,
    getOrdersByTenant,
    optimizeRoute 
  } = useData();

  const [optimizationSettings, setOptimizationSettings] = useState({
    prioritizeDistance: true,
    prioritizeTime: false,
    considerTraffic: true,
    maxStopsPerRoute: 8,
    workingHours: { start: "09:00", end: "18:00" }
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  const tenantDrivers = currentTenant?.id ? getDriversByTenant(currentTenant.id) : [];
  const tenantOrders = currentTenant?.id ? getOrdersByTenant(currentTenant.id) : [];
  const pendingOrders = tenantOrders.filter(order => order.status === "pending");
  const availableDrivers = tenantDrivers.filter(driver => driver.status === "available");

  const handleBulkOptimization = async () => {
    if (pendingOrders.length === 0 || availableDrivers.length === 0) {
      toast.error("No pending orders or available drivers");
      return;
    }

    setIsOptimizing(true);
    try {
      // Simulate AI-powered route optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Distribute orders among available drivers
      const ordersPerDriver = Math.ceil(pendingOrders.length / availableDrivers.length);
      
      for (let i = 0; i < availableDrivers.length; i++) {
        const driver = availableDrivers[i];
        const startIndex = i * ordersPerDriver;
        const endIndex = Math.min(startIndex + ordersPerDriver, pendingOrders.length);
        const driverOrders = pendingOrders.slice(startIndex, endIndex);
        
        if (driverOrders.length > 0) {
          const orderIds = driverOrders.map(o => o.id);
          // This would call the existing optimizeRoute function
          optimizeRoute(driver.id);
        }
      }
      
      toast.success(`Optimized routes for ${availableDrivers.length} drivers`);
    } catch (error) {
      toast.error("Failed to optimize routes");
    } finally {
      setIsOptimizing(false);
    }
  };

  const calculateOptimizationMetrics = () => {
    const totalDistance = routes.reduce((sum, route) => sum + (route.estimatedTime * 0.5), 0); // Approximation
    const totalTime = routes.reduce((sum, route) => sum + route.estimatedTime, 0);
    const fuelSavings = totalDistance * 0.1; // Estimated fuel savings
    
    return {
      totalDistance: Math.round(totalDistance),
      totalTime: Math.round(totalTime),
      fuelSavings: Math.round(fuelSavings),
      routesOptimized: routes.length
    };
  };

  const metrics = calculateOptimizationMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Route Optimization
        </h2>
        <Button 
          onClick={handleBulkOptimization}
          disabled={isOptimizing || pendingOrders.length === 0}
          className="flex items-center gap-2"
        >
          {isOptimizing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isOptimizing ? "Optimizing..." : "Optimize All Routes"}
        </Button>
      </div>

      {/* Optimization Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalDistance} km</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-green-600">{metrics.totalTime} min</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fuel Savings</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.fuelSavings} L</p>
              </div>
              <Fuel className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Routes</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.routesOptimized}</p>
              </div>
              <Route className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Optimization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="prioritize-distance">Prioritize Distance</Label>
                <Switch
                  id="prioritize-distance"
                  checked={optimizationSettings.prioritizeDistance}
                  onCheckedChange={(checked) => 
                    setOptimizationSettings(prev => ({ ...prev, prioritizeDistance: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="prioritize-time">Prioritize Time</Label>
                <Switch
                  id="prioritize-time"
                  checked={optimizationSettings.prioritizeTime}
                  onCheckedChange={(checked) => 
                    setOptimizationSettings(prev => ({ ...prev, prioritizeTime: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="consider-traffic">Consider Traffic</Label>
                <Switch
                  id="consider-traffic"
                  checked={optimizationSettings.considerTraffic}
                  onCheckedChange={(checked) => 
                    setOptimizationSettings(prev => ({ ...prev, considerTraffic: checked }))
                  }
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="max-stops">Max Stops per Route</Label>
                <Input
                  id="max-stops"
                  type="number"
                  value={optimizationSettings.maxStopsPerRoute}
                  onChange={(e) => 
                    setOptimizationSettings(prev => ({ 
                      ...prev, 
                      maxStopsPerRoute: parseInt(e.target.value) 
                    }))
                  }
                  min="1"
                  max="20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={optimizationSettings.workingHours.start}
                    onChange={(e) => 
                      setOptimizationSettings(prev => ({ 
                        ...prev, 
                        workingHours: { ...prev.workingHours, start: e.target.value }
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={optimizationSettings.workingHours.end}
                    onChange={(e) => 
                      setOptimizationSettings(prev => ({ 
                        ...prev, 
                        workingHours: { ...prev.workingHours, end: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pendingOrders.length}</div>
              <div className="text-sm text-blue-800">Pending Orders</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{availableDrivers.length}</div>
              <div className="text-sm text-green-800">Available Drivers</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{routes.length}</div>
              <div className="text-sm text-orange-800">Active Routes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
