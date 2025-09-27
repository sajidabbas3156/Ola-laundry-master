import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { TenantProvider } from "@/contexts/TenantContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { DataProvider } from "@/contexts/DataContext";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { DriversProvider } from "@/contexts/DriversContext";

// Public Pages
import LandingPage from "@/pages/public/LandingPage";

// Tenant Pages (Web Admin Panel)  
import Dashboard from "@/pages/tenant/Dashboard";
import Employees from "@/pages/tenant/Employees";
import Payroll from "@/pages/tenant/Payroll";
import FinancialReports from "@/pages/tenant/FinancialReports";
import InventoryManagement from "@/pages/tenant/InventoryManagement";
import NotificationsManagement from "@/pages/tenant/NotificationsManagement";
import PromotionsManagement from "@/pages/tenant/PromotionsManagement";
import ReviewsManagement from "@/pages/tenant/ReviewsManagement";
import BusinessSettings from "@/pages/tenant/BusinessSettings";
import WorkflowAutomation from "@/pages/tenant/WorkflowAutomation";
import AdvancedAnalytics from "@/pages/tenant/AdvancedAnalytics";
import AIOperationsCenter from "@/pages/tenant/AIOperationsCenter";

// Super Admin Pages
import SuperAdminDashboard from "@/pages/superadmin/SuperAdminDashboard";
import SubscriptionPlansManagement from "@/pages/superadmin/SubscriptionPlansManagement";

// Mobile Apps
import CustomerApp from "@/pages/mobile/CustomerApp";
import DeliveryApp from "@/pages/mobile/DeliveryApp";
import VendorPosApp from "@/pages/mobile/VendorPosApp";
import CustomerQRApp from "@/pages/mobile/CustomerQRApp";

// Error Pages
import NotFound from "@/pages/NotFound";
import SpinnerDemo from "@/pages/SpinnerDemo";

// Components
import InstallPrompt from "@/components/InstallPrompt";

import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <TenantProvider>
            <LocalizationProvider>
              <DataProvider>
                <CustomerProvider>
                  <DriversProvider>
                    <Router>
                      <div className="min-h-screen bg-background">
                        <Switch>
                          {/* Public Routes */}
                          <Route path="/" component={LandingPage} />
                          
                          {/* Mobile Applications */}
                          <Route path="/customer-app" component={CustomerApp} />
                          <Route path="/delivery-app" component={DeliveryApp} />
                          <Route path="/vendor-pos" component={VendorPosApp} />
                          <Route path="/quick-order" component={CustomerQRApp} />
                          <Route path="/spinner-demo" component={SpinnerDemo} />

                          {/* Tenant Dashboard */}
                          <Route path="/tenant/:tenantSlug/dashboard" component={Dashboard} />
                          <Route path="/tenant/:tenantSlug/employees" component={Employees} />
                          <Route path="/tenant/:tenantSlug/payroll" component={Payroll} />
                          <Route path="/tenant/:tenantSlug/financial-reports" component={FinancialReports} />
                          <Route path="/tenant/:tenantSlug/inventory" component={InventoryManagement} />
                          <Route path="/tenant/:tenantSlug/notifications" component={NotificationsManagement} />
                          <Route path="/tenant/:tenantSlug/promotions" component={PromotionsManagement} />
                          <Route path="/tenant/:tenantSlug/reviews" component={ReviewsManagement} />
                          <Route path="/tenant/:tenantSlug/settings" component={BusinessSettings} />
                          <Route path="/tenant/:tenantSlug/workflows" component={WorkflowAutomation} />
                          <Route path="/tenant/:tenantSlug/analytics" component={AdvancedAnalytics} />
                          <Route path="/tenant/:tenantSlug/ai-operations" component={AIOperationsCenter} />

                          {/* Super Admin Routes */}
                          <Route path="/superadmin" component={SuperAdminDashboard} />
                          <Route path="/superadmin/subscription-plans" component={SubscriptionPlansManagement} />

                          {/* Catch all route */}
                          <Route component={NotFound} />
                        </Switch>
                      </div>
                      <Toaster />
                    </Router>
                  </DriversProvider>
                </CustomerProvider>
              </DataProvider>
            </LocalizationProvider>
          </TenantProvider>
        </AuthProvider>

      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;