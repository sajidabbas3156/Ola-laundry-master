
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { OrderStatus } from "@/lib/mockData";
import { type Order } from "@/lib/mockData";

interface OrderStatusChartProps {
  orders: Order[];
}

export function OrderStatusChart({ orders }: OrderStatusChartProps) {
  // Calculate order statistics for the chart
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
  const inProgressOrders = orders.filter(o => [OrderStatus.PROCESSING, OrderStatus.RECEIVED].includes(o.status)).length;
  const readyOrders = orders.filter(o => o.status === OrderStatus.READY).length;
  const completedOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
  
  // Data for order status chart
  const orderStatusData = [
    { name: 'Pending', value: pendingOrders, color: '#f59e0b' },
    { name: 'In Progress', value: inProgressOrders, color: '#3b82f6' },
    { name: 'Ready', value: readyOrders, color: '#10b981' },
    { name: 'Delivered', value: completedOrders, color: '#6366f1' },
  ].filter(item => item.value > 0); // Only show statuses that have orders

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <CardDescription>Distribution of current orders by status</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {orderStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No order data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
