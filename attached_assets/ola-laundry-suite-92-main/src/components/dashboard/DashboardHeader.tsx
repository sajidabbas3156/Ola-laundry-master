
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

interface DashboardHeaderProps {
  tenantName: string;
  subscriptionPlan: string;
}

export function DashboardHeader({ tenantName, subscriptionPlan }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back to {tenantName}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your laundry business today</p>
      </div>
      <div className="flex items-center gap-2">
        <NotificationCenter />
        <Badge variant="outline" className="capitalize">
          {subscriptionPlan}
        </Badge>
      </div>
    </div>
  );
}
