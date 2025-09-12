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
            <h1 className="text-3xl font-bold text-foreground">LaundryPro Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, Admin. Here's what's happening with your business today.
              {isConnected && (
                <span className="ml-2 inline-flex items-center text-success">
                  <span className="w-2 h-2 bg-success rounded-full mr-1"></span>
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
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Revenue"
          value={`$${(stats?.revenue || 0).toLocaleString()}`}
          change={{ value: "8% from last month", type: "increase" }}
          icon={DollarSign}
          iconColor="bg-success/10 text-success"
        />
        <StatsCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          change={{ value: "3% from yesterday", type: "decrease" }}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatsCard
          title="Active Customers"
          value={stats?.activeCustomers || 0}
          change={{ value: "5% from last month", type: "increase" }}
          icon={Users}
          iconColor="bg-info/10 text-info"
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
                    <div key={i} className="h-12 bg-muted rounded"></div>
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
                <Button variant="outline" className="w-full justify-start bg-primary/10 border-primary/20 text-primary hover:bg-primary/15">
                  <PlusCircle className="w-4 h-4 mr-3" />
                  Create New Order
                </Button>
                <Button variant="outline" className="w-full justify-start bg-info/10 border-info/20 text-info hover:bg-info/15">
                  <Barcode className="w-4 h-4 mr-3" />
                  Scan Item
                </Button>
                <Button variant="outline" className="w-full justify-start bg-success/10 border-success/20 text-success hover:bg-success/15">
                  <UserPlus className="w-4 h-4 mr-3" />
                  Add Customer
                </Button>
                <Button variant="outline" className="w-full justify-start bg-warning/10 border-warning/20 text-warning hover:bg-warning/15">
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
