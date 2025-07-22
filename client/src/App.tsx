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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LP</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">LaundryPro</h1>
                  <p className="text-xs text-gray-500">Smart Laundry Management</p>
                </div>
              </div>
              <a 
                href="/api/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LaundryPro</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your complete laundry business management solution. From customer orders to delivery tracking, we've got everything you need to run your laundry service smoothly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/api/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg"
              >
                Get Started Today
              </a>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 transition-all duration-200 font-semibold text-lg">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Order Management</h3>
              <p className="text-gray-600">Track orders from pickup to delivery with our intuitive dashboard. Real-time updates keep everyone informed.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Inventory</h3>
              <p className="text-gray-600">Automatic reordering and real-time stock tracking. Never run out of supplies again with intelligent alerts.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Built for speed and efficiency. Process orders, manage customers, and track deliveries in seconds, not minutes.</p>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Try It Out - Demo Accounts</h3>
              <p className="text-gray-600">Experience LaundryPro with different user roles. Each account shows different features and permissions.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold text-sm">SA</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Super Admin</h4>
                <p className="text-sm text-gray-600 mb-3">Full system access</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">superadmin@laundrypro.com</p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-sm">OW</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Business Owner</h4>
                <p className="text-sm text-gray-600 mb-3">Business management</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">owner@laundrypro.bh</p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold text-sm">MG</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Manager</h4>
                <p className="text-sm text-gray-600 mb-3">Daily operations</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">manager@laundrypro.bh</p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold text-sm">CS</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Cashier</h4>
                <p className="text-sm text-gray-600 mb-3">Point of sale</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">cashier@laundrypro.bh</p>
              </div>
            </div>

            <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Password for all demo accounts:</span> 
                <span className="font-mono bg-white px-2 py-1 rounded border ml-2">demo123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; 2024 LaundryPro SaaS. Built for the modern laundry business.</p>
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
