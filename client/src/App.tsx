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
import { useAuth } from "@/hooks/use-auth";
import { RoleGuard } from "@/components/auth/role-guard";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">LP</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LaundryPro SaaS</h1>
            <p className="text-gray-600 mb-8">Multi-Tenant Laundry Management Platform</p>
            <div className="space-y-4">
              <a 
                href="/api/login"
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors inline-block text-center font-medium"
              >
                Sign In
              </a>
              <p className="text-sm text-gray-500">
                Demo Credentials:<br />
                • Super Admin: superadmin@laundrypro.com<br />
                • Owner: owner@laundrypro.bh<br />
                • Manager: manager@laundrypro.bh<br />
                • Cashier: cashier@laundrypro.bh<br />
                Password: demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={RoleDashboard} />
      <Route path="/admin">
        <RoleGuard allowedRoles={["superadmin", "org_owner", "branch_manager", "inventory_manager"]}>
          <AdminDashboard />
        </RoleGuard>
      </Route>
      <Route path="/pos">
        <RoleGuard allowedRoles={["cashier", "laundry_staff", "branch_manager", "org_owner"]}>
          <MobilePOS />
        </RoleGuard>
      </Route>
      <Route path="/customer">
        <CustomerApp />
      </Route>
      <Route path="/delivery">
        <RoleGuard allowedRoles={["delivery_agent", "branch_manager", "org_owner"]}>
          <DeliveryApp />
        </RoleGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
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
