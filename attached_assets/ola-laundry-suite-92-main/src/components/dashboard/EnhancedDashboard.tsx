import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { useData } from "@/contexts/DataContext";
import { OrderStatusTimeline } from "@/components/orders/OrderStatusTimeline";
import { DashboardStats } from "./DashboardStats";
import { RecentOrders } from "./RecentOrders";
import { QuickStats } from "./QuickStats";
import { 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Clock,
  Package,
  Truck,
  Calendar,
  Plus
} from "lucide-react";
import { TenantProfileCard } from "@/components/tenant/TenantProfileCard";

export function EnhancedDashboard() {
  const { currentTenant } = useTenant();
  const { getOrdersByTenant } = useData();
  
  const orders = currentTenant?.id ? getOrdersByTenant(currentTenant.id) : [];
  const recentOrders = orders.slice(0, 5);
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your laundry business.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date().toLocaleDateString()}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Tenant Profile Card */}
      <TenantProfileCard />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Processing</p>
                <p className="text-2xl font-bold">{processingOrders.length}</p>
              </div>
              <Package className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Ready</p>
                <p className="text-2xl font-bold">{readyOrders.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{pendingOrders.length}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Timeline */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-gray-900">Order Flow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusTimeline orders={orders} />
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900">Recent Orders</CardTitle>
            <Button variant="outline" size="sm" className="rounded-full">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RecentOrders orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
