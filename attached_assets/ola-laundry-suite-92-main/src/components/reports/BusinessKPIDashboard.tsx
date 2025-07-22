
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Clock, Target, ArrowUpRight } from "lucide-react";

interface BusinessKPIDashboardProps {
  period: string;
}

export function BusinessKPIDashboard({ period }: BusinessKPIDashboardProps) {
  const kpiData = [
    {
      title: "Total Revenue",
      value: "$156,240",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs previous period",
      target: "$160,000",
      targetProgress: 97.6
    },
    {
      title: "Active Customers",
      value: "2,847",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "vs previous period",
      target: "3,000",
      targetProgress: 94.9
    },
    {
      title: "Total Orders",
      value: "1,328",
      change: "+15.3%",
      trend: "up",
      icon: ShoppingCart,
      description: "vs previous period",
      target: "1,400",
      targetProgress: 94.8
    },
    {
      title: "Avg Service Time",
      value: "2.3 days",
      change: "-5.2%",
      trend: "down",
      icon: Clock,
      description: "vs previous period",
      target: "2.0 days",
      targetProgress: 87
    },
    {
      title: "Customer Retention",
      value: "89.2%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      description: "vs previous period",
      target: "90%",
      targetProgress: 99.1
    },
    {
      title: "Revenue per Order",
      value: "$117.65",
      change: "+3.8%",
      trend: "up",
      icon: TrendingUp,
      description: "vs previous period",
      target: "$120",
      targetProgress: 98.0
    }
  ];

  const trendData = [
    { month: "Jan", revenue: 42000, customers: 180, orders: 520 },
    { month: "Feb", revenue: 45000, customers: 195, orders: 580 },
    { month: "Mar", revenue: 52000, customers: 210, orders: 650 },
    { month: "Apr", revenue: 48000, customers: 225, orders: 620 },
    { month: "May", revenue: 58000, customers: 240, orders: 720 },
    { month: "Jun", revenue: 62000, customers: 255, orders: 780 }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    {kpi.description}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Target: {kpi.target}</span>
                  <span>{kpi.targetProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${kpi.targetProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer & Orders Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
