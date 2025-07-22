
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalization } from "@/contexts/LocalizationContext";

export function PricingSection() {
  const navigate = useNavigate();
  const { formatCurrency } = useLocalization();

  const plans = [
    {
      name: "Starter",
      price: 29,
      popular: false,
      features: ["Up to 500 orders/month", "2 staff accounts", "Basic reporting", "Email support", "Mobile app"]
    },
    {
      name: "Professional",
      price: 59,
      yearlyPrice: 100,
      popular: true,
      specialOffer: true,
      features: ["Unlimited orders", "5 staff accounts", "Advanced analytics", "SMS notifications", "Priority support", "Custom branding"]
    },
    {
      name: "Enterprise",
      price: 99,
      popular: false,
      features: ["Everything included", "Unlimited staff", "API access", "Custom integrations", "Dedicated support", "White-label option"]
    }
  ];

  const handleStartTrial = () => {
    navigate("/register");
  };

  const handleViewPricing = () => {
    navigate("/pricing");
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-ola-100 text-ola-700">Simple Pricing</Badge>
          <h2 className="text-4xl font-bold mb-4">Choose Your Perfect Plan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free, scale as you grow. All plans include 14-day free trial with full access.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white p-8 rounded-2xl shadow-lg border-2 ${plan.popular ? 'border-ola-500 transform md:-translate-y-4' : 'border-gray-200'} ${plan.specialOffer ? 'border-yellow-300 bg-yellow-50/30' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-ola-500 text-white px-6 py-1">Most Popular</Badge>
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
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-5xl font-bold mb-2">
                  {formatCurrency(plan.price)}
                  <span className="text-xl text-gray-500">/month</span>
                </div>
                {plan.yearlyPrice && (
                  <div className="text-sm text-green-600 font-medium">
                    Or {formatCurrency(plan.yearlyPrice)}/year (Save 86%!)
                  </div>
                )}
                <p className="text-gray-600">14-day free trial</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={handleStartTrial}
                className={`w-full h-12 mb-4 ${plan.popular ? 'bg-gradient-to-r from-ola-600 to-ola-700' : 'bg-gray-900'} ${plan.specialOffer ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
              >
                {plan.specialOffer ? "Claim Special Offer" : "Start Free Trial"}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            onClick={handleViewPricing}
            className="text-ola-600 border-ola-600 hover:bg-ola-50"
          >
            View Full Pricing Details
          </Button>
        </div>

        {/* Special Offer Banner */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">🎉 Limited Time: Professional Plan</h3>
          <p className="text-xl mb-4">
            Get our Professional Plan for only {formatCurrency(100)} per year!
          </p>
          <p className="text-lg opacity-90 mb-6">
            Save {formatCurrency(608)} annually - Don't miss out!
          </p>
          <Button 
            size="lg" 
            className="bg-white text-orange-600 hover:bg-gray-100 font-bold"
            onClick={handleStartTrial}
          >
            Claim This Deal Now
          </Button>
        </div>
      </div>
    </section>
  );
}
