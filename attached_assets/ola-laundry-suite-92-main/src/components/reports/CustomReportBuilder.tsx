
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Save, Play, Download, Settings } from "lucide-react";

export function CustomReportBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [reportName, setReportName] = useState("");

  const availableMetrics = [
    { id: "revenue", name: "Total Revenue", category: "Financial" },
    { id: "orders", name: "Order Count", category: "Operations" },
    { id: "customers", name: "Customer Count", category: "Customer" },
    { id: "avg_order", name: "Average Order Value", category: "Financial" },
    { id: "retention", name: "Customer Retention", category: "Customer" },
    { id: "service_time", name: "Average Service Time", category: "Operations" },
    { id: "profit_margin", name: "Profit Margin", category: "Financial" },
    { id: "capacity", name: "Capacity Utilization", category: "Operations" }
  ];

  const availableFilters = [
    { id: "date_range", name: "Date Range", type: "date" },
    { id: "service_type", name: "Service Type", type: "select" },
    { id: "customer_segment", name: "Customer Segment", type: "select" },
    { id: "staff_member", name: "Staff Member", type: "select" },
    { id: "location", name: "Location", type: "select" },
    { id: "payment_method", name: "Payment Method", type: "select" }
  ];

  const savedReports = [
    { name: "Monthly Performance", metrics: 4, filters: 2, lastRun: "2024-06-10" },
    { name: "Customer Analysis", metrics: 3, filters: 3, lastRun: "2024-06-08" },
    { name: "Revenue Breakdown", metrics: 5, filters: 1, lastRun: "2024-06-05" }
  ];

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="builder" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Build Custom Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Name */}
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input 
                  id="report-name"
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>

              <Separator />

              {/* Metrics Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox 
                        id={metric.id}
                        checked={selectedMetrics.includes(metric.id)}
                        onCheckedChange={() => handleMetricToggle(metric.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={metric.id} className="font-medium">
                          {metric.name}
                        </Label>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {metric.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Filters Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Apply Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox 
                        id={filter.id}
                        checked={selectedFilters.includes(filter.id)}
                        onCheckedChange={() => handleFilterToggle(filter.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={filter.id} className="font-medium">
                          {filter.name}
                        </Label>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {filter.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Output Format */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Output Format</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    PowerBI
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {selectedMetrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Selected Metrics: </span>
                    {selectedMetrics.map((metricId) => {
                      const metric = availableMetrics.find(m => m.id === metricId);
                      return (
                        <Badge key={metricId} variant="default" className="mr-2">
                          {metric?.name}
                        </Badge>
                      );
                    })}
                  </div>
                  {selectedFilters.length > 0 && (
                    <div>
                      <span className="font-medium">Applied Filters: </span>
                      {selectedFilters.map((filterId) => {
                        const filter = availableFilters.find(f => f.id === filterId);
                        return (
                          <Badge key={filterId} variant="outline" className="mr-2">
                            {filter?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Saved Report Templates</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{report.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{report.metrics} metrics</span>
                        <span>{report.filters} filters</span>
                        <span>Last run: {report.lastRun}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
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
