import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/contexts/TenantContext";
import TenantSidebar from "./TenantSidebar";
import TenantHeader from "./TenantHeader";

export default function TenantLayout() {
  const { user, loading } = useAuth();
  const { tenant } = useTenant();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <TenantSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TenantHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            {/* Content will be rendered here */}
          </div>
        </main>
      </div>
    </div>
  );
}