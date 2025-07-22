
import { useTenant } from "@/contexts/TenantContext";
import { LaundryPosInterface } from "@/components/pos/LaundryPosInterface";
import { useIsMobile } from "@/hooks/use-mobile";
import { EnhancedBottomNavigation } from "@/components/mobile/EnhancedBottomNavigation";
import { EnhancedFloatingActionButton } from "@/components/mobile/EnhancedFloatingActionButton";

export default function TenantPos() {
  const { currentTenant } = useTenant();
  const isMobile = useIsMobile();

  console.log("Current tenant:", currentTenant);

  return (
    <div className="min-h-screen">
      <LaundryPosInterface />
      {isMobile && (
        <>
          <EnhancedFloatingActionButton />
          <EnhancedBottomNavigation />
        </>
      )}
    </div>
  );
}
