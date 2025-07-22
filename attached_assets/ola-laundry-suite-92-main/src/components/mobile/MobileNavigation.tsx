
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";
import { cn } from "@/lib/utils";
import { MobileNavigationContent } from "./navigation/MobileNavigationContent";

export function MobileNavigation() {
  const { tenantSlug } = useParams();
  const { currentTenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  if (!tenantSlug || !currentTenant) return null;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 bg-white z-50">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {currentTenant.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-semibold">{currentTenant.name}</h2>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
        
        <MobileNavigationContent 
          tenantSlug={tenantSlug} 
          onLinkClick={handleLinkClick} 
        />
      </SheetContent>
    </Sheet>
  );
}
