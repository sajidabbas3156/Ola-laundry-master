
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Integration } from "./types/integration";

interface IntegrationCardProps {
  integration: Integration;
  onSelect: (integration: Integration) => void;
}

export function IntegrationCard({ integration, onSelect }: IntegrationCardProps) {
  const getStatusBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "connected":
        return "default";
      case "disconnected":
        return "secondary";
      case "error":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(integration)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
            <integration.icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">{integration.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{integration.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(integration.status)}
          <Badge variant={getStatusBadge(integration.status)}>
            {integration.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
        <div className="flex justify-between items-center text-sm">
          <span>Last sync: {integration.lastSync}</span>
          <span className="font-medium">Health: {integration.healthScore}%</span>
        </div>
        {integration.errorCount > 0 && (
          <Alert className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {integration.errorCount} error(s) detected
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
