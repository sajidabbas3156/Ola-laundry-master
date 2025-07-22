import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle,
  Phone,
  User,
  Route,
  Battery,
  Signal,
  Play,
  Pause,
  Square
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";
import { OrderStatus } from "@/lib/mockData";
import { MobileAppShell } from "./MobileAppShell";
import { toast } from "@/components/ui/sonner";

export function DeliveryDriverApp() {
  const { currentTenant } = useTenant();
  const { 
    getDriversByTenant, 
    getOrdersByTenant, 
    updateOrderStatus,
    optimizeRoute 
  } = useData();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentLocation, setCurrentLocation] = useState({
    lat: 26.2235,
    lng: 50.5813,
    speed: 0,
    heading: 0
  });
  const [isOnline, setIsOnline] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);

  // Mock current driver - in real app this would come from auth
  const currentDriverId = "driver-1";
  const drivers = currentTenant ? getDriversByTenant(currentTenant.id) : [];
  const currentDriver = drivers.find(d => d.id === currentDriverId);
  const orders = currentTenant ? getOrdersByTenant(currentTenant.id) : [];
  const assignedOrders = orders.filter(o => 
    currentDriver?.assignedOrders.includes(o.id) && o.status !== 'delivered'
  );

  // Simulate location updates
  useEffect(() => {
    if (isOnline) {
      const interval = setInterval(() => {
        setCurrentLocation(prev => ({
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001,
          speed: Math.random() * 50,
          heading: Math.random() * 360
        }));
        setBatteryLevel(prev => Math.max(20, prev - 0.1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline]);

  const handleToggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast.success(isOnline ? "You're now offline" : "You're now online and ready for deliveries!");
  };

  const handleStartDelivery = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.PROCESSING);
    toast.success("Delivery started! Navigate to customer location.");
  };

  const handleCompleteDelivery = (orderId: string) => {
    updateOrderStatus(orderId, OrderStatus.DELIVERED);
    toast.success("Delivery completed successfully!");
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Order #{order.id.slice(-6)}</h3>
          <Badge variant={
            order.status === 'pending' ? 'secondary' :
            order.status === 'processing' ? 'default' : 'outline'
          }>
            {order.status}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{order.customerPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{order.deliveryAddress || "Pickup at store"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{order.pickupTime || "ASAP"}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded p-3 mb-4">
          <h4 className="font-medium text-sm mb-2">Items ({order.items.length})</h4>
          {order.items.slice(0, 2).map((item: any, index: number) => (
            <div key={index} className="text-sm text-gray-600">
              {item.quantity}x {item.name}
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-sm text-gray-500">
              +{order.items.length - 2} more items
            </div>
          )}
          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {order.status === 'pending' && (
            <Button 
              className="flex-1" 
              onClick={() => handleStartDelivery(order.id)}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Delivery
            </Button>
          )}
          {order.status === 'processing' && (
            <>
              <Button variant="outline" className="flex-1">
                <Navigation className="h-4 w-4 mr-2" />
                Navigate
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => handleCompleteDelivery(order.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </>
          )}
          <Button variant="outline" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MobileAppShell hasBottomNav className="bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="pt-safe">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Driver Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {currentDriver?.name || "Driver"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm">
                <Battery className={`h-4 w-4 ${batteryLevel > 50 ? 'text-green-600' : batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'}`} />
                <span>{Math.round(batteryLevel)}%</span>
              </div>
              <Signal className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          {/* Online/Offline Toggle */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-medium">
                {isOnline ? 'Online & Available' : 'Offline'}
              </span>
            </div>
            <Button 
              variant={isOnline ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleOnlineStatus}
            >
              {isOnline ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="dashboard" className="p-4 space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {assignedOrders.length}
                      </div>
                      <div className="text-sm text-gray-600">Active Orders</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(currentLocation.speed)}
                      </div>
                      <div className="text-sm text-gray-600">Speed (km/h)</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Current Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>Lat: {currentLocation.lat.toFixed(6)}</div>
                      <div>Lng: {currentLocation.lng.toFixed(6)}</div>
                      <div>Heading: {Math.round(currentLocation.heading)}°</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col gap-1"
                    onClick={() => optimizeRoute(currentDriverId)}
                  >
                    <Route className="h-5 w-5" />
                    <span className="text-xs">Optimize Route</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col gap-1"
                    onClick={() => setActiveTab("orders")}
                  >
                    <Truck className="h-5 w-5" />
                    <span className="text-xs">View Orders</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="p-4 space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  My Deliveries
                </h2>
                
                {assignedOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-2">No deliveries assigned</p>
                      <p className="text-sm text-gray-400">
                        {isOnline ? "Waiting for new orders..." : "Go online to receive orders"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  assignedOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="navigation" className="p-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">GPS Navigation</p>
                    <p className="text-sm text-gray-500">
                      Navigation map integration would be displayed here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="p-4 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Driver Profile
                </h2>
                
                {currentDriver && (
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="mt-1">{currentDriver.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="mt-1">{currentDriver.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="mt-1">{currentDriver.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Vehicle</label>
                        <p className="mt-1 capitalize">
                          {currentDriver.vehicleInfo.type} - {currentDriver.vehicleInfo.plate}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Badge className="ml-2" variant={
                          currentDriver.status === 'available' ? 'default' :
                          currentDriver.status === 'busy' ? 'secondary' : 'destructive'
                        }>
                          {currentDriver.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>

            {/* Bottom Navigation */}
            <TabsList className="grid w-full grid-cols-4 h-16 bg-white border-t">
              <TabsTrigger value="dashboard" className="flex flex-col gap-1 py-2">
                <Truck className="h-5 w-5" />
                <span className="text-xs">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex flex-col gap-1 py-2">
                <MapPin className="h-5 w-5" />
                <span className="text-xs">Deliveries</span>
              </TabsTrigger>
              <TabsTrigger value="navigation" className="flex flex-col gap-1 py-2">
                <Navigation className="h-5 w-5" />
                <span className="text-xs">Navigate</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex flex-col gap-1 py-2">
                <User className="h-5 w-5" />
                <span className="text-xs">Profile</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </MobileAppShell>
  );
}