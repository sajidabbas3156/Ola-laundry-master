
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight, Shield } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleQuickStart = () => {
    if (email) {
      navigate(`/register?email=${encodeURIComponent(email)}`);
    } else {
      navigate("/register");
    }
  };

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-ola-100/20 to-blue-100/20"></div>
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start mb-6 space-y-4">
              <img 
                src="/lovable-uploads/d8b7a3ec-1ecf-4f9e-b57a-6329f0b4a2b4.png" 
                alt="OLA Laundry" 
                className="h-16 w-auto"
              />
              <Badge className="bg-ola-100 text-ola-700 hover:bg-ola-200">
                🚀 #1 Laundry Management Software
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Transform Your 
              <span className="bg-gradient-to-r from-ola-600 to-ola-700 bg-clip-text text-transparent"> Laundry Business</span> 
              Today
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join 10,000+ laundry businesses using Ola to streamline operations, 
              delight customers, and boost profits by up to 40%.
            </p>
            
            {/* Instant Registration */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-ola-100 mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">Start your free trial in 30 seconds:</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-lg"
                />
                <Button 
                  onClick={handleQuickStart}
                  size="lg" 
                  className="bg-gradient-to-r from-ola-600 to-ola-700 hover:from-ola-700 hover:to-ola-800 h-12 px-8"
                >
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">✨ No credit card required • Setup in minutes</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-2 font-medium">4.9/5 from 2,500+ reviews</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-1" />
                <span>SOC 2 Compliant</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <img
                src={`https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                alt="Modern Laundry Management Dashboard"
                className="rounded-2xl shadow-2xl border border-ola-100"
              />
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl border border-ola-100">
                <div className="text-2xl font-bold text-ola-600">40%</div>
                <div className="text-sm text-gray-600">Profit Increase</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl border border-ola-100">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
