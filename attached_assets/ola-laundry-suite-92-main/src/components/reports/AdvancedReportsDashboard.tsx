
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDateRangePicker } from "@/components/reports/CalendarDateRangePicker";
import { BusinessKPIDashboard } from "@/components/reports/BusinessKPIDashboard";
import { CustomerAnalytics } from "@/components/reports/CustomerAnalytics";
import { RevenueForecasting } from "@/components/reports/RevenueForecasting";
import { OperationalMetrics } from "@/components/reports/OperationalMetrics";
import { FinancialReporting } from "@/components/reports/FinancialReporting";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { AutomatedReports } from "@/components/reports/AutomatedReports";
import { 
  TrendingUp, 
  Download, 
  Settings, 
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  FileSpreadsheet,
  Mail
} from "lucide-react";

export function AdvancedReportsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [activeView, setActiveView] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Advanced Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and performance insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <CalendarDateRangePicker />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid grid-cols-7 w-full min-w-max">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="automated" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Automated
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <BusinessKPIDashboard period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerAnalytics period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueForecasting period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="operations">
          <OperationalMetrics period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialReporting period={selectedPeriod} />
        </TabsContent>

        <TabsContent value="builder">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="automated">
          <AutomatedReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
