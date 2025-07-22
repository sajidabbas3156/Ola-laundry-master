
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { Integration } from "./types/integration";

interface IntegrationConfigurationProps {
  selectedIntegration: Integration | null;
}

export function IntegrationConfiguration({ selectedIntegration }: IntegrationConfigurationProps) {
  if (!selectedIntegration) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Select an integration to configure its settings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <selectedIntegration.icon className="h-5 w-5" />
          {selectedIntegration.name} Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center gap-2">
              <Switch checked={selectedIntegration.status === "connected"} />
              <span className="text-sm">
                {selectedIntegration.status === "connected" ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Auto Sync</Label>
            <div className="flex items-center gap-2">
              <Switch checked={selectedIntegration.config.autoSync} />
              <span className="text-sm">Automatic synchronization</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>API Key</Label>
          <Input type="password" value="***************" />
        </div>
        <div className="space-y-2">
          <Label>Webhook URL</Label>
          <Input value={`https://app.example.com/webhooks/${selectedIntegration.id}`} readOnly />
        </div>
        <div className="flex gap-2">
          <Button>Save Configuration</Button>
          <Button variant="outline">Test Connection</Button>
        </div>
      </CardContent>
    </Card>
  );
}
