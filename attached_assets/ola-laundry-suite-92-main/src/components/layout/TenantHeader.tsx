
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTenant } from "@/contexts/TenantContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface TenantHeaderProps {
  tenant: any;
  onMenuClick?: () => void;
  globalSearch?: React.ReactNode;
}

export function TenantHeader({ tenant, onMenuClick, globalSearch }: TenantHeaderProps) {
  const { setCurrentTenant } = useTenant();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    setCurrentTenant(null);
    navigate("/select-tenant");
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          {isMobile ? (
            <MobileNavigation />
          ) : (
            /* Desktop Sidebar Trigger */
            <SidebarTrigger />
          )}
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {tenant?.name?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            {!isMobile && (
              <div>
                <h1 className="font-semibold text-lg">{tenant?.name}</h1>
                <p className="text-xs text-gray-600">Laundry Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Center - Global Search (hidden on small mobile) */}
        {!isMobile && (
          <div className="flex-1 max-w-md mx-4">
            {globalSearch}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </header>
  );
}
