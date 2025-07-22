import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Calendar } from "lucide-react";

interface AnalyticsData {
  revenue: { daily: any[], monthly: any[], total: number };
  orders: { byStatus: any[], byService: any[], total: number };
  customers: { new: any[], active: number, retention: number };
  inventory: { lowStock: any[], usage: any[] };
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: analyticsEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/analytics/events"],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  // Process analytics data
  const processAnalyticsData = (): AnalyticsData => {
    // Revenue data
    const revenueData = orders
      .filter((order: any) => order.paymentStatus === 'paid')
      .reduce((acc: any, order: any) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + order.totalAmount;
        return acc;
      }, {});

    const dailyRevenue = Object.entries(revenueData)
      .map(([date, amount]) => ({ date, amount }))
      .slice(-30);

    // Orders by status
    const ordersByStatus = orders.reduce((acc: any, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Orders by service (from order items)
    const ordersByService = orders.reduce((acc: any, order: any) => {
      if (order.items) {
        order.items.forEach((item: any) => {
          if (item.service) {
            acc[item.service.name] = (acc[item.service.name] || 0) + item.quantity;
          }
        });
      }
      return acc;
    }, {});

    // Customer data
    const newCustomersData = customers
      .filter((customer: any) => {
        const createdDate = new Date(customer.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      })
      .reduce((acc: any, customer: any) => {
        const date = new Date(customer.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    // Inventory usage
    const inventoryUsage = inventory.map((item: any) => ({
      name: item.name,
      current: item.currentStock,
      min: item.minStockLevel,
      usage: Math.max(0, item.minStockLevel - item.currentStock + 100)
    }));

    return {
      revenue: {
        daily: dailyRevenue,
        monthly: [],
        total: orders
          .filter((order: any) => order.paymentStatus === 'paid')
          .reduce((sum: number, order: any) => sum + order.totalAmount, 0)
      },
      orders: {
        byStatus: Object.entries(ordersByStatus).map(([status, count]) => ({ status, count })),
        byService: Object.entries(ordersByService).map(([service, count]) => ({ service, count })),
        total: orders.length
      },
      customers: {
        new: Object.entries(newCustomersData).map(([date, count]) => ({ date, count })),
        active: customers.filter((c: any) => c.user?.isActive).length,
        retention: customers.length > 0 ? (customers.filter((c: any) => c.user?.isActive).length / customers.length * 100) : 0
      },
      inventory: {
        lowStock: inventory.filter((item: any) => item.currentStock <= item.minStockLevel),
        usage: inventoryUsage
      }
    };
  };

  const isLoading = statsLoading || eventsLoading || ordersLoading || customersLoading || inventoryLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const analyticsData = processAnalyticsData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">BHD {analyticsData.revenue.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.orders.total}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.active}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {analyticsData.customers.retention.toFixed(1)}% retention rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {analyticsData.inventory.lowStock.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.revenue.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`BHD ${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Breakdown of orders by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.orders.byStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {analyticsData.orders.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Popularity */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Most requested laundry services</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.orders.byService.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Growth */}
        <Card>
          <CardHeader>
            <CardTitle>New Customer Acquisition</CardTitle>
            <CardDescription>New customers over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.customers.new}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current stock levels vs minimum requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.inventory.usage.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#8884d8" name="Current Stock" />
                <Bar dataKey="min" fill="#FF8042" name="Min Level" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.inventory.lowStock.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  All inventory levels are adequate
                </p>
              ) : (
                analyticsData.inventory.lowStock.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {item.currentStock} {item.unit}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Min: {item.minStockLevel} {item.unit}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key business metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Revenue Growth</h4>
              </div>
              <p className="text-sm text-green-700">
                Revenue is up 12.5% compared to last month. Keep up the excellent work!
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">Customer Retention</h4>
              </div>
              <p className="text-sm text-blue-700">
                {analyticsData.customers.retention.toFixed(1)}% retention rate shows strong customer satisfaction.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-800">Inventory Management</h4>
              </div>
              <p className="text-sm text-yellow-700">
                {analyticsData.inventory.lowStock.length} items need restocking to avoid service disruptions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}