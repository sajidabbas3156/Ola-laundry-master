
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { DataProvider } from "@/contexts/DataContext";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { DriversProvider } from "@/contexts/DriversContext";
import { TenantLoader } from "@/components/TenantLoader";

// Layouts
import TenantLayout from "@/components/layout/TenantLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Public Pages
import LandingPage from "@/pages/public/LandingPage";
import AboutUs from "@/pages/public/AboutUs";
import Features from "@/pages/public/Features";
import Pricing from "@/pages/public/Pricing";
import Contact from "@/pages/public/Contact";
import Blog from "@/pages/public/Blog";
import HelpCenter from "@/pages/public/HelpCenter";
import MobileApp from "@/pages/public/MobileApp";
import ApiDocs from "@/pages/public/ApiDocs";
import Integrations from "@/pages/public/Integrations";
import RegisterTenant from "@/pages/public/RegisterTenant";
import TenantSelector from "@/pages/public/TenantSelector";

// Auth Pages
import Login from "@/pages/auth/Login";
import AdminLogin from "@/pages/auth/AdminLogin";

// Tenant Pages
import Dashboard from "@/pages/tenant/Dashboard";
import Pos from "@/pages/tenant/Pos";
import PosSettings from "@/pages/tenant/PosSettings";
import Storefront from "@/pages/tenant/Storefront";
import Orders from "@/pages/tenant/Orders";
import Customers from "@/pages/tenant/Customers";
import InventoryManagement from "@/pages/tenant/InventoryManagement";
import Reports from "@/pages/tenant/Reports";
import TenantIntegrations from "@/pages/tenant/Integrations";
import Delivery from "@/pages/tenant/Delivery";
import Reviews from "@/pages/tenant/Reviews";
import Promotions from "@/pages/tenant/Promotions";
import Marketing from "@/pages/tenant/Marketing";
import BusinessAdmin from "@/pages/tenant/BusinessAdmin";
import Settings from "@/pages/tenant/Settings";
import Services from "@/pages/tenant/Services";
import Appointments from "@/pages/tenant/Appointments";
import HowItWorks from "@/pages/tenant/HowItWorks";
import StoreCustomization from "@/pages/tenant/StoreCustomization";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import TenantManagement from "@/pages/admin/TenantManagement";
import FeatureManagement from "@/pages/admin/FeatureManagement";
import AdminSettings from "@/pages/admin/AdminSettings";
import Profile from "@/pages/admin/Profile";
import TenantCustomization from "@/pages/admin/TenantCustomization";
import AdminInventoryManagement from "@/pages/admin/InventoryManagement";
import Tenants from "@/pages/admin/Tenants";
import PaymentOptions from "@/pages/admin/PaymentOptions";
import Notifications from "@/pages/admin/Notifications";

// Error Pages
import NotFound from "@/pages/NotFound";

// Mobile Apps
import CustomerApp from "@/pages/mobile/CustomerApp";
import DeliveryApp from "@/pages/mobile/DeliveryApp";

import "./App.css";

const queryClient = new QueryClient();

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
                      <Routes>
                        {/* Public Routes */}
                        <Route index element={<LandingPage />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/help" element={<HelpCenter />} />
                        <Route path="/mobile-app" element={<MobileApp />} />
                        <Route path="/api-docs" element={<ApiDocs />} />
                        <Route path="/integrations" element={<Integrations />} />
                        <Route path="/register" element={<RegisterTenant />} />
                        <Route path="/select-tenant" element={<TenantSelector />} />

                        {/* Mobile Apps */}
                        <Route path="/customer-app" element={<CustomerApp />} />
                        <Route path="/delivery-app" element={<DeliveryApp />} />

                        {/* Auth Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Tenant Routes */}
                        <Route path="/tenant/:tenantSlug" element={<TenantLoader><TenantLayout /></TenantLoader>}>
                          <Route path="login" element={<Login />} />
                          <Route index element={<Navigate to="dashboard" replace />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="pos" element={<Pos />} />
                          <Route path="pos-settings" element={<PosSettings />} />
                          <Route path="storefront" element={<Storefront />} />
                          <Route path="orders" element={<Orders />} />
                          <Route path="customers" element={<Customers />} />
                          <Route path="inventory" element={<InventoryManagement />} />
                          <Route path="reports" element={<Reports />} />
                          <Route path="integrations" element={<TenantIntegrations />} />
                          <Route path="delivery" element={<Delivery />} />
                          <Route path="reviews" element={<Reviews />} />
                          <Route path="promotions" element={<Promotions />} />
                          <Route path="marketing" element={<Marketing />} />
                          <Route path="business-admin" element={<BusinessAdmin />} />
                          <Route path="settings" element={<Settings />} />
                          <Route path="services" element={<Services />} />
                          <Route path="appointments" element={<Appointments />} />
                          <Route path="how-it-works" element={<HowItWorks />} />
                          <Route path="store-customization" element={<StoreCustomization />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route index element={<Navigate to="dashboard" replace />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="tenants" element={<Tenants />} />
                          <Route path="tenant-management" element={<TenantManagement />} />
                          <Route path="features" element={<FeatureManagement />} />
                          <Route path="settings" element={<AdminSettings />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="customization" element={<TenantCustomization />} />
                          <Route path="inventory" element={<AdminInventoryManagement />} />
                          <Route path="payments" element={<PaymentOptions />} />
                          <Route path="notifications" element={<Notifications />} />
                        </Route>

                        {/* Catch all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
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
