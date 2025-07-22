
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, Award, Crown } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export interface LoyaltyCustomer {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  ordersCount: number;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  type: 'discount' | 'free_service' | 'gift';
  value: number;
}

export function LoyaltyProgram() {
  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([]);
  const [rewards] = useState<LoyaltyReward[]>([
    {
      id: '1',
      name: '10% Off Next Order',
      pointsCost: 100,
      description: 'Get 10% discount on your next order',
      type: 'discount',
      value: 10
    },
    {
      id: '2',
      name: 'Free Wash & Fold',
      pointsCost: 250,
      description: 'One free wash & fold service',
      type: 'free_service',
      value: 25
    },
    {
      id: '3',
      name: 'Premium Detergent Upgrade',
      pointsCost: 150,
      description: 'Free upgrade to premium detergent',
      type: 'gift',
      value: 15
    }
  ]);

  useEffect(() => {
    const savedCustomers = localStorage.getItem('ola_loyalty_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Award className="h-4 w-4 text-amber-600" />;
      case 'Silver': return <Star className="h-4 w-4 text-gray-500" />;
      case 'Gold': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'Platinum': return <Crown className="h-4 w-4 text-purple-600" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getTierRequirements = (tier: string) => {
    switch (tier) {
      case 'Bronze': return { points: 0, spending: 0 };
      case 'Silver': return { points: 500, spending: 200 };
      case 'Gold': return { points: 1000, spending: 500 };
      case 'Platinum': return { points: 2000, spending: 1000 };
      default: return { points: 0, spending: 0 };
    }
  };

  const addPoints = (customerId: string, points: number, orderValue: number) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        const newPoints = customer.points + points;
        const newTotalSpent = customer.totalSpent + orderValue;
        const newOrdersCount = customer.ordersCount + 1;
        
        // Determine new tier
        let newTier: LoyaltyCustomer['tier'] = 'Bronze';
        if (newPoints >= 2000 && newTotalSpent >= 1000) newTier = 'Platinum';
        else if (newPoints >= 1000 && newTotalSpent >= 500) newTier = 'Gold';
        else if (newPoints >= 500 && newTotalSpent >= 200) newTier = 'Silver';

        return {
          ...customer,
          points: newPoints,
          totalSpent: newTotalSpent,
          ordersCount: newOrdersCount,
          tier: newTier
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
    localStorage.setItem('ola_loyalty_customers', JSON.stringify(updatedCustomers));
    toast.success(`${points} loyalty points added!`);
  };

  const redeemReward = (customerId: string, rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    const customer = customers.find(c => c.id === customerId);
    if (!customer || customer.points < reward.pointsCost) {
      toast.error('Insufficient points for this reward');
      return;
    }

    const updatedCustomers = customers.map(c => 
      c.id === customerId 
        ? { ...c, points: c.points - reward.pointsCost }
        : c
    );
    
    setCustomers(updatedCustomers);
    localStorage.setItem('ola_loyalty_customers', JSON.stringify(updatedCustomers));
    toast.success(`Reward "${reward.name}" redeemed successfully!`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Loyalty Program Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-600">{customers.length}</h3>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600">
                {customers.reduce((sum, c) => sum + c.points, 0)}
              </h3>
              <p className="text-gray-600">Total Points Earned</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-600">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
              </h3>
              <p className="text-gray-600">Total Customer Spending</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Rewards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{reward.name}</h4>
                    <Badge variant="outline">{reward.pointsCost} pts</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {reward.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Loyalty Status</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No loyalty customers yet</p>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => {
                const tierReq = getTierRequirements(customer.tier);
                const nextTierReq = customer.tier === 'Platinum' ? null : 
                  getTierRequirements(customer.tier === 'Bronze' ? 'Silver' : 
                                    customer.tier === 'Silver' ? 'Gold' : 'Platinum');
                
                return (
                  <Card key={customer.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {getTierIcon(customer.tier)}
                          <Badge variant="outline">{customer.tier}</Badge>
                        </div>
                        <div>
                          <h4 className="font-medium">{customer.name}</h4>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{customer.points} pts</p>
                        <p className="text-sm text-gray-600">{customer.ordersCount} orders</p>
                      </div>
                    </div>
                    
                    {nextTierReq && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to next tier</span>
                          <span>{customer.points}/{nextTierReq.points} points</span>
                        </div>
                        <Progress 
                          value={(customer.points / nextTierReq.points) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
