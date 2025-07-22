
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  AlertTriangle,
  Truck,
  Radio,
  Battery,
  Signal
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";

interface DriverLocation {
  driverId: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  lastUpdate: Date;
  batteryLevel: number;
  signalStrength: number;
}

export function RealTimeTracking() {
  const { currentTenant } = useTenant();
  const { 
    routes, 
    drivers, 
    getDriversByTenant 
  } = useData();

  const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>("");

  const tenantDrivers = currentTenant?.id ? getDriversByTenant(currentTenant.id) : [];
  const activeDrivers = tenantDrivers.filter(driver => driver.status === "busy");

  // Simulate real-time location updates
  useEffect(() => {
    const updateLocations = () => {
      const mockLocations: DriverLocation[] = activeDrivers.map(driver => ({
        driverId: driver.id,
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        speed: Math.random() * 60,
        heading: Math.random() * 360,
        lastUpdate: new Date(),
        batteryLevel: 70 + Math.random() * 30,
        signalStrength: 3 + Math.random() * 2
      }));
      setDriverLocations(mockLocations);
    };

    updateLocations();
    const interval = setInterval(updateLocations, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [activeDrivers]);

  const getDriverLocation = (driverId: string) => {
    return driverLocations.find(loc => loc.driverId === driverId);
  };

  const getDriverRoute = (driverId: string) => {
    return routes.find(route => route.driverId === driverId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  const getSignalIcon = (strength: number) => {
    if (strength >= 4) return <Signal className="h-4 w-4 text-green-600" />;
    if (strength >= 2) return <Signal className="h-4 w-4 text-yellow-600" />;
    return <Signal className="h-4 w-4 text-red-600" />;
  };

  const getBatteryColor = (level: number) => {
    if (level >= 50) return "text-green-600";
    if (level >= 20) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Radio className="h-6 w-6" />
          Real-Time Tracking
        </h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Updates
        </Badge>
      </div>

      {/* Driver Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeDrivers.map((driver) => {
          const location = getDriverLocation(driver.id);
          const route = getDriverRoute(driver.id);
          
          return (
            <Card key={driver.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {driver.name}
                  </CardTitle>
                  <Badge variant="secondary">{driver.status}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {location && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location
                      </span>
                      <span className="text-muted-foreground">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        Speed
                      </span>
                      <span className="font-medium">{Math.round(location.speed)} km/h</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last Update
                      </span>
                      <span className="text-muted-foreground">
                        {formatTime(location.lastUpdate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Battery className={`h-4 w-4 ${getBatteryColor(location.batteryLevel)}`} />
                        <span className="text-sm">{Math.round(location.batteryLevel)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getSignalIcon(location.signalStrength)}
                        <span className="text-sm">Signal</span>
                      </div>
                    </div>
                  </>
                )}
                
                {route && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span>Current Route:</span>
                      <Badge variant="outline">
                        {route.orders.length} stops
                      </Badge>
                    </div>
                  </div>
                )}
                
                {location && location.batteryLevel < 20 && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertTriangle className="h-3 w-3" />
                    Low battery warning
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeDrivers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No active drivers</p>
            <p className="text-sm text-gray-500">
              Drivers will appear here when they start their routes
            </p>
          </CardContent>
        </Card>
      )}

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Live Map View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Interactive map would be displayed here</p>
              <p className="text-sm text-gray-500 mt-1">
                Showing real-time driver locations and routes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
