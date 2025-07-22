import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  User, 
  ShoppingBag, 
  Star, 
  Wallet, 
  Bell,
  MapPin,
  Clock,
  Phone
} from "lucide-react";
import { EnhancedStorefrontMain } from "@/components/storefront/EnhancedStorefrontMain";
import { CustomerLoyaltyProgram } from "@/components/customers/CustomerLoyaltyProgram";
import { CustomerWalletSystem } from "@/components/customers/CustomerWalletSystem";
import { useCustomers } from "@/contexts/CustomerContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useTenant } from "@/contexts/TenantContext";
import { MobileAppShell } from "./MobileAppShell";

export function CustomerMobileApp() {
  const { currentTenant } = useTenant();
  const { getCustomersByTenant } = useCustomers();
  const { getOrdersByTenant } = useOrders();
  const [activeTab, setActiveTab] = useState("store");

  // Mock current customer - in real app this would come from auth
  const currentCustomerId = "customer-1";
  const customers = currentTenant ? getCustomersByTenant(currentTenant.id) : [];
  const currentCustomer = customers.find(c => c.id === currentCustomerId);
  const orders = currentTenant ? getOrdersByTenant(currentTenant.id) : [];
  const customerOrders = orders.filter(o => o.customerId === currentCustomerId);

  const OrderTrackingCard = ({ order }: { order: any }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Order #{order.id.slice(-6)}</h3>
          <Badge variant={
            order.status === 'pending' ? 'secondary' :
            order.status === 'processing' ? 'default' :
            order.status === 'delivered' ? 'outline' : 'destructive'
          }>
            {order.status}
          </Badge>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>{order.items.length} items - ${order.total.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{order.serviceType}</span>
          </div>
        </div>
        {order.status === 'processing' && (
          <Button size="sm" className="w-full mt-3">
            <Phone className="h-4 w-4 mr-2" />
            Contact Driver
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <MobileAppShell hasBottomNav className="bg-gradient-to-br from-blue-50 to-green-50">
      <div className="pt-safe">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {currentTenant?.name || "Laundry Service"}
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {currentCustomer?.name || "Customer"}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="store" className="h-full p-0 m-0">
                <EnhancedStorefrontMain />
              </TabsContent>

              <TabsContent value="orders" className="p-4 space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  My Orders
                </h2>
                {customerOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No orders yet</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setActiveTab("store")}
                      >
                        Start Shopping
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  customerOrders.map(order => (
                    <OrderTrackingCard key={order.id} order={order} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="loyalty" className="p-4">
                <CustomerLoyaltyProgram />
              </TabsContent>

              <TabsContent value="wallet" className="p-4">
                <CustomerWalletSystem />
              </TabsContent>

              <TabsContent value="account" className="p-4 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  My Account
                </h2>
                
                {currentCustomer && (
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="mt-1">{currentCustomer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="mt-1">{currentCustomer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="mt-1">{currentCustomer.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <p className="mt-1">{currentCustomer.address || "Not provided"}</p>
                      </div>
                      <Button className="w-full">Edit Profile</Button>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {customerOrders.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Orders</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {currentCustomer?.loyaltyPoints || 0}
                        </div>
                        <div className="text-sm text-gray-600">Loyalty Points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Bottom Navigation */}
            <TabsList className="grid w-full grid-cols-5 h-16 bg-white border-t">
              <TabsTrigger value="store" className="flex flex-col gap-1 py-2">
                <Store className="h-5 w-5" />
                <span className="text-xs">Store</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex flex-col gap-1 py-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="text-xs">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex flex-col gap-1 py-2">
                <Star className="h-5 w-5" />
                <span className="text-xs">Loyalty</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex flex-col gap-1 py-2">
                <Wallet className="h-5 w-5" />
                <span className="text-xs">Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex flex-col gap-1 py-2">
                <User className="h-5 w-5" />
                <span className="text-xs">Account</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </MobileAppShell>
  );
}