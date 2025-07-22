
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, Users, Zap, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface OperationalMetricsProps {
  period: string;
}

export function OperationalMetrics({ period }: OperationalMetricsProps) {
  const serviceTimeData = [
    { service: "Wash & Fold", avgTime: 1.5, target: 1.0, efficiency: 67 },
    { service: "Dry Cleaning", avgTime: 3.2, target: 3.0, efficiency: 94 },
    { service: "Ironing", avgTime: 0.8, target: 1.0, efficiency: 125 },
    { service: "Alterations", avgTime: 4.5, target: 4.0, efficiency: 89 }
  ];

  const capacityData = [
    { hour: "8AM", utilized: 45, capacity: 100 },
    { hour: "10AM", utilized: 78, capacity: 100 },
    { hour: "12PM", utilized: 95, capacity: 100 },
    { hour: "2PM", utilized: 88, capacity: 100 },
    { hour: "4PM", utilized: 92, capacity: 100 },
    { hour: "6PM", utilized: 85, capacity: 100 },
    { hour: "8PM", utilized: 52, capacity: 100 }
  ];

  const staffPerformance = [
    { name: "Sarah Johnson", orders: 45, efficiency: 98, rating: 4.9 },
    { name: "Mike Chen", orders: 42, efficiency: 95, rating: 4.8 },
    { name: "Lisa Davis", orders: 38, efficiency: 92, rating: 4.7 },
    { name: "Tom Wilson", orders: 35, efficiency: 88, rating: 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Operational Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 rotate-180" />
              -5.2% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-blue-600">Optimal range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-green-600">+2.3% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2%</div>
            <p className="text-xs text-green-600">-0.8% reduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Efficiency</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93.2%</div>
            <p className="text-xs text-green-600">+4.1% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Service Time vs Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceTimeData.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{service.service}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Avg: {service.avgTime} days
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Target: {service.target} days
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={service.efficiency >= 100 ? "default" : service.efficiency >= 90 ? "secondary" : "destructive"}>
                    {service.efficiency}% efficiency
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Capacity Utilization Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Capacity Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capacityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilized" fill="#3b82f6" />
              <Bar dataKey="capacity" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffPerformance.map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{staff.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {staff.orders} orders completed
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-medium">{staff.efficiency}%</div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{staff.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <Badge variant="outline">
                    {staff.efficiency >= 95 ? "Excellent" : staff.efficiency >= 90 ? "Good" : "Average"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
