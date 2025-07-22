
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationDashboard } from "@/components/integrations/IntegrationDashboard";
import { BusinessIntegrations } from "@/components/integrations/BusinessIntegrations";
import { WorkflowAutomation } from "@/components/integrations/WorkflowAutomation";
import { ApiEndpointManager } from "@/components/integrations/ApiEndpointManager";
import { 
  BarChart3, 
  Building, 
  Workflow, 
  Globe 
} from "lucide-react";

export default function Integrations() {
  return (
    <div className="space-y-4 md:space-y-6 responsive-p">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 md:h-8 md:w-8" />
            Integrations Hub
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Connect, automate, and manage your business integrations
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="grid grid-cols-4 w-full min-w-max md:min-w-0 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <BarChart3 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Building className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Business Apps</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Workflow className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Globe className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">API Manager</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard">
          <IntegrationDashboard />
        </TabsContent>

        <TabsContent value="business">
          <BusinessIntegrations />
        </TabsContent>

        <TabsContent value="workflows">
          <WorkflowAutomation />
        </TabsContent>

        <TabsContent value="api">
          <ApiEndpointManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
