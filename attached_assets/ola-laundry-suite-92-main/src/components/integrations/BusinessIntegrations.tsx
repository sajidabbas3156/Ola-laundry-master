
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { 
  Plus, 
  Settings, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Mail,
  MessageSquare,
  CreditCard,
  Truck,
  BarChart3
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "active" | "inactive" | "pending";
  category: string;
  setupGuide?: string;
}

export function BusinessIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Send order notifications and customer support via WhatsApp",
      icon: <MessageSquare className="h-6 w-6 text-green-600" />,
      status: "active",
      category: "Communication",
      setupGuide: "WhatsApp Business API setup guide"
    },
    {
      id: "stripe",
      name: "Stripe Payments",
      description: "Accept credit card payments securely",
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      status: "inactive",
      category: "Payments",
      setupGuide: "Stripe integration setup guide"
    },
    {
      id: "delivery",
      name: "Delivery Tracking",
      description: "Real-time delivery tracking and notifications",
      icon: <Truck className="h-6 w-6 text-blue-600" />,
      status: "pending",
      category: "Logistics",
      setupGuide: "Delivery service setup guide"
    },
    {
      id: "analytics",
      name: "Advanced Analytics",
      description: "Detailed business insights and reporting",
      icon: <BarChart3 className="h-6 w-6 text-orange-600" />,
      status: "active",
      category: "Analytics",
      setupGuide: "Analytics dashboard setup guide"
    }
  ]);

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        const newStatus = integration.status === "active" ? "inactive" : "active";
        toast.success(`${integration.name} ${newStatus === "active" ? "enabled" : "disabled"} successfully!`);
        return { ...integration, status: newStatus };
      }
      return integration;
    }));
  };

  const handleSetupGuide = (integration: Integration) => {
    toast.success(`Opening ${integration.setupGuide}...`);
  };

  const handleConfigure = (integration: Integration) => {
    toast.success(`Opening configuration for ${integration.name}...`);
  };

  const handleAddIntegration = () => {
    toast.success("Opening integration marketplace...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "inactive": return <AlertCircle className="h-4 w-4 text-gray-400" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Integrations</h2>
          <p className="text-gray-600">Connect your laundry business with powerful third-party services</p>
        </div>
        <Button onClick={handleAddIntegration} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge className={getStatusColor(integration.status)} variant="outline">
                      {getStatusIcon(integration.status)}
                      <span className="ml-1">{integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}</span>
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={integration.status === "active"}
                  onCheckedChange={() => handleToggleIntegration(integration.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{integration.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetupGuide(integration)}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Setup Guide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConfigure(integration)}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Setup Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium">Enable WhatsApp notifications</h4>
                <p className="text-sm text-gray-600">Keep customers informed about their orders</p>
              </div>
              <Button size="sm" onClick={() => toast.success("WhatsApp setup initiated!")}>
                Setup Now
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium">Configure payment processing</h4>
                <p className="text-sm text-gray-600">Accept online payments securely</p>
              </div>
              <Button size="sm" onClick={() => toast.success("Payment setup initiated!")}>
                Setup Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
