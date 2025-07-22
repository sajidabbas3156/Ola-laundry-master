
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Zap,
  CreditCard,
  Database,
  Mail,
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { Integration } from "./types/integration";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationStats } from "./IntegrationStats";
import { IntegrationConfiguration } from "./IntegrationConfiguration";
import { IntegrationWorkflows } from "./IntegrationWorkflows";
import { IntegrationMonitoring } from "./IntegrationMonitoring";

export function IntegrationDashboard() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "stripe",
      name: "Stripe",
      category: "Payment",
      status: "connected",
      lastSync: "2 minutes ago",
      icon: CreditCard,
      description: "Payment processing and subscriptions",
      config: { webhooks: true, testMode: false },
      healthScore: 98,
      errorCount: 0
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      category: "Accounting",
      status: "connected",
      lastSync: "15 minutes ago",
      icon: Database,
      description: "Accounting and financial management",
      config: { autoSync: true, syncInterval: 30 },
      healthScore: 95,
      errorCount: 2
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      category: "Marketing",
      status: "error",
      lastSync: "2 hours ago",
      icon: Mail,
      description: "Email marketing and campaigns",
      config: { apiKey: "***", listId: "abc123" },
      healthScore: 45,
      errorCount: 15
    },
    {
      id: "twilio",
      name: "Twilio",
      category: "Communication",
      status: "connected",
      lastSync: "5 minutes ago",
      icon: MessageSquare,
      description: "SMS and voice communications",
      config: { smsEnabled: true, callsEnabled: false },
      healthScore: 92,
      errorCount: 1
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8" />
            Integration Management
          </h1>
          <p className="text-muted-foreground">
            Monitor, configure, and manage your business integrations
          </p>
        </div>
        <Button onClick={handleRefreshStatus} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* Overview Stats */}
      <IntegrationStats integrations={integrations} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard 
                key={integration.id}
                integration={integration}
                onSelect={setSelectedIntegration}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configuration">
          <IntegrationConfiguration selectedIntegration={selectedIntegration} />
        </TabsContent>

        <TabsContent value="workflows">
          <IntegrationWorkflows />
        </TabsContent>

        <TabsContent value="monitoring">
          <IntegrationMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
}
