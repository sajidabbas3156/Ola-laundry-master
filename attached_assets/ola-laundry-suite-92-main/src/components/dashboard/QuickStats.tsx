
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Star } from "lucide-react";

interface QuickStatsProps {
  totalRevenue: number;
  pendingOrders: number;
  customerCount: number;
}

export function QuickStats({ totalRevenue, pendingOrders, customerCount }: QuickStatsProps) {
  const quickStats = [
    {
      title: "Today's Revenue",
      value: `$${(totalRevenue * 0.1).toFixed(2)}`,
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "New Orders",
      value: pendingOrders.toString(),
      change: "+8%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Active Customers",
      value: customerCount.toString(),
      change: "+5%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Avg Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickStats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span> from yesterday
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
