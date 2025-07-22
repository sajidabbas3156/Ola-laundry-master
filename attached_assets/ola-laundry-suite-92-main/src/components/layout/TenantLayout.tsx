
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TenantHeader } from "./TenantHeader";
import { EnhancedMobileNavigation } from "@/components/mobile/navigation/EnhancedMobileNavigation";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ErrorFallback } from "@/components/ui/error-fallback";
import { TestingHelper } from "@/components/testing/TestingHelper";
import { useTestingHelpers } from "@/hooks/useTestingHelpers";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTenant } from "@/contexts/TenantContext";

export default function TenantLayout() {
  const { tenantSlug } = useParams();
  const { currentTenant } = useTenant();
  const isMobile = useIsMobile();
  const { testResults, runBasicTests } = useTestingHelpers();

  // Show error if tenant not found
  if (tenantSlug && !currentTenant) {
    return (
      <ErrorFallback
        message={`The requested tenant "${tenantSlug}" could not be found.`}
      />
    );
  }

  return (
    <ErrorBoundary fallback={(error, resetError) => <ErrorFallback error={error} resetError={resetError} />}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          {!isMobile && <AppSidebar />}
          
          <div className="flex-1 flex flex-col">
            {!isMobile && <TenantHeader tenant={currentTenant} />}
            <EnhancedMobileNavigation />
            
            <main className={`flex-1 p-4 lg:p-6 ${isMobile ? 'pb-20' : ''}`}>
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
