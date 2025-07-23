import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, DollarSign, FileSpreadsheet, Download, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface FinancialSummary {
  revenue: {
    total: number;
    byCategory: Record<string, number>;
    trend: Array<{ month: string; amount: number }>;
  };
  expenses: {
    total: number;
    byCategory: Record<string, number>;
    trend: Array<{ month: string; amount: number }>;
  };
  netProfit: number;
  profitMargin: number;
}

export default function FinancialReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [reportType, setReportType] = useState("summary");

  // Calculate date ranges
  const getPeriodDates = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case "current":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        };
      case "previous":
        const prevMonth = subMonths(now, 1);
        return {
          start: startOfMonth(prevMonth),
          end: endOfMonth(prevMonth),
        };
      case "quarter":
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
        return { start: quarterStart, end: quarterEnd };
      case "year":
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear(), 11, 31),
        };
      default:
        return { start: now, end: now };
    }
  };

  const dates = getPeriodDates();

  const { data: financialData, isLoading } = useQuery<FinancialSummary>({
    queryKey: ["/api/financial-reports", selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/financial-reports?start=${dates.start.toISOString()}&end=${dates.end.toISOString()}`);
      if (!response.ok) throw new Error("Failed to fetch financial data");
      return response.json();
    },
  });

  interface Expense {
    id: number;
    date: string;
    category?: { name: string };
    description: string;
    vendor?: string;
    amount: number;
  }

  interface Revenue {
    id: number;
    date: string;
    category: string;
    description: string;
    customer?: { name: string };
    amount: number;
  }

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["/api/expenses", selectedPeriod],
  });

  const { data: revenues } = useQuery<Revenue[]>({
    queryKey: ["/api/revenues", selectedPeriod],
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const exportReport = (format: "csv" | "pdf") => {
    // This would typically generate and download a report
    console.log(`Exporting ${reportType} report as ${format}`);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const revenue = financialData?.revenue.total || 0;
  const expensesTotal = financialData?.expenses.total || 0;
  const profit = financialData?.netProfit || 0;
  const profitMargin = financialData?.profitMargin || 0;

  // Prepare pie chart data
  const expensePieData = Object.entries(financialData?.expenses.byCategory || {}).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const revenuePieData = Object.entries(financialData?.revenue.byCategory || {}).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">Comprehensive financial analysis and reporting</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="previous">Previous Month</SelectItem>
              <SelectItem value="quarter">Current Quarter</SelectItem>
              <SelectItem value="year">Current Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportReport("csv")}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport("pdf")}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(revenue)}
            </div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(expensesTotal)}
            </div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -5.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(profit)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Profit Margin: {profitMargin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenue * 0.85)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Available funds
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financialData?.revenue.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Trend</CardTitle>
                <CardDescription>Monthly expenses over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financialData?.expenses.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenuePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenuePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expensePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Details</CardTitle>
              <CardDescription>Detailed breakdown of revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenues?.map((revenue: any) => (
                    <TableRow key={revenue.id}>
                      <TableCell>{format(new Date(revenue.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{revenue.category}</TableCell>
                      <TableCell>{revenue.description}</TableCell>
                      <TableCell>{revenue.customer?.name || "-"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(revenue.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
              <CardDescription>Detailed breakdown of expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses?.map((expense: any) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{expense.category?.name}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.vendor || "-"}</TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        -{formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>
                For period: {format(dates.start, "MMM d, yyyy")} - {format(dates.end, "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Revenue</h3>
                  <Table>
                    <TableBody>
                      {Object.entries(financialData?.revenue.byCategory || {}).map(([category, amount]) => (
                        <TableRow key={category}>
                          <TableCell>{category}</TableCell>
                          <TableCell className="text-right">{formatCurrency(amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell>Total Revenue</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(revenue)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Expenses</h3>
                  <Table>
                    <TableBody>
                      {Object.entries(financialData?.expenses.byCategory || {}).map(([category, amount]) => (
                        <TableRow key={category}>
                          <TableCell>{category}</TableCell>
                          <TableCell className="text-right">{formatCurrency(amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell>Total Expenses</TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(expensesTotal)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="border-t pt-4">
                  <Table>
                    <TableBody>
                      <TableRow className="text-xl font-bold">
                        <TableCell>Net Profit</TableCell>
                        <TableCell className={`text-right ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(profit)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Profit Margin</TableCell>
                        <TableCell className="text-right">{profitMargin.toFixed(1)}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}