import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  iconColor: string;
}

export function StatsCard({ title, value, change, icon: Icon, iconColor }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={cn("w-8 h-8 bg-opacity-10 rounded-md flex items-center justify-center", iconColor)}>
              <Icon className={cn("w-5 h-5", iconColor.replace("bg-", "text-"))} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
        {change && (
          <div className="mt-3">
            <div className={cn(
              "text-sm",
              change.type === "increase" ? "text-green-600" : "text-red-600"
            )}>
              <i className={cn(
                "fas mr-1",
                change.type === "increase" ? "fa-arrow-up" : "fa-arrow-down"
              )} />
              {change.value}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
