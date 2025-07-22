
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PosTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function PosTabNavigation({ activeTab, onTabChange }: PosTabNavigationProps) {
  return (
    <div className="bg-white border-b px-4 py-2">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="pos">POS</TabsTrigger>
        <TabsTrigger value="receipts">Receipts</TabsTrigger>
        <TabsTrigger value="delivery">Delivery</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="pos-settings">POS Settings</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
    </div>
  );
}
