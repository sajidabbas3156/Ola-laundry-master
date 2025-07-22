
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Zap,
  BarChart3,
  Settings
} from "lucide-react";
import { AdvancedReportsDashboard } from "@/components/reports/AdvancedReportsDashboard";
import { EnhancedAnalyticsDashboard } from "@/components/analytics/EnhancedAnalyticsDashboard";
import { useTenant } from "@/contexts/TenantContext";
import { useData } from "@/contexts/DataContext";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const pieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const lineChartData = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const barChartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

export default function Reports() {
  const [selectedDateRange, setSelectedDateRange] = useState("last7Days");
  const { getTotalRevenue } = useData();
  const { currentTenant } = useTenant();

  const totalRevenue = currentTenant ? getTotalRevenue(currentTenant.id) : 0;

  const handleExportAll = () => {
    toast.success("Exporting all reports...");
    // Simulate export process
    setTimeout(() => {
      toast.success("All reports exported successfully!");
    }, 2000);
  };

  const handleSettings = () => {
    toast.success("Opening report settings...");
  };

  return (
    <div className="space-y-4 md:space-y-6 responsive-p">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 md:h-8 md:w-8" />
            Reports & Analytics
          </h1>
          <p className="text-sm md:text-base text-gray-600">Comprehensive business insights and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportAll} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
          <Button variant="outline" onClick={handleSettings} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="advanced" className="space-y-4">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="grid grid-cols-4 w-full min-w-max md:min-w-0 h-auto p-1">
            <TabsTrigger value="advanced" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Zap className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Advanced Reports</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Business Reports</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <BarChart className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">System Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="legacy" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <RefreshCw className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Legacy</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="advanced">
          <AdvancedReportsDashboard />
        </TabsContent>

        <TabsContent value="business">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-lg md:text-2xl font-bold">{totalRevenue} BD</p>
                  </div>
                  <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <EnhancedAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="legacy">
          <Card>
            <CardHeader>
              <CardTitle>Legacy Reporting Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Legacy reporting features and historical data exports are maintained here for compatibility.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Historical Data Export</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Export data from previous systems</li>
                        <li>• Legacy format compatibility</li>
                        <li>• Historical trend analysis</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success("Legacy data exported!")}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Legacy Data
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Migration Tools</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Data migration utilities</li>
                        <li>• Format conversion tools</li>
                        <li>• Backup and restore options</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success("Migration tools opened!")}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Migration Tools
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
