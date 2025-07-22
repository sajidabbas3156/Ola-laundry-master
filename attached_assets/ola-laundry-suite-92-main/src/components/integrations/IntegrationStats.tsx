
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  Activity, 
  XCircle, 
  BarChart3 
} from "lucide-react";
import { Integration } from "./types/integration";

interface IntegrationStatsProps {
  integrations: Integration[];
}

export function IntegrationStats({ integrations }: IntegrationStatsProps) {
  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const errorCount = integrations.filter(i => i.status === "error").length;
  const totalHealthScore = Math.round(integrations.reduce((acc, i) => acc + i.healthScore, 0) / integrations.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{connectedCount}</div>
          <p className="text-xs text-muted-foreground">of {integrations.length} total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Health Score</CardTitle>
          <Activity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHealthScore}%</div>
          <p className="text-xs text-green-600">+2% from last week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Errors</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{errorCount}</div>
          <p className="text-xs text-red-600">Needs attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sync Events</CardTitle>
          <BarChart3 className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground">in last 24h</p>
        </CardContent>
      </Card>
    </div>
  );
}
