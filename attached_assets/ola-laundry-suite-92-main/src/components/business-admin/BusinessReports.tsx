
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, FileText, TrendingUp, DollarSign, Package, Users } from "lucide-react";

// Sample data - in real app this would come from your database
const salesByItemData = [
  { name: "Shirts", sales: 450, revenue: 2250 },
  { name: "Pants", sales: 320, revenue: 1920 },
  { name: "Bed Sheets", sales: 180, revenue: 2340 },
  { name: "Curtains", sales: 90, revenue: 1350 },
];

const salesByServiceData = [
  { name: "Wash & Fold", value: 45, color: "#3b82f6" },
  { name: "Dry Cleaning", value: 30, color: "#10b981" },
  { name: "Ironing", value: 15, color: "#f59e0b" },
  { name: "Alterations", value: 10, color: "#ef4444" },
];

const paymentMethodData = [
  { method: "Cash", amount: 12500, percentage: 35 },
  { method: "UPI", amount: 14000, percentage: 40 },
  { method: "Card", amount: 7500, percentage: 20 },
  { method: "Bank Transfer", amount: 1750, percentage: 5 },
];

const monthlyFinanceData = [
  { month: "Jan", revenue: 35000, expenses: 22000, profit: 13000 },
  { month: "Feb", revenue: 32000, expenses: 20000, profit: 12000 },
  { month: "Mar", revenue: 38000, expenses: 24000, profit: 14000 },
  { month: "Apr", revenue: 36000, expenses: 23000, profit: 13000 },
  { month: "May", revenue: 40000, expenses: 25000, profit: 15000 },
  { month: "Jun", revenue: 42000, expenses: 26000, profit: 16000 },
];

export function BusinessReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [selectedReport, setSelectedReport] = useState("sales");

  const handleExportReport = (reportType: string) => {
    toast.success(`Exporting ${reportType} report...`);
    setTimeout(() => {
      toast.success(`${reportType} report exported successfully!`);
    }, 1500);
  };

  const generatePDF = (reportType: string) => {
    toast.success(`Generating ${reportType} PDF...`);
    setTimeout(() => {
      toast.success(`${reportType} PDF report generated!`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Business Reports & Analytics</h2>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExportReport("All Reports")}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,000</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,040</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$16,000</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">4 low stock items</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="finance">Finance Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
        </TabsList>
        
        {/* Sales Reports Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales by Item</CardTitle>
                <Button variant="outline" size="sm" onClick={() => generatePDF("Sales by Item")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByItemData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales by Service</CardTitle>
                <Button variant="outline" size="sm" onClick={() => generatePDF("Sales by Service")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesByServiceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesByServiceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Methods Analysis</CardTitle>
              <Button variant="outline" size="sm" onClick={() => generatePDF("Payment Methods")}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodData.map((method) => (
                  <div key={method.method} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{method.method}</span>
                      <Badge variant="outline">{method.percentage}%</Badge>
                    </div>
                    <span className="font-bold">${method.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Type Analysis</CardTitle>
              <Button variant="outline" size="sm" onClick={() => generatePDF("Order Type")}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Home Delivery & Pickup</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-medium">625</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-medium">$28,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Order Value:</span>
                      <span className="font-medium">$45.60</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Walk-in Customers</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-medium">415</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-medium">$13,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Order Value:</span>
                      <span className="font-medium">$32.50</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Finance Reports Tab */}
        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profit & Loss Trend</CardTitle>
              <Button variant="outline" size="sm" onClick={() => generatePDF("P&L Report")}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyFinanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expense Breakdown</CardTitle>
                <Button variant="outline" size="sm" onClick={() => generatePDF("Expense Report")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Staff Salaries</span>
                    <div className="text-right">
                      <div className="font-medium">$15,000</div>
                      <div className="text-sm text-muted-foreground">58%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rent & Utilities</span>
                    <div className="text-right">
                      <div className="font-medium">$5,500</div>
                      <div className="text-sm text-muted-foreground">21%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Supplies & Materials</span>
                    <div className="text-right">
                      <div className="font-medium">$3,200</div>
                      <div className="text-sm text-muted-foreground">12%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Equipment & Maintenance</span>
                    <div className="text-right">
                      <div className="font-medium">$1,800</div>
                      <div className="text-sm text-muted-foreground">7%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Marketing & Other</span>
                    <div className="text-right">
                      <div className="font-medium">$500</div>
                      <div className="text-sm text-muted-foreground">2%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Purchase Report</CardTitle>
                <Button variant="outline" size="sm" onClick={() => generatePDF("Purchase Report")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Detergents & Chemicals</span>
                    <div className="text-right">
                      <div className="font-medium">$1,200</div>
                      <div className="text-sm text-muted-foreground">45%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Packaging Materials</span>
                    <div className="text-right">
                      <div className="font-medium">$800</div>
                      <div className="text-sm text-muted-foreground">30%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Equipment Parts</span>
                    <div className="text-right">
                      <div className="font-medium">$450</div>
                      <div className="text-sm text-muted-foreground">17%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Office Supplies</span>
                    <div className="text-right">
                      <div className="font-medium">$220</div>
                      <div className="text-sm text-muted-foreground">8%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Inventory Reports Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Consumable Inventory Status</CardTitle>
                <Button variant="outline" size="sm" onClick={() => generatePDF("Inventory Report")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Detergent Powder</span>
                    <div className="text-right">
                      <div className="font-medium">50 kg</div>
                      <Badge variant="outline">Normal</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fabric Softener</span>
                    <div className="text-right">
                      <div className="font-medium">15 liters</div>
                      <Badge variant="destructive">Low Stock</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Plastic Bags</span>
                    <div className="text-right">
                      <div className="font-medium">200 pieces</div>
                      <Badge variant="outline">Normal</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Hangers</span>
                    <div className="text-right">
                      <div className="font-medium">75 pieces</div>
                      <Badge variant="secondary">Good</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Asset Report</CardTitle>
                <Button variant="outline" size="sm" onClick={() => generatePDF("Asset Report")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Washing Machines</span>
                    <div className="text-right">
                      <div className="font-medium">3 Units</div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dryers</span>
                    <div className="text-right">
                      <div className="font-medium">2 Units</div>
                      <Badge variant="destructive">1 Needs Service</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Press Machines</span>
                    <div className="text-right">
                      <div className="font-medium">2 Units</div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Steam Irons</span>
                    <div className="text-right">
                      <div className="font-medium">4 Units</div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Maintenance Report</CardTitle>
              <Button variant="outline" size="sm" onClick={() => generatePDF("Maintenance Report")}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">Washing Machine #1</div>
                    <div className="text-sm text-muted-foreground">Last service: May 15, 2024</div>
                  </div>
                  <Badge variant="outline">Next: July 15, 2024</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">Dryer #2</div>
                    <div className="text-sm text-muted-foreground">Reported issue: Overheating</div>
                  </div>
                  <Badge variant="destructive">Service Required</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">Press Machine</div>
                    <div className="text-sm text-muted-foreground">Last service: May 28, 2024</div>
                  </div>
                  <Badge variant="secondary">Scheduled: July 28, 2024</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
