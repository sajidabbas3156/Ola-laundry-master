import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function WelcomeBanner() {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getUserTitle = (role: string) => {
    const titles = {
      superadmin: "Super Administrator",
      org_owner: "Business Owner",
      branch_manager: "Manager",
      cashier: "Cashier",
      laundry_staff: "Staff Member",
      inventory_manager: "Inventory Manager",
      delivery_agent: "Delivery Agent"
    };
    return titles[role as keyof typeof titles] || "Team Member";
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getGreeting()}, {user?.firstName || "there"}! 👋
              </h2>
              <p className="text-gray-600">
                Welcome back to your LaundryPro dashboard • {getUserTitle(user?.role || "")}
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                Live Updates
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mx-auto mt-1"></div>
            </div>
            
            <Button variant="outline" size="sm" className="bg-white/80">
              <Heart className="w-4 h-4 mr-2" />
              Need Help?
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}