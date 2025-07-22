import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/ui/stats-card";
import { OrderTable } from "@/components/ui/order-table";
import { MachineStatus } from "@/components/ui/machine-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/hooks/use-orders";
import { useWebSocket } from "@/hooks/use-websocket";
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Users, 
  Download, 
  Plus,
  PlusCircle,
  Barcode,
  UserPlus,
  BarChart3
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
  activeCustomers: number;
}

export default function AdminDashboard() {
  const { orders, isLoading: ordersLoading } = useOrders();
  const { isConnected } = useWebSocket();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: machines = [] } = useQuery({
    queryKey: ["/api/machines"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LaundryPro Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, Admin. Here's what's happening with your business today.
              {isConnected && (
                <span className="ml-2 inline-flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Live updates active
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline" className="inline-flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="inline-flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change={{ value: "12% from last month", type: "increase" }}
          icon={ShoppingBag}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Revenue"
          value={`$${(stats?.revenue || 0).toLocaleString()}`}
          change={{ value: "8% from last month", type: "increase" }}
          icon={DollarSign}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          change={{ value: "3% from yesterday", type: "decrease" }}
          icon={Clock}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatsCard
          title="Active Customers"
          value={stats?.activeCustomers || 0}
          change={{ value: "5% from last month", type: "increase" }}
          icon={Users}
          iconColor="bg-cyan-100 text-cyan-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          {ordersLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <OrderTable orders={orders.slice(0, 10)} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                  <PlusCircle className="w-4 h-4 mr-3" />
                  Create New Order
                </Button>
                <Button variant="outline" className="w-full justify-start bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100">
                  <Barcode className="w-4 h-4 mr-3" />
                  Scan Item
                </Button>
                <Button variant="outline" className="w-full justify-start bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                  <UserPlus className="w-4 h-4 mr-3" />
                  Add Customer
                </Button>
                <Button variant="outline" className="w-full justify-start bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100">
                  <BarChart3 className="w-4 h-4 mr-3" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Machine Status */}
          <MachineStatus machines={machines} />
        </div>
      </div>
    </div>
  );
}
