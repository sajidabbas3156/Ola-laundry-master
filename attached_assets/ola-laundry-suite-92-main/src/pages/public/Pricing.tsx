
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useNavigate } from "react-router-dom";

interface PlanBase {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  specialOffer?: boolean;
}

interface MonthlyPlan extends PlanBase {
  period: "/month";
}

interface YearlyPlan extends PlanBase {
  period: "/year";
  originalPrice: number;
  savings: string;
}

export default function Pricing() {
  const { formatCurrency } = useLocalization();
  const navigate = useNavigate();

  const monthlyPlans: MonthlyPlan[] = [
    {
      name: "Starter",
      price: 29,
      period: "/month",
      description: "Perfect for small laundry businesses",
      features: [
        "Up to 500 orders/month",
        "Basic POS system",
        "Customer management",
        "Order tracking",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: 59,
      period: "/month", 
      description: "Ideal for growing businesses",
      features: [
        "Unlimited orders",
        "Advanced POS system",
        "Delivery management",
        "Staff management",
        "Analytics & reports",
        "WhatsApp integration",
        "Priority support"
      ],
      popular: true,
      specialOffer: true
    },
    {
      name: "Enterprise",
      price: 199,
      period: "/month",
      description: "For large-scale operations",
      features: [
        "Everything in Professional",
        "Multi-location support",
        "Custom integrations",
        "Advanced analytics",
        "24/7 phone support",
        "Custom branding",
        "API access"
      ],
      popular: false
    }
  ];

  const yearlyPlans: YearlyPlan[] = [
    {
      name: "Starter",
      price: 290,
      originalPrice: 348,
      period: "/year",
      savings: "Save 17%",
      description: "Perfect for small laundry businesses",
      features: [
        "Up to 500 orders/month",
        "Basic POS system",
        "Customer management",
        "Order tracking",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: 100,
      originalPrice: 708,
      period: "/year", 
      savings: "Save 86% - Limited Time!",
      description: "Ideal for growing businesses",
      features: [
        "Unlimited orders",
        "Advanced POS system",
        "Delivery management",
        "Staff management",
        "Analytics & reports",
        "WhatsApp integration",
        "Priority support"
      ],
      popular: true,
      specialOffer: true
    },
    {
      name: "Enterprise",
      price: 1990,
      originalPrice: 2388,
      period: "/year",
      savings: "Save 17%",
      description: "For large-scale operations",
      features: [
        "Everything in Professional",
        "Multi-location support",
        "Custom integrations",
        "Advanced analytics",
        "24/7 phone support",
        "Custom branding",
        "API access"
      ],
      popular: false
    }
  ];

  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'yearly'>('yearly');
  const currentPlans = billingPeriod === 'monthly' ? monthlyPlans : yearlyPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Select the perfect plan for your laundry business. All plans include our core features with scalable options.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={billingPeriod === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={billingPeriod === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">Save up to 86%</Badge>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''} ${plan.specialOffer ? 'border-yellow-300 bg-yellow-50/30' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.specialOffer && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-yellow-500 text-white px-3 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Special Offer
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  {billingPeriod === 'yearly' && 'originalPrice' in plan && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatCurrency((plan as YearlyPlan).originalPrice)}
                    </div>
                  )}
                  <span className="text-4xl font-bold text-primary">{formatCurrency(plan.price)}</span>
                  <span className="text-gray-600">{plan.period}</span>
                  {billingPeriod === 'yearly' && 'savings' in plan && (
                    <div className="text-sm font-medium text-green-600 mt-1">
                      {(plan as YearlyPlan).savings}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''} ${plan.specialOffer ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate("/register")}
                >
                  {plan.specialOffer ? "Claim Special Offer" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us for enterprise-level customizations and integrations.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>

        {/* Special Professional Offer Section */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">🎉 Limited Time Offer!</h3>
          <p className="text-xl mb-6">
            Get our Professional Plan for only {formatCurrency(100)} per year
          </p>
          <p className="text-lg opacity-90 mb-6">
            That's {formatCurrency(608)} in savings! Offer expires soon.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3"
            onClick={() => navigate("/register")}
          >
            Claim This Deal Now
          </Button>
        </div>
      </div>
    </div>
  );
}
