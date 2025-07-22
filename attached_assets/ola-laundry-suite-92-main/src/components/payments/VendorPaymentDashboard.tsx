
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  Eye,
  CreditCard
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "payment" | "payout" | "fee";
  status: "completed" | "pending" | "failed";
  description: string;
  paymentMethod: string;
}

interface PayoutSchedule {
  nextPayout: string;
  pendingAmount: number;
  frequency: "daily" | "weekly" | "monthly";
}

export function VendorPaymentDashboard() {
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-01-15",
      amount: 45.50,
      type: "payment",
      status: "completed",
      description: "Order #ORD-001",
      paymentMethod: "Credit Card"
    },
    {
      id: "2",
      date: "2024-01-14",
      amount: -2.28,
      type: "fee",
      status: "completed",
      description: "Processing fee for Order #ORD-001",
      paymentMethod: "Credit Card"
    },
    {
      id: "3",
      date: "2024-01-14",
      amount: 120.00,
      type: "payout",
      status: "pending",
      description: "Weekly payout",
      paymentMethod: "Bank Transfer"
    }
  ]);

  const [payoutSchedule] = useState<PayoutSchedule>({
    nextPayout: "2024-01-21",
    pendingAmount: 324.50,
    frequency: "weekly"
  });

  const totalEarnings = transactions
    .filter(t => t.type === "payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = transactions
    .filter(t => t.type === "fee" && t.status === "completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netEarnings = totalEarnings - totalFees;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Dashboard</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Statement
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              2.9% average rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              After all fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payoutSchedule.pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Next: {payoutSchedule.nextPayout}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "payment" ? "bg-green-100 text-green-600" :
                        transaction.type === "payout" ? "bg-blue-100 text-blue-600" :
                        "bg-red-100 text-red-600"
                      }`}>
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.date} • {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        transaction.status === "completed" ? "default" :
                        transaction.status === "pending" ? "secondary" :
                        "destructive"
                      }>
                        {transaction.status}
                      </Badge>
                      <span className={`font-medium ${
                        transaction.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Next Scheduled Payout</h3>
                  <div className="flex justify-between items-center">
                    <span>Amount: ${payoutSchedule.pendingAmount.toFixed(2)}</span>
                    <span>Date: {payoutSchedule.nextPayout}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Frequency: {payoutSchedule.frequency.charAt(0).toUpperCase() + payoutSchedule.frequency.slice(1)}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Payout History</h4>
                  <div className="text-sm text-gray-500">
                    Previous payouts will appear here once processed.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Account Holder</label>
                  <p className="text-sm text-gray-600">John Doe Laundromat</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Account Number</label>
                  <p className="text-sm text-gray-600">****1234</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Routing Number</label>
                  <p className="text-sm text-gray-600">****6789</p>
                </div>
                <Button variant="outline">Update Bank Details</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Payout Frequency</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option value="daily">Daily</option>
                    <option value="weekly" selected>Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Minimum Payout Amount</label>
                  <input 
                    type="number" 
                    defaultValue="25"
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <Button>Update Preferences</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
