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

// Mobile Apps
import CustomerApp from "@/pages/mobile/CustomerApp";
import DeliveryApp from "@/pages/mobile/DeliveryApp";
import VendorPosApp from "@/pages/mobile/VendorPosApp";
import CustomerQRApp from "@/pages/mobile/CustomerQRApp";

// Error Pages
import NotFound from "@/pages/NotFound";

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

                          {/* Tenant Dashboard (Simple for now) */}
                          <Route path="/tenant/:tenantSlug/dashboard" component={Dashboard} />

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