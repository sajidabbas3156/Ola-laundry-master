
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Workflow } from "lucide-react";

export function IntegrationWorkflows() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          Automation Workflows
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">New Customer Onboarding</h4>
              <p className="text-sm text-muted-foreground">Automatically sync new customers to CRM and send welcome email</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Active</Badge>
              <Switch checked />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Payment Processing</h4>
              <p className="text-sm text-muted-foreground">Update accounting records when payment is received</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Active</Badge>
              <Switch checked />
            </div>
          </div>
          <Button className="w-full" variant="outline">
            <Workflow className="h-4 w-4 mr-2" />
            Create New Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
