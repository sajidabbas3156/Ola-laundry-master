
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, Minus, History, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface WalletTransaction {
  id: string;
  customerId: string;
  type: 'credit' | 'debit' | 'bonus';
  amount: number;
  description: string;
  date: Date;
  balanceAfter: number;
}

interface CustomerWallet {
  customerId: string;
  customerName: string;
  balance: number;
  totalCredits: number;
  totalDebits: number;
  lastTransaction: Date;
}

export function CustomerWalletSystem() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [debitAmount, setDebitAmount] = useState<string>("");

  const mockWallets: CustomerWallet[] = [
    {
      customerId: '1',
      customerName: 'Ahmed Al-Mahmoud',
      balance: 150.50,
      totalCredits: 300.00,
      totalDebits: 149.50,
      lastTransaction: new Date('2024-01-15')
    },
    {
      customerId: '2',
      customerName: 'Fatima Hassan',
      balance: 75.25,
      totalCredits: 150.00,
      totalDebits: 74.75,
      lastTransaction: new Date('2024-01-10')
    },
    {
      customerId: '3',
      customerName: 'Mohammed Ali',
      balance: 0.00,
      totalCredits: 200.00,
      totalDebits: 200.00,
      lastTransaction: new Date('2024-01-05')
    }
  ];

  const mockTransactions: WalletTransaction[] = [
    {
      id: '1',
      customerId: '1',
      type: 'credit',
      amount: 50.00,
      description: 'Wallet top-up',
      date: new Date('2024-01-15'),
      balanceAfter: 150.50
    },
    {
      id: '2',
      customerId: '1',
      type: 'debit',
      amount: 25.50,
      description: 'Laundry service payment',
      date: new Date('2024-01-14'),
      balanceAfter: 100.50
    },
    {
      id: '3',
      customerId: '1',
      type: 'bonus',
      amount: 10.00,
      description: 'Loyalty bonus credit',
      date: new Date('2024-01-12'),
      balanceAfter: 126.00
    }
  ];

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!selectedCustomer || !amount || amount <= 0) {
      toast.error("Please select a customer and enter a valid amount");
      return;
    }

    toast.success(`${amount} BD credited to customer wallet successfully!`);
    setTopUpAmount("");
  };

  const handleDebit = () => {
    const amount = parseFloat(debitAmount);
    if (!selectedCustomer || !amount || amount <= 0) {
      toast.error("Please select a customer and enter a valid amount");
      return;
    }

    const customerWallet = mockWallets.find(w => w.customerId === selectedCustomer);
    if (!customerWallet || customerWallet.balance < amount) {
      toast.error("Insufficient wallet balance");
      return;
    }

    toast.success(`${amount} BD debited from customer wallet successfully!`);
    setDebitAmount("");
  };

  const addBonusCredit = (customerId: string, amount: number) => {
    toast.success(`${amount} BD bonus credit added to customer wallet!`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Customer Wallet Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Wallet className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold text-green-800">Total Wallet Balance</h3>
                <p className="text-2xl font-bold text-green-600">
                  {mockWallets.reduce((sum, w) => sum + w.balance, 0).toFixed(2)} BD
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Total Credits</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {mockWallets.reduce((sum, w) => sum + w.totalCredits, 0).toFixed(2)} BD
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <Minus className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Total Debits</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {mockWallets.reduce((sum, w) => sum + w.totalDebits, 0).toFixed(2)} BD
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Customer</Label>
              <select 
                className="w-full border rounded px-3 py-2"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Select a customer...</option>
                {mockWallets.map(wallet => (
                  <option key={wallet.customerId} value={wallet.customerId}>
                    {wallet.customerName} (Balance: {wallet.balance.toFixed(2)} BD)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Top Up Amount (BD)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                  <Button onClick={handleTopUp} className="flex-shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Debit Amount (BD)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={debitAmount}
                    onChange={(e) => setDebitAmount(e.target.value)}
                  />
                  <Button onClick={handleDebit} variant="destructive" className="flex-shrink-0">
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Bonus Credits</Label>
              <div className="flex gap-2">
                {[5, 10, 20, 50].map(amount => (
                  <Button
                    key={amount}
                    size="sm"
                    variant="outline"
                    onClick={() => selectedCustomer && addBonusCredit(selectedCustomer, amount)}
                    disabled={!selectedCustomer}
                  >
                    +{amount} BD
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Wallet Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTransactions.slice(0, 5).map((transaction) => {
                const customer = mockWallets.find(w => w.customerId === transaction.customerId);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{customer?.customerName}</p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={transaction.type === 'credit' || transaction.type === 'bonus' ? 'default' : 'destructive'}
                      >
                        {transaction.type === 'credit' || transaction.type === 'bonus' ? '+' : '-'}
                        {transaction.amount.toFixed(2)} BD
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Balance: {transaction.balanceAfter.toFixed(2)} BD
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Wallet Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockWallets.map((wallet) => (
              <Card key={wallet.customerId} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{wallet.customerName}</h4>
                      <p className="text-sm text-gray-600">
                        Last transaction: {wallet.lastTransaction.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {wallet.balance.toFixed(2)} BD
                    </p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>Credits: {wallet.totalCredits.toFixed(2)}</span>
                      <span>Debits: {wallet.totalDebits.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
