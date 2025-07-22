
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  XCircle, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react";

export function IntegrationMonitoring() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Error Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm">Mailchimp API rate limit exceeded</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">QuickBooks sync delayed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Stripe payment processed</span>
            </div>
            <div className="flex items-center gap-2 p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Customer synced to CRM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
