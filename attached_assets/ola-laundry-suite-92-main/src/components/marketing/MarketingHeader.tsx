
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, Mail } from "lucide-react";

export function MarketingHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Marketing Center</h1>
        <p className="text-muted-foreground mt-1">
          Manage campaigns, engage customers, and track performance
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            3 Active Campaigns
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            12.5K Reach
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            8.2% Open Rate
          </Badge>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>
    </div>
  );
}
