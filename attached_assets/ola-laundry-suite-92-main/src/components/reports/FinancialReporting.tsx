
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Download, FileText, PieChart } from "lucide-react";

interface FinancialReportingProps {
  period: string;
}

export function FinancialReporting({ period }: FinancialReportingProps) {
  const profitLossData = [
    { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", revenue: 48000, expenses: 33500, profit: 14500 },
    { month: "Mar", revenue: 52000, expenses: 35000, profit: 17000 },
    { month: "Apr", revenue: 49000, expenses: 34000, profit: 15000 },
    { month: "May", revenue: 55000, expenses: 36500, profit: 18500 },
    { month: "Jun", revenue: 58000, expenses: 38000, profit: 20000 }
  ];

  const cashFlowData = [
    { month: "Jan", inflow: 45000, outflow: 32000, net: 13000 },
    { month: "Feb", inflow: 48000, outflow: 33500, net: 14500 },
    { month: "Mar", inflow: 52000, outflow: 35000, net: 17000 },
    { month: "Apr", inflow: 49000, outflow: 34000, net: 15000 },
    { month: "May", inflow: 55000, outflow: 36500, net: 18500 },
    { month: "Jun", inflow: 58000, outflow: 38000, net: 20000 }
  ];

  const expenseBreakdown = [
    { category: "Staff Wages", amount: 18500, percentage: 48.7, change: 2.3 },
    { category: "Rent & Utilities", amount: 8500, percentage: 22.4, change: 0.0 },
    { category: "Supplies", amount: 4200, percentage: 11.1, change: -5.2 },
    { category: "Equipment", amount: 3500, percentage: 9.2, change: 15.8 },
    { category: "Marketing", amount: 2000, percentage: 5.3, change: 25.0 },
    { category: "Other", amount: 1300, percentage: 3.4, change: -8.5 }
  ];

  const taxSummary = [
    { type: "Income Tax", amount: 3200, due: "2024-07-15", status: "pending" },
    { type: "Sales Tax", amount: 1850, due: "2024-07-01", status: "paid" },
    { type: "Payroll Tax", amount: 2100, due: "2024-07-10", status: "pending" },
    { type: "Property Tax", amount: 950, due: "2024-08-15", status: "upcoming" }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$20,000</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.5%</div>
            <p className="text-xs text-green-600">+1.2% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$20,000</div>
            <p className="text-xs text-green-600">Positive trend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-green-600">Above industry avg</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profit-loss" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profit-loss">P&L Statement</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="tax">Tax Report</TabsTrigger>
        </TabsList>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profit & Loss Statement</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} name="Net Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cash Flow Analysis</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inflow" fill="#10b981" name="Cash Inflow" />
                  <Bar dataKey="outflow" fill="#ef4444" name="Cash Outflow" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expense Breakdown</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseBreakdown.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{expense.category}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {expense.percentage}% of total
                        </span>
                        <Badge variant={expense.change > 0 ? "destructive" : "default"}>
                          {expense.change > 0 ? "+" : ""}{expense.change}%
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${expense.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tax Summary & Compliance</CardTitle>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxSummary.map((tax, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{tax.type}</h4>
                      <p className="text-sm text-muted-foreground">Due: {tax.due}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">${tax.amount.toLocaleString()}</div>
                      </div>
                      <Badge 
                        variant={
                          tax.status === "paid" ? "default" : 
                          tax.status === "pending" ? "destructive" : 
                          "secondary"
                        }
                      >
                        {tax.status}
                      </Badge>
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
