
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ErrorFallback } from "@/components/ui/error-fallback";
import { TestingHelper } from "@/components/testing/TestingHelper";
import { useTestingHelpers } from "@/hooks/useTestingHelpers";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function AdminLayout() {
  const { isAuthenticated, isSuperAdmin, currentUser, logout } = useAuth();
  const { testResults, runBasicTests } = useTestingHelpers();
  const navigate = useNavigate();

  // Redirect if not authenticated as a super admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    if (!isSuperAdmin) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, isSuperAdmin, navigate]);

  return (
    <ErrorBoundary fallback={(error, resetError) => <ErrorFallback error={error} resetError={resetError} />}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm border-b py-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-lg font-medium">Ola Laundry Admin</h1>
              </div>
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Admin: {currentUser?.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    Logout
                  </Button>
                </div>
              )}
            </header>
            <main className="flex-1 p-6">
              <ErrorBoundary fallback={(error, resetError) => <ErrorFallback error={error} resetError={resetError} />}>
                <Outlet />
              </ErrorBoundary>
            </main>
          </div>
        </div>
        
        {/* Testing helper - only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <TestingHelper
            onRunTests={runBasicTests}
            results={testResults}
            isVisible={true}
          />
        )}
      </SidebarProvider>
    </ErrorBoundary>
  );
}
