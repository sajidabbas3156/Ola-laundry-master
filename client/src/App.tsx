import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/layout/navigation";
import AdminDashboard from "@/pages/admin-dashboard";
import MobilePOS from "@/pages/mobile-pos";
import CustomerApp from "@/pages/customer-app";
import DeliveryApp from "@/pages/delivery-app";
import { useAuth, demoLogin } from "@/lib/auth";

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">LP</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">LaundryPro Bahrain</h1>
            <p className="text-gray-600 mt-2">Complete Laundry Management Suite</p>
          </div>
          <Button 
            onClick={demoLogin} 
            className="w-full py-3 text-lg font-semibold"
          >
            Demo Login (Admin Access)
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Demo includes: Web Dashboard, Mobile POS, Customer App, and Delivery App
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Switch>
        <Route path="/" component={AdminDashboard} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/pos" component={MobilePOS} />
        <Route path="/customer" component={CustomerApp} />
        <Route path="/delivery" component={DeliveryApp} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
