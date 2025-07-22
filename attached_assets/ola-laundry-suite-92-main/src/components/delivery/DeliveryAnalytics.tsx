
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Target,
  Award,
  AlertCircle,
  Download
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";

export function DeliveryAnalytics() {
  const { currentTenant } = useTenant();
  const { 
    routes, 
    drivers, 
    orders,
    getDriversByTenant,
    getOrdersByTenant 
  } = useData();

  const tenantDrivers = currentTenant?.id ? getDriversByTenant(currentTenant.id) : [];
  const tenantOrders = currentTenant?.id ? getOrdersByTenant(currentTenant.id) : [];

  const [timeRange, setTimeRange] = useState("week");

  // Calculate analytics data
  const analytics = {
    totalDeliveries: tenantOrders.filter(o => o.status === "delivered").length,
    onTimeDeliveries: Math.floor(tenantOrders.filter(o => o.status === "delivered").length * 0.94),
    avgDeliveryTime: 28,
    customerSatisfaction: 4.8,
    topPerformers: tenantDrivers.slice(0, 3).map(driver => ({
      ...driver,
      deliveries: Math.floor(Math.random() * 50) + 20,
      rating: 4.5 + Math.random() * 0.5,
      onTimeRate: 0.9 + Math.random() * 0.1
    })),
    dailyStats: Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      deliveries: Math.floor(Math.random() * 50) + 10,
      avgTime: Math.floor(Math.random() * 20) + 20
    })),
    issues: [
      { type: "Late Delivery", count: 3, severity: "medium" },
      { type: "Customer Complaint", count: 1, severity: "high" },
      { type: "Route Deviation", count: 5, severity: "low" }
    ]
  };

  const onTimePercentage = (analytics.onTimeDeliveries / analytics.totalDeliveries * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Delivery Analytics
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalDeliveries}</p>
                <p className="text-xs text-green-600 mt-1">+12% from last week</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                <p className="text-2xl font-bold text-green-600">{onTimePercentage}%</p>
                <p className="text-xs text-green-600 mt-1">+2% from last week</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.avgDeliveryTime}min</p>
                <p className="text-xs text-green-600 mt-1">-3min from last week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.customerSatisfaction}</p>
                <p className="text-xs text-green-600 mt-1">+0.2 from last week</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Daily Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.dailyStats.map((day) => (
                  <div key={day.day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(day.deliveries / 60) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{day.deliveries} deliveries</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Avg: {day.avgTime}min
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPerformers.map((driver, index) => (
                  <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{driver.name}</h3>
                        <p className="text-sm text-gray-600">{driver.deliveries} deliveries</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {(driver.onTimeRate * 100).toFixed(1)}% on-time
                        </Badge>
                        <Badge variant="secondary">
                          ⭐ {driver.rating.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          {/* Issues Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Issues & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.issues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className={`h-5 w-5 ${
                        issue.severity === "high" ? "text-red-500" :
                        issue.severity === "medium" ? "text-yellow-500" : "text-blue-500"
                      }`} />
                      <div>
                        <h3 className="font-medium">{issue.type}</h3>
                        <p className="text-sm text-gray-600">{issue.count} occurrences</p>
                      </div>
                    </div>
                    <Badge variant={
                      issue.severity === "high" ? "destructive" :
                      issue.severity === "medium" ? "default" : "secondary"
                    }>
                      {issue.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
