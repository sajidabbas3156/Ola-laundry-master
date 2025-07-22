
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function FinalCTA() {
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
    <section className="py-20 bg-gradient-to-r from-ola-600 to-ola-700 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
          Join thousands of successful laundry businesses. Start your free trial today and see results in days, not months.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70"
          />
          <Button 
            onClick={handleQuickStart}
            size="lg" 
            className="bg-white text-ola-600 hover:bg-gray-100 h-14 px-8 font-semibold"
          >
            Start Free Trial
          </Button>
        </div>
        <p className="text-sm opacity-75 mt-4">✨ Setup in under 5 minutes • No credit card required</p>
      </div>
    </section>
  );
}
