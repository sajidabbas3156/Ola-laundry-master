
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsTab } from "./AnalyticsTab";
import { AdvancedAnalytics } from "@/components/analytics/AdvancedAnalytics";
import { LoyaltyProgram } from "@/components/loyalty/LoyaltyProgram";
import { InventoryTracking } from "@/components/inventory/InventoryTracking";
import { FeedbackSystem } from "@/components/feedback/FeedbackSystem";
import { AlertsTab } from "./AlertsTab";
import { 
  TrendingUp, 
  BarChart3,
  Gift,
  Package,
  MessageSquare,
  AlertTriangle
} from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export function DashboardTabs({ activeTab, setActiveTab, children }: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="overflow-x-auto scrollbar-hide">
        <TabsList className="grid grid-cols-6 w-full min-w-max md:min-w-0 h-auto p-1">
          <TabsTrigger value="overview" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
            <BarChart3 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
            <Gift className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Loyalty</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
            <Package className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
            <MessageSquare className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Alerts</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-6">
        {children}
      </TabsContent>

      <TabsContent value="analytics">
        <AdvancedAnalytics />
      </TabsContent>

      <TabsContent value="loyalty">
        <LoyaltyProgram />
      </TabsContent>

      <TabsContent value="inventory">
        <InventoryTracking />
      </TabsContent>

      <TabsContent value="feedback">
        <FeedbackSystem />
      </TabsContent>

      <TabsContent value="alerts">
        <AlertsTab setActiveTab={setActiveTab} />
      </TabsContent>
    </Tabs>
  );
}
