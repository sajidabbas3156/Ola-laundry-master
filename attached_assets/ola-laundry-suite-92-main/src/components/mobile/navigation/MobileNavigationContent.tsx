
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavigationSection } from "./NavigationSection";
import { 
  getMainOperationsItems,
  getBusinessToolsItems,
  getManagementItems
} from "./navigationData";

interface MobileNavigationContentProps {
  tenantSlug: string;
  onLinkClick: () => void;
}

export function MobileNavigationContent({ tenantSlug, onLinkClick }: MobileNavigationContentProps) {
  const mainOperationsItems = getMainOperationsItems(tenantSlug);
  const businessToolsItems = getBusinessToolsItems(tenantSlug);
  const managementItems = getManagementItems(tenantSlug);

  return (
    <ScrollArea className="h-[calc(100vh-100px)] px-6">
      <div className="space-y-6">
        <NavigationSection
          title="Main Operations"
          items={mainOperationsItems}
          onLinkClick={onLinkClick}
        />

        <Separator />

        <NavigationSection
          title="Business Tools"
          items={businessToolsItems}
          onLinkClick={onLinkClick}
        />

        <Separator />

        <NavigationSection
          title="Management"
          items={managementItems}
          onLinkClick={onLinkClick}
        />
      </div>
    </ScrollArea>
  );
}
