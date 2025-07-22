
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Star, Award, Gem } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface CustomerTier {
  id: string;
  name: string;
  icon: any;
  color: string;
  benefits: string[];
  requirements: string;
  monthlyFee?: number;
  discountPercentage: number;
}

const customerTiers: CustomerTier[] = [
  {
    id: 'regular',
    name: 'Regular Customer',
    icon: Star,
    color: 'text-gray-600',
    benefits: [
      'Standard pricing',
      'Basic loyalty points (1 point per BD)',
      'Email notifications',
      'Standard service'
    ],
    requirements: 'No requirements',
    discountPercentage: 0
  },
  {
    id: 'premium',
    name: 'Premium Customer',
    icon: Award,
    color: 'text-blue-600',
    benefits: [
      '10% discount on all services',
      'Double loyalty points (2 points per BD)',
      'Priority service queue',
      'Free pickup & delivery',
      'SMS notifications',
      'Express service available'
    ],
    requirements: 'Minimum 50 BD monthly spend OR 15 BD monthly fee',
    monthlyFee: 15,
    discountPercentage: 10
  },
  {
    id: 'vip',
    name: 'VIP Customer',
    icon: Crown,
    color: 'text-yellow-500',
    benefits: [
      '20% discount on all services',
      'Triple loyalty points (3 points per BD)',
      'Same-day service guarantee',
      'Free premium detergent upgrade',
      'Dedicated customer service line',
      'Monthly free service credit (10 BD)',
      'Complimentary garment care consultation'
    ],
    requirements: 'Minimum 100 BD monthly spend OR 25 BD monthly fee',
    monthlyFee: 25,
    discountPercentage: 20
  },
  {
    id: 'platinum',
    name: 'Platinum Elite',
    icon: Gem,
    color: 'text-purple-600',
    benefits: [
      '30% discount on all services',
      'Quadruple loyalty points (4 points per BD)',
      '24/7 concierge service',
      'Free luxury packaging',
      'Personal laundry consultant',
      'Monthly free service credit (25 BD)',
      'Exclusive seasonal promotions',
      'Priority booking for special events'
    ],
    requirements: 'Minimum 200 BD monthly spend OR 50 BD monthly fee',
    monthlyFee: 50,
    discountPercentage: 30
  }
];

export function PremiumCustomerTiers() {
  const [selectedTier, setSelectedTier] = useState<string>("");

  const mockCustomers = [
    { id: '1', name: 'Ahmed Al-Mahmoud', tier: 'premium', monthlySpend: 75 },
    { id: '2', name: 'Fatima Hassan', tier: 'regular', monthlySpend: 25 },
    { id: '3', name: 'Mohammed Ali', tier: 'vip', monthlySpend: 150 },
    { id: '4', name: 'Sara Al-Zahra', tier: 'platinum', monthlySpend: 280 },
  ];

  const upgradeTier = (customerId: string, newTier: string) => {
    const tier = customerTiers.find(t => t.id === newTier);
    const customer = mockCustomers.find(c => c.id === customerId);
    
    if (!tier || !customer) return;
    
    toast.success(`Customer upgraded to ${tier.name} tier successfully!`);
  };

  const getTierIcon = (tierId: string) => {
    const tier = customerTiers.find(t => t.id === tierId);
    if (!tier) return Star;
    return tier.icon;
  };

  const getTierColor = (tierId: string) => {
    const tier = customerTiers.find(t => t.id === tierId);
    return tier?.color || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Premium Customer Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerTiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card key={tier.id} className={`border-2 ${selectedTier === tier.id ? 'border-blue-500' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <IconComponent className={`h-8 w-8 mx-auto mb-2 ${tier.color}`} />
                      <h3 className="font-bold text-lg">{tier.name}</h3>
                      {tier.discountPercentage > 0 && (
                        <Badge variant="secondary" className="mt-1">
                          {tier.discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-700">Benefits:</p>
                      <ul className="text-xs space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-green-500">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-3 text-xs">
                      <p className="font-medium">Requirements:</p>
                      <p className="text-gray-600">{tier.requirements}</p>
                      {tier.monthlyFee && (
                        <p className="text-purple-600 font-medium mt-1">
                          Monthly Fee: {tier.monthlyFee} BD
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Premium Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCustomers.map((customer) => {
              const tier = customerTiers.find(t => t.id === customer.tier);
              const IconComponent = getTierIcon(customer.tier);
              
              return (
                <Card key={customer.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${getTierColor(customer.tier)}`} />
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-gray-600">Monthly Spend: {customer.monthlySpend} BD</p>
                      </div>
                      <Badge variant="outline" className={getTierColor(customer.tier)}>
                        {tier?.name}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <select 
                        className="text-sm border rounded px-2 py-1"
                        onChange={(e) => upgradeTier(customer.id, e.target.value)}
                        defaultValue={customer.tier}
                      >
                        {customerTiers.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  {tier && tier.discountPercentage > 0 && (
                    <div className="mt-3 bg-green-50 p-2 rounded text-sm">
                      <strong>Active Discount:</strong> {tier.discountPercentage}% off all services
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
