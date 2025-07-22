
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, Clock, ExternalLink, Globe, Smartphone, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TestCase {
  id: string;
  name: string;
  description: string;
  route?: string;
  status: "pending" | "pass" | "fail" | "warning";
  notes?: string;
}

export function ComprehensiveTestSuite() {
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState<TestCase[]>([
    // Public Routes
    { id: "landing", name: "Landing Page", description: "Test homepage functionality", route: "/", status: "pending" },
    { id: "about", name: "About Page", description: "Test about page content", route: "/about", status: "pending" },
    { id: "features", name: "Features Page", description: "Test features showcase", route: "/features", status: "pending" },
    { id: "pricing", name: "Pricing Page", description: "Test pricing plans", route: "/pricing", status: "pending" },
    { id: "contact", name: "Contact Page", description: "Test contact form", route: "/contact", status: "pending" },
    { id: "register", name: "Registration Flow", description: "Test tenant registration", route: "/register", status: "pending" },
    { id: "tenant-selector", name: "Tenant Selector", description: "Test tenant selection", route: "/select-tenant", status: "pending" },
    
    // Authentication Routes
    { id: "tenant-login", name: "Tenant Login", description: "Test tenant login flow", route: "/tenant/demo/login", status: "pending" },
    { id: "admin-login", name: "Admin Login", description: "Test admin authentication", route: "/admin/login", status: "pending" },
    
    // Tenant Routes (requires authentication)
    { id: "dashboard", name: "Dashboard", description: "Test main dashboard", route: "/tenant/demo/dashboard", status: "pending" },
    { id: "pos", name: "POS System", description: "Test point of sale", route: "/tenant/demo/pos", status: "pending" },
    { id: "customers", name: "Customer Management", description: "Test customer CRUD", route: "/tenant/demo/customers", status: "pending" },
    { id: "orders", name: "Order Management", description: "Test order processing", route: "/tenant/demo/orders", status: "pending" },
    { id: "inventory", name: "Inventory", description: "Test inventory tracking", route: "/tenant/demo/inventory", status: "pending" },
    { id: "reports", name: "Reports", description: "Test analytics and reports", route: "/tenant/demo/reports", status: "pending" },
    
    // Admin Routes (requires admin auth)
    { id: "admin-dashboard", name: "Admin Dashboard", description: "Test admin overview", route: "/admin/dashboard", status: "pending" },
    { id: "tenant-management", name: "Tenant Management", description: "Test tenant admin", route: "/admin/tenants", status: "pending" },
    { id: "payment-options", name: "Payment Options", description: "Test payment config", route: "/admin/payments", status: "pending" },
  ]);

  const updateTestStatus = (id: string, status: TestCase["status"], notes?: string) => {
    setTestCases(prev => prev.map(test => 
      test.id === id ? { ...test, status, notes } : test
    ));
  };

  const navigateToRoute = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  const getStatusIcon = (status: TestCase["status"]) => {
    switch (status) {
      case "pass": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "fail": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "pending": return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: TestCase["status"]) => {
    const variants = {
      pass: "default",
      fail: "destructive",
      warning: "secondary",
      pending: "outline"
    } as const;
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const TestCaseRow = ({ testCase }: { testCase: TestCase }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        {getStatusIcon(testCase.status)}
        <div className="flex-1">
          <div className="font-medium text-sm">{testCase.name}</div>
          <div className="text-xs text-gray-600">{testCase.description}</div>
          {testCase.notes && (
            <div className="text-xs text-gray-500 mt-1">{testCase.notes}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge(testCase.status)}
        {testCase.route && (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => navigateToRoute(testCase.route)}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateTestStatus(testCase.id, "pass")}
            className="text-green-600"
          >
            ✓
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateTestStatus(testCase.id, "fail")}
            className="text-red-600"
          >
            ✗
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateTestStatus(testCase.id, "warning")}
            className="text-yellow-600"
          >
            ⚠
          </Button>
        </div>
      </div>
    </div>
  );

  const publicRoutes = testCases.filter(test => ["landing", "about", "features", "pricing", "contact", "register", "tenant-selector"].includes(test.id));
  const authRoutes = testCases.filter(test => ["tenant-login", "admin-login"].includes(test.id));
  const tenantRoutes = testCases.filter(test => ["dashboard", "pos", "customers", "orders", "inventory", "reports"].includes(test.id));
  const adminRoutes = testCases.filter(test => ["admin-dashboard", "tenant-management", "payment-options"].includes(test.id));

  const getStats = (routes: TestCase[]) => {
    const passed = routes.filter(r => r.status === "pass").length;
    const failed = routes.filter(r => r.status === "fail").length;
    const warnings = routes.filter(r => r.status === "warning").length;
    const pending = routes.filter(r => r.status === "pending").length;
    return { passed, failed, warnings, pending, total: routes.length };
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Comprehensive Test Suite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="public">Public Routes</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="tenant">Tenant Features</TabsTrigger>
            <TabsTrigger value="admin">Admin Features</TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="space-y-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">{getStats(publicRoutes).passed}</div>
                <div className="text-xs">Passed</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-bold text-red-600">{getStats(publicRoutes).failed}</div>
                <div className="text-xs">Failed</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-bold text-yellow-600">{getStats(publicRoutes).warnings}</div>
                <div className="text-xs">Warnings</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-600">{getStats(publicRoutes).pending}</div>
                <div className="text-xs">Pending</div>
              </div>
            </div>
            <div className="space-y-2">
              {publicRoutes.map(test => <TestCaseRow key={test.id} testCase={test} />)}
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">{getStats(authRoutes).passed}</div>
                <div className="text-xs">Passed</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-bold text-red-600">{getStats(authRoutes).failed}</div>
                <div className="text-xs">Failed</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-bold text-yellow-600">{getStats(authRoutes).warnings}</div>
                <div className="text-xs">Warnings</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-600">{getStats(authRoutes).pending}</div>
                <div className="text-xs">Pending</div>
              </div>
            </div>
            <div className="space-y-2">
              {authRoutes.map(test => <TestCaseRow key={test.id} testCase={test} />)}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h4 className="font-medium text-blue-800">Demo Credentials:</h4>
              <div className="text-sm text-blue-700 mt-1">
                <div>Tenant: demo@demo.com / demo123</div>
                <div>Admin: admin@demo.com / admin123</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tenant" className="space-y-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">{getStats(tenantRoutes).passed}</div>
                <div className="text-xs">Passed</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-bold text-red-600">{getStats(tenantRoutes).failed}</div>
                <div className="text-xs">Failed</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-bold text-yellow-600">{getStats(tenantRoutes).warnings}</div>
                <div className="text-xs">Warnings</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-600">{getStats(tenantRoutes).pending}</div>
                <div className="text-xs">Pending</div>
              </div>
            </div>
            <div className="space-y-2">
              {tenantRoutes.map(test => <TestCaseRow key={test.id} testCase={test} />)}
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200">
              <h4 className="font-medium text-amber-800">Note:</h4>
              <div className="text-sm text-amber-700 mt-1">
                These routes require tenant authentication. Login first using the demo credentials.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">{getStats(adminRoutes).passed}</div>
                <div className="text-xs">Passed</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-bold text-red-600">{getStats(adminRoutes).failed}</div>
                <div className="text-xs">Failed</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-bold text-yellow-600">{getStats(adminRoutes).warnings}</div>
                <div className="text-xs">Warnings</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-600">{getStats(adminRoutes).pending}</div>
                <div className="text-xs">Pending</div>
              </div>
            </div>
            <div className="space-y-2">
              {adminRoutes.map(test => <TestCaseRow key={test.id} testCase={test} />)}
            </div>
            <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
              <h4 className="font-medium text-red-800">Note:</h4>
              <div className="text-sm text-red-700 mt-1">
                These routes require super admin authentication. Login using admin@demo.com / admin123.
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-gray-50 rounded border">
          <h4 className="font-medium mb-2">Testing Checklist:</h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div>• ✓ Click each route button to navigate</div>
            <div>• ✓ Test on mobile (use dev tools)</div>
            <div>• ✓ Check console for errors</div>
            <div>• ✓ Test form validations</div>
            <div>• ✓ Test responsive design</div>
            <div>• ✓ Test loading states</div>
            <div>• ✓ Test error scenarios</div>
            <div>• ✓ Test browser compatibility</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
