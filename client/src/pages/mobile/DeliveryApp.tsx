import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useDrivers } from "@/contexts/DriversContext";
import { useData } from "@/contexts/DataContext";
import {
  MapPin,
  Navigation,
  User,
  Truck,
  Clock,
  Phone,
  Package,
  CheckCircle,
  Battery,
  Signal,
  Zap
} from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";
import { LaundrySpinner, InlineLoader } from "@/components/ui/laundry-spinner";

export default function DeliveryApp() {
  const { drivers, updateDriverStatus } = useDrivers();
  const { orders } = useData();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOnline, setIsOnline] = useState(true);
  
  // Mock driver data for demo
  const currentDriver = drivers[0] || {
    id: 1,
    name: "Ahmed Al-Khalifa",
    status: 'online',
    currentLocation: { latitude: 26.2285, longitude: 50.5860 },
    assignedOrders: []
  };

  const handleStatusToggle = (online: boolean) => {
    setIsOnline(online);
    updateDriverStatus(currentDriver.id, online ? 'online' : 'offline');
  };

  // Mock delivery orders
  const deliveryOrders = [
    {
      id: 1,
      customerName: "Sara Ahmed",
      address: "Building 123, Road 456, Block 789, Manama",
      phone: "+973-3311-5678",
      items: 3,
      amount: "22.50 BHD",
      type: "pickup",
      status: "pending",
      distance: "2.3 km"
    },
    {
      id: 2,
      customerName: "Mohammed Hassan",
      address: "Villa 45, Diplomatic Area, Manama",
      phone: "+973-3322-9012",
      items: 2,
      amount: "27.00 BHD",
      type: "delivery",
      status: "ready",
      distance: "3.7 km"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900">Driver App</span>
              <p className="text-xs text-gray-600">Hi, {currentDriver.name}!</p>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-3">
            <PWAInstallButton variant="button" size="sm" />
            <div className="flex items-center space-x-1">
              <Battery className="h-4 w-4 text-green-600" />
              <span className="text-xs text-gray-600">87%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Signal className="h-4 w-4 text-green-600" />
              <span className="text-xs text-gray-600">4G</span>
            </div>
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard" className="mt-0 p-4 space-y-4">
            {/* Online Status Toggle */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Driver Status</h3>
                    <p className="text-sm text-gray-600">
                      {isOnline ? "Available for deliveries" : "Not accepting orders"}
                    </p>
                  </div>
                  <Switch checked={isOnline} onCheckedChange={handleStatusToggle} />
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <p className="text-sm text-gray-600">Today's Deliveries</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">127.50</div>
                  <p className="text-sm text-gray-600">Today's Earnings (BHD)</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <MapPin className="mr-2 h-4 w-4" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Manama City Center</p>
                    <p className="text-xs text-gray-600">Speed: 0 km/h • GPS: Strong</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Navigation className="mr-2 h-4 w-4" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliveries" className="mt-0 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Assigned Deliveries</h2>
              <Badge variant="outline">{deliveryOrders.length} orders</Badge>
            </div>
            
            {deliveryOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={order.type === 'pickup' ? 'secondary' : 'default'}>
                          {order.type}
                        </Badge>
                        <Badge variant={order.status === 'ready' ? 'default' : 'outline'}>
                          {order.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium">{order.customerName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{order.address}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Package className="mr-1 h-3 w-3" />
                          {order.items} items
                        </span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {order.distance}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{order.amount}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="mr-2 h-4 w-4" />
                      Navigate
                    </Button>
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="navigate" className="mt-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="mr-2 h-5 w-5" />
                  Route Optimization
                </CardTitle>
                <CardDescription>
                  Optimized route for today's deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Total Route Distance</p>
                      <p className="text-sm text-gray-600">Estimated time: 2h 15min</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">15.7 km</p>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Navigation className="mr-2 h-4 w-4" />
                    Start Navigation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Driver Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{currentDriver.name}</p>
                    <p className="text-sm text-gray-600">Driver ID: #D{currentDriver.id.toString().padStart(3, '0')}</p>
                  </div>
                </div>
                
                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">4.9</div>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">156</div>
                    <p className="text-xs text-gray-600">Total Deliveries</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View Full Statistics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around items-center py-2">
          {[
            { key: "dashboard", icon: Zap, label: "Dashboard" },
            { key: "deliveries", icon: Package, label: "Deliveries" },
            { key: "navigate", icon: Navigation, label: "Navigate" },
            { key: "profile", icon: User, label: "Profile" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600"
              }`}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}