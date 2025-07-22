
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, Gift, Award, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface LoyaltyReward {
  id: string;
  name: string;
  pointsRequired: number;
  description: string;
  type: 'free_service' | 'free_wash' | 'money_value' | 'discount';
  value: string;
  termsAndConditions: string;
}

const loyaltyRewards: LoyaltyReward[] = [
  {
    id: '1',
    name: '2 Free Services',
    pointsRequired: 200,
    description: 'Get 2 orders of free laundry service',
    type: 'free_service',
    value: '2 Orders',
    termsAndConditions: 'Valid for wash & fold services only. Cannot be combined with other offers.'
  },
  {
    id: '2',
    name: '10kg Free Wash',
    pointsRequired: 500,
    description: 'Free 10kg washing service',
    type: 'free_wash',
    value: '10kg',
    termsAndConditions: 'Applies to regular wash only. Dry cleaning not included.'
  },
  {
    id: '3',
    name: '10 BD Worth Laundry',
    pointsRequired: 1000,
    description: '10 Bahraini Dinars worth of any laundry service',
    type: 'money_value',
    value: '10 BD',
    termsAndConditions: 'Can be used for any service. Valid for 6 months from redemption.'
  },
  {
    id: '4',
    name: '50% Discount on 20kg Wash',
    pointsRequired: 1500,
    description: '50% discount on 20kg washing service',
    type: 'discount',
    value: '50%',
    termsAndConditions: 'Valid for 20kg wash only. One-time use. Cannot be combined with other discounts.'
  }
];

export function CustomerLoyaltyProgram() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const mockCustomers = [
    { id: '1', name: 'Ahmed Al-Mahmoud', points: 1250, totalSpent: 850 },
    { id: '2', name: 'Fatima Hassan', points: 750, totalSpent: 520 },
    { id: '3', name: 'Mohammed Ali', points: 2100, totalSpent: 1200 },
  ];

  const handleRedeemReward = (rewardId: string, customerId: string) => {
    const reward = loyaltyRewards.find(r => r.id === rewardId);
    const customer = mockCustomers.find(c => c.id === customerId);
    
    if (!reward || !customer) return;
    
    if (customer.points < reward.pointsRequired) {
      toast.error("Insufficient loyalty points for this reward");
      return;
    }

    toast.success(`Reward "${reward.name}" redeemed successfully! Customer charged ${reward.pointsRequired} points.`);
  };

  const addPointsToCustomer = (customerId: string, orderAmount: number) => {
    // 1 point per 1 BD spent
    const pointsToAdd = Math.floor(orderAmount);
    toast.success(`${pointsToAdd} loyalty points added to customer account!`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Loyalty Program Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">How Customers Earn Points:</h3>
            <p className="text-blue-800">Customers earn 1 loyalty point for every 1 BD spent on laundry services.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Loyalty Rewards Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loyaltyRewards.map((reward) => (
              <Card key={reward.id} className="border border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">{reward.name}</h3>
                    </div>
                    <Badge variant="outline" className="bg-purple-50">
                      {reward.pointsRequired} pts
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                  <p className="text-lg font-bold text-purple-600 mb-3">{reward.value}</p>
                  
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-3">
                    <strong>Terms:</strong> {reward.termsAndConditions}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => selectedCustomer && handleRedeemReward(reward.id, selectedCustomer)}
                    disabled={!selectedCustomer}
                  >
                    Redeem for Customer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Customer Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCustomers.map((customer) => {
              const nextReward = loyaltyRewards.find(r => r.pointsRequired > customer.points);
              const progress = nextReward 
                ? (customer.points / nextReward.pointsRequired) * 100 
                : 100;

              return (
                <Card key={customer.id} className="p-4 cursor-pointer hover:bg-gray-50" 
                      onClick={() => setSelectedCustomer(customer.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{customer.name}</h4>
                      <p className="text-sm text-gray-600">Total Spent: {customer.totalSpent} BD</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-purple-600">{customer.points} pts</p>
                      {selectedCustomer === customer.id && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </div>
                  </div>
                  
                  {nextReward && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to {nextReward.name}</span>
                        <span>{customer.points}/{nextReward.pointsRequired} points</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        const amount = parseFloat(prompt("Enter order amount in BD:") || "0");
                        if (amount > 0) addPointsToCustomer(customer.id, amount);
                      }}
                    >
                      Add Points for New Order
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
