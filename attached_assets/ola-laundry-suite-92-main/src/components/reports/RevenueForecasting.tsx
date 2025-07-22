
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Calendar, DollarSign } from "lucide-react";

interface RevenueForecastingProps {
  period: string;
}

export function RevenueForecasting({ period }: RevenueForecastingProps) {
  const forecastData = [
    { month: "Jul", actual: 62000, forecast: 65000, target: 70000 },
    { month: "Aug", actual: null, forecast: 68000, target: 72000 },
    { month: "Sep", actual: null, forecast: 71000, target: 75000 },
    { month: "Oct", actual: null, forecast: 74000, target: 78000 },
    { month: "Nov", actual: null, forecast: 77000, target: 80000 },
    { month: "Dec", actual: null, forecast: 82000, target: 85000 }
  ];

  const revenueBreakdown = [
    { category: "Wash & Fold", current: 45000, forecast: 48000, growth: 6.7 },
    { category: "Dry Cleaning", current: 28000, forecast: 32000, growth: 14.3 },
    { category: "Ironing", current: 15000, forecast: 16500, growth: 10.0 },
    { category: "Alterations", current: 8000, forecast: 9200, growth: 15.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Forecast Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Q3 Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$214K</div>
            <p className="text-xs text-green-600">+12% growth projected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year End Target</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$850K</div>
            <p className="text-xs text-blue-600">89% on track</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dec</div>
            <p className="text-xs text-muted-foreground">$82K projected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+11.8%</div>
            <p className="text-xs text-green-600">vs previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue Forecast vs Targets</CardTitle>
          <div className="flex items-center gap-2">
            <Select defaultValue="monthly">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Actual Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Forecast"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Breakdown by Service */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast by Service Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.category}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Current: ${item.current.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Forecast: ${item.forecast.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={item.growth > 10 ? "default" : "secondary"}>
                    +{item.growth}%
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
