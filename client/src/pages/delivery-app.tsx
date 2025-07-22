import { useState } from "react";
import { MobileFrame } from "@/components/mobile/mobile-frame";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { RouteWithDetails } from "@shared/schema";
import { Navigation, Phone, Pause, AlertTriangle, CheckCircle } from "lucide-react";

export default function DeliveryApp() {
  const [isOnline, setIsOnline] = useState(true);

  const { data: routes = [] } = useQuery<RouteWithDetails[]>({
    queryKey: ["/api/delivery/routes"],
  });

  // Mock data for demonstration
  const driver = {
    name: "Mike Chen",
    completedDeliveries: 12,
    remainingDeliveries: 3,
    todayEarnings: 180
  };

  const currentRoute = routes[0] || {
    id: 1,
    totalDistance: 8.5,
    estimatedDuration: 45,
    stops: [
      {
        id: 1,
        type: "pickup",
        order: {
          orderNumber: "LP2024-003",
          customer: {
            user: { firstName: "Emma", lastName: "Wilson" }
          }
        },
        address: "142 Oak Street, Apartment 3B",
        status: "pending"
      },
      {
        id: 2,
        type: "delivery",
        order: {
          orderNumber: "LP2024-004",
          customer: {
            user: { firstName: "John", lastName: "Smith" }
          }
        },
        address: "789 Pine Ave",
        status: "pending"
      },
      {
        id: 3,
        type: "pickup",
        order: {
          orderNumber: "LP2024-005",
          customer: {
            user: { firstName: "Lisa", lastName: "Garcia" }
          }
        },
        address: "456 Elm St",
        status: "pending"
      }
    ]
  };

  const nextStop = currentRoute?.stops?.find(stop => stop.status === "pending");
  const upcomingStops = currentRoute?.stops?.filter(stop => stop.status === "pending" && stop.id !== nextStop?.id) || [];

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Driver Application</h2>
        <p className="text-gray-600">Route optimization, order management, and GPS tracking for drivers</p>
      </div>
      
      <MobileFrame>
        {/* Driver App Header */}
        <div className="bg-primary text-white px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">LaundryPro Driver</h1>
              <p className="text-sm text-blue-100">Good morning, {driver.name}!</p>
            </div>
            <div className="text-right flex items-center">
              <div className="mr-2">
                <div className="text-sm">{isOnline ? 'Online' : 'Offline'}</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            </div>
          </div>
          
          {/* Daily Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-300">
            <div className="text-center">
              <div className="text-xl font-bold">{driver.completedDeliveries}</div>
              <div className="text-xs text-blue-100">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{driver.remainingDeliveries}</div>
              <div className="text-xs text-blue-100">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">${driver.todayEarnings}</div>
              <div className="text-xs text-blue-100">Earnings</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 flex-1 overflow-y-auto pb-20">
          {/* Current Route Summary */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white mb-4">
            <h3 className="font-semibold mb-1">Current Route</h3>
            <p className="text-sm text-green-100">
              {currentRoute?.stops?.length || 0} stops • {currentRoute?.totalDistance || 0} miles • {currentRoute?.estimatedDuration || 0} min estimated
            </p>
          </div>

          {/* Route Map Placeholder */}
          <div className="bg-gray-200 rounded-xl h-40 mb-4 flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=200&fit=crop" 
              alt="GPS map showing delivery route with location markers" 
              className="w-full h-full object-cover rounded-xl" 
            />
          </div>

          {/* Next Delivery */}
          {nextStop && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Next Stop</h3>
              <Card className="border-2 border-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold">
                        {nextStop.order?.customer?.user?.firstName} {nextStop.order?.customer?.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-600">Order {nextStop.order?.orderNumber}</div>
                      <div className="text-sm text-gray-500">Express Wash • 4 items</div>
                    </div>
                    <Badge className={
                      nextStop.type === 'pickup' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }>
                      {nextStop.type === 'pickup' ? 'Pickup' : 'Delivery'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {nextStop.address}
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-primary text-white hover:bg-blue-700">
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                    <Button variant="outline" size="sm" className="px-4 border-primary text-primary">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upcoming Stops */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Upcoming Stops</h3>
            {upcomingStops.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">All stops completed!</p>
                  <p className="text-xs text-gray-400">Great job today</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {upcomingStops.map((stop, index) => (
                  <Card key={stop.id} className="border">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">
                            {stop.order?.customer?.user?.firstName} {stop.order?.customer?.user?.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {stop.address} • {stop.type === 'pickup' ? 'Pickup' : 'Delivery'}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {(2.1 + index * 1.7).toFixed(1)} mi
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant={isOnline ? "destructive" : "default"}
              className="py-3 font-medium"
              onClick={() => setIsOnline(!isOnline)}
            >
              <Pause className="w-4 h-4 mr-2" />
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
            <Button variant="outline" className="py-3 font-medium text-orange-600 border-orange-600 hover:bg-orange-50">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </div>
      </MobileFrame>
    </div>
  );
}
