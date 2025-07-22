
import { useTenant } from "@/contexts/TenantContext";

interface TenantLoaderProps {
  children: React.ReactNode;
}

export function TenantLoader({ children }: TenantLoaderProps) {
  const { isTenantLoading } = useTenant();

  if (isTenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tenant...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
