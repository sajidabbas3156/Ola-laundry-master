import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/layout/navigation";
import { MobileNavigation } from "@/components/common/mobile-navigation";
import { useWebSocket } from "@/hooks/use-websocket";
import AdminDashboard from "@/pages/admin-dashboard";
import MobilePOS from "@/pages/mobile-pos";
import CustomerApp from "@/pages/customer-app";
import DeliveryApp from "@/pages/delivery-app";
import InventoryManagement from "@/pages/inventory-management";
import SupplierManagement from "@/pages/supplier-management";
import PurchaseOrders from "@/pages/purchase-orders";
import PromotionManagement from "@/pages/promotion-management";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import NotificationCenter from "@/pages/notification-center";
import { useAuth } from "@/hooks/use-auth";
import { RoleGuard } from "@/components/auth/role-guard";
import { RoleDashboard } from "@/components/dashboard/role-dashboard";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isConnected } = useWebSocket();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-100/60">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="@assets/1750529717604(1)_1753277923428.png" 
                  alt="OLA LAUNDRY" 
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">OLA LAUNDRY MASTER</h1>
                  <p className="text-sm text-gray-600">Premium Laundry Management</p>
                </div>
              </div>
              <a 
                href="/api/login"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-8">
              <img 
                src="@assets/1750529717604(1)_1753277923428.png" 
                alt="OLA LAUNDRY" 
                className="h-32 w-auto"
              />
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-primary">OLA LAUNDRY MASTER</span>
            </h2>
            <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Premium laundry management solution designed for modern businesses. 
              Complete control over operations, customer experience, and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="/api/login"
                className="bg-primary text-primary-foreground px-12 py-5 rounded-2xl hover:bg-primary/90 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                Start Managing Today
              </a>
              <button className="border-2 border-primary/20 text-primary px-12 py-5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 font-bold text-xl">
                Explore Features
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-12 mb-24">
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100 hover:border-primary/20 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Order Management</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Complete order lifecycle management with intelligent tracking, automated workflows, and real-time customer notifications.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100 hover:border-primary/20 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Inventory</h3>
              <p className="text-gray-600 text-lg leading-relaxed">AI-powered inventory management with predictive analytics, automated reordering, and comprehensive supplier integration.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100 hover:border-primary/20 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Performance</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Built for scale with enterprise-grade performance, advanced analytics, and seamless multi-location management.</p>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-gray-100">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Experience OLA LAUNDRY MASTER</h3>
              <p className="text-gray-600 text-lg">Test drive our premium platform with different user roles. Each account demonstrates unique features and capabilities.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                  <span className="text-primary font-bold text-lg">SA</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Super Admin</h4>
                <p className="text-gray-600 mb-4">Complete system control</p>
                <p className="text-sm font-mono bg-white/80 p-3 rounded-xl border">superadmin@ola.bh</p>
              </div>

              <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                  <span className="text-primary font-bold text-lg">OW</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Business Owner</h4>
                <p className="text-gray-600 mb-4">Business oversight</p>
                <p className="text-sm font-mono bg-white/80 p-3 rounded-xl border">owner@ola.bh</p>
              </div>

              <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                  <span className="text-primary font-bold text-lg">MG</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Manager</h4>
                <p className="text-gray-600 mb-4">Operations management</p>
                <p className="text-sm font-mono bg-white/80 p-3 rounded-xl border">manager@ola.bh</p>
              </div>

              <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                  <span className="text-primary font-bold text-lg">CS</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Cashier</h4>
                <p className="text-gray-600 mb-4">Point of sale operations</p>
                <p className="text-sm font-mono bg-white/80 p-3 rounded-xl border">cashier@ola.bh</p>
              </div>
            </div>

            <div className="text-center mt-10 p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <p className="text-gray-700 text-lg">
                <span className="font-bold">Universal Password:</span> 
                <span className="font-mono bg-white px-4 py-2 rounded-xl border border-primary/20 ml-3 text-primary font-semibold">demo123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <img 
                src="@assets/1750529717604(1)_1753277923428.png" 
                alt="OLA LAUNDRY" 
                className="h-16 w-auto mb-4"
              />
              <p className="text-gray-600 text-lg font-medium">&copy; 2024 OLA LAUNDRY MASTER. Premium laundry management for modern businesses.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileNavigation />
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
      <Route path="/inventory">
        <RoleGuard allowedRoles={["inventory_manager", "branch_manager", "org_owner"]}>
          <InventoryManagement />
        </RoleGuard>
      </Route>
      <Route path="/suppliers">
        <RoleGuard allowedRoles={["inventory_manager", "branch_manager", "org_owner"]}>
          <SupplierManagement />
        </RoleGuard>
      </Route>
      <Route path="/purchase-orders">
        <RoleGuard allowedRoles={["inventory_manager", "branch_manager", "org_owner"]}>
          <PurchaseOrders />
        </RoleGuard>
      </Route>
      <Route path="/promotions">
        <RoleGuard allowedRoles={["branch_manager", "org_owner"]}>
          <PromotionManagement />
        </RoleGuard>
      </Route>
      <Route path="/analytics">
        <RoleGuard allowedRoles={["branch_manager", "org_owner", "superadmin"]}>
          <AnalyticsDashboard />
        </RoleGuard>
      </Route>
      <Route path="/notifications">
        <NotificationCenter />
      </Route>
        <Route component={NotFound} />
      </Switch>
    </>
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
