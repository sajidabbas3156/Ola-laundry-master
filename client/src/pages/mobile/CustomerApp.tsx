import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/contexts/DataContext";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  Store,
  Package,
  Gift,
  Wallet,
  User,
  Phone,
  MapPin,
  Clock,
  Star
} from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";

export default function CustomerApp() {
  const { orders } = useData();
  const { selectedCustomer } = useCustomer();
  const [activeTab, setActiveTab] = useState("store");

  // Mock customer data for demo
  const customer = selectedCustomer || {
    id: 1,
    loyaltyPoints: 250,
    walletBalance: 15.50,
    user: {
      firstName: "Sara",
      lastName: "Ahmed",
      email: "sara.ahmed@gmail.com",
      phone: "+973-3311-5678"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">OLA</span>
            </div>
            <span className="font-semibold text-gray-900">Laundry Master</span>
          </div>
          <div className="flex items-center space-x-2">
            <PWAInstallButton variant="button" size="sm" />
            <span className="text-sm text-gray-600">
              Hi, {customer.user?.firstName}!
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="store" className="mt-0 p-4 space-y-4">
            <div className="text-center py-8">
              <Store className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Welcome to Our Store</h2>
              <p className="text-gray-600 mb-6">Place your laundry order with just a few taps</p>
              <Button className="w-full max-w-sm">
                <Package className="mr-2 h-4 w-4" />
                Start New Order
              </Button>
            </div>

            {/* Quick Services */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Wash & Fold</h3>
                  <p className="text-sm text-gray-600">From 2.5 BHD/kg</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium">Dry Cleaning</h3>
                  <p className="text-sm text-gray-600">From 6 BHD/item</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0 p-4 space-y-4">
            <h2 className="text-xl font-bold mb-4">My Orders</h2>
            
            {orders.slice(0, 3).map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={order.status === 'ready' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{order.totalAmount} BHD</span>
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Driver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="loyalty" className="mt-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5" />
                  Loyalty Points
                </CardTitle>
                <CardDescription>
                  Earn points with every order and redeem for discounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {customer.loyaltyPoints}
                  </div>
                  <p className="text-gray-600">Available Points</p>
                  <Button className="mt-4">Redeem Rewards</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="mt-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Digital Wallet
                </CardTitle>
                <CardDescription>
                  Manage your account balance and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {customer.walletBalance?.toFixed(2)} BHD
                  </div>
                  <p className="text-gray-600">Current Balance</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">Add Funds</Button>
                    <Button variant="outline" className="flex-1">Payment History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {customer.user?.firstName} {customer.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{customer.user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{customer.user?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Manama, Bahrain</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Edit Profile
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
            { key: "store", icon: Store, label: "Store" },
            { key: "orders", icon: Package, label: "Orders" },
            { key: "loyalty", icon: Gift, label: "Loyalty" },
            { key: "wallet", icon: Wallet, label: "Wallet" },
            { key: "account", icon: User, label: "Account" },
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