
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PromoCodeForm } from '@/components/promotions/PromoCodeForm';
import { Tag, DollarSign, TrendingUp, Gift } from 'lucide-react';
import { PromoCode, WalletTopUp } from '@/types/promotions';

export default function TenantPromotions() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      id: '1',
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      description: '20% off for first-time customers',
      minOrderAmount: 25,
      maxDiscount: 50,
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31'),
      usageLimit: 100,
      usedCount: 15,
      isActive: true,
      tenantId: 'current-tenant'
    }
  ]);

  const [walletTopUps] = useState<WalletTopUp[]>([
    {
      id: '1',
      customerId: 'customer-1',
      amount: 100,
      bonusPercentage: 25,
      bonusAmount: 25,
      totalAmount: 125,
      status: 'completed',
      createdAt: new Date()
    }
  ]);

  const handlePromoCreate = (promo: PromoCode) => {
    setPromoCodes([...promoCodes, promo]);
  };

  const togglePromoStatus = (id: string) => {
    setPromoCodes(promoCodes.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Promotions & Rewards</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Promos</p>
                <p className="text-2xl font-bold">
                  {promoCodes.filter(p => p.isActive).length}
                </p>
              </div>
              <Tag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">
                  {promoCodes.reduce((sum, p) => sum + p.usedCount, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wallet Top-ups</p>
                <p className="text-2xl font-bold">{walletTopUps.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bonus Given</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(walletTopUps.reduce((sum, w) => sum + w.bonusAmount, 0))}
                </p>
              </div>
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="promo-codes">
        <TabsList>
          <TabsTrigger value="promo-codes">Promo Codes</TabsTrigger>
          <TabsTrigger value="wallet-bonuses">Wallet Bonuses</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="promo-codes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Promo Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promoCodes.map((promo) => (
                  <div key={promo.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                          {promo.code}
                        </code>
                        <Badge variant={promo.isActive ? "default" : "secondary"}>
                          {promo.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {promo.type === 'percentage' ? `${promo.value}% off` : 
                           promo.type === 'fixed' ? `$${promo.value} off` : 
                           `${promo.value}% wallet bonus`}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePromoStatus(promo.id)}
                      >
                        {promo.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{promo.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Valid: {formatDate(promo.validFrom)} - {formatDate(promo.validUntil)}
                      </span>
                      <span>
                        Used: {promo.usedCount}{promo.usageLimit ? `/${promo.usageLimit}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet-bonuses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Top-up Bonuses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletTopUps.map((topup) => (
                  <div key={topup.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {formatCurrency(topup.amount)} + {topup.bonusPercentage}% bonus
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: {formatCurrency(topup.totalAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={topup.status === 'completed' ? 'default' : 'secondary'}>
                          {topup.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(topup.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <PromoCodeForm onPromoCreate={handlePromoCreate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
