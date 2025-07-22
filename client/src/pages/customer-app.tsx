import { useState } from "react";
import { MobileFrame } from "@/components/mobile/mobile-frame";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useOrders } from "@/hooks/use-orders";
import { Home, Package, Bell, User, Calendar, Star } from "lucide-react";

const navigationItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Package, label: "Orders", active: false },
  { icon: Bell, label: "Notifications", active: false },
  { icon: User, label: "Profile", active: false },
];

const services = [
  {
    emoji: "🧺",
    name: "Wash & Fold",
    price: "From $2.50/lb",
    color: "bg-blue-50 border-blue-200"
  },
  {
    emoji: "👔",
    name: "Dry Cleaning",
    price: "From $8.00",
    color: "bg-purple-50 border-purple-200"
  }
];

export default function CustomerApp() {
  const { orders, isLoading } = useOrders();
  const [activeTab, setActiveTab] = useState("home");

  // Mock customer data
  const customer = {
    firstName: "Sarah",
    lastName: "Johnson",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=100&h=100&fit=crop&crop=face"
  };

  const recentOrders = orders.slice(0, 2);

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Mobile Application</h2>
        <p className="text-gray-600">Order placement, tracking, and account management for customers</p>
      </div>
      
      <MobileFrame>
        {/* Customer App Header */}
        <div className="bg-white border-b px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Hi, {customer.firstName}! 👋
              </h1>
              <p className="text-sm text-gray-600">Ready for fresh, clean clothes?</p>
            </div>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
              <img 
                src={customer.profileImage} 
                alt={`Profile photo of ${customer.firstName}`}
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 flex-1 overflow-y-auto pb-20">
          {/* Schedule Pickup Card */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-6">
            <h3 className="text-lg font-semibold mb-2">Schedule a Pickup</h3>
            <p className="text-sm text-blue-100 mb-3">Free pickup and delivery within 24 hours</p>
            <Button className="bg-white text-primary px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Now
            </Button>
          </div>

          {/* Quick Services */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Services</h3>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service, index) => (
                <Card key={index} className={`${service.color} border-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{service.emoji}</div>
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500">{service.price}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
              <Button variant="ghost" size="sm" className="text-primary text-sm h-auto p-1">
                View All
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-20"></div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No orders yet</p>
                  <p className="text-xs text-gray-400">Place your first order to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">Order {order.orderNumber}</div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <Badge 
                          className={
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {order.status === 'processing' ? 'In Progress' : 
                           order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {order.status === 'delivered' ? 'Delivered' : 
                           order.estimatedCompletion ? 
                           `Expected: ${new Date(order.estimatedCompletion).toLocaleDateString()}` :
                           'Processing'}
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary text-sm font-medium h-auto p-1">
                          {order.status === 'delivered' ? 'Reorder' : 'Track'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Loyalty Points */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-purple-600 mr-2" />
                  <div>
                    <div className="font-medium text-purple-900">Loyalty Points</div>
                    <div className="text-sm text-purple-700">Earn points with every order</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-900">250</div>
                  <div className="text-xs text-purple-700">points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t">
          <div className="grid grid-cols-4 py-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.label.toLowerCase())}
                  className={`flex flex-col items-center py-2 ${
                    item.active ? 'text-primary' : 'text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </MobileFrame>
    </div>
  );
}
