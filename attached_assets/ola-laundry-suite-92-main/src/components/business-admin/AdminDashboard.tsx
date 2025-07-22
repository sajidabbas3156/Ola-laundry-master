
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, Users, TrendingUp, AlertTriangle, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const todaysData = {
  sales: 1250,
  orders: 28,
  pendingOrders: 5,
  completedOrders: 23,
  topServices: [
    { name: "Wash & Fold", orders: 12, revenue: 180 },
    { name: "Dry Cleaning", orders: 8, revenue: 240 },
    { name: "Ironing", orders: 5, revenue: 75 },
    { name: "Alterations", orders: 3, revenue: 90 }
  ]
};

const weeklyTrend = [
  { day: "Mon", orders: 25, sales: 1100 },
  { day: "Tue", orders: 32, sales: 1400 },
  { day: "Wed", orders: 28, sales: 1250 },
  { day: "Thu", orders: 35, sales: 1550 },
  { day: "Fri", orders: 40, sales: 1800 },
  { day: "Sat", orders: 45, sales: 2100 },
  { day: "Sun", orders: 20, sales: 900 }
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Business Overview</h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Today's Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todaysData.sales}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysData.orders}</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{todaysData.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(todaysData.sales / todaysData.orders).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#10b981" name="Sales ($)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services Today */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Top Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysData.topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">{service.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${service.revenue}</div>
                    <div className="text-sm text-muted-foreground">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions & Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Low stock alert</span>
                </div>
                <Badge variant="destructive">2 items</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Scheduled maintenance</span>
                </div>
                <Badge variant="outline">Tomorrow</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Staff on duty</span>
                </div>
                <Badge variant="secondary">3 active</Badge>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button className="w-full" variant="outline">
                View All Pending Orders
              </Button>
              <Button className="w-full" variant="outline">
                Generate Daily Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
