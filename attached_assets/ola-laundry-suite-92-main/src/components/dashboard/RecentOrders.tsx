
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Order, OrderStatus } from "@/lib/mockData";

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest orders received</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {formatCurrency(order.total)}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                      order.status === OrderStatus.PENDING ? "bg-yellow-100 text-yellow-800" :
                      order.status === OrderStatus.PROCESSING ? "bg-blue-100 text-blue-800" :
                      order.status === OrderStatus.READY ? "bg-green-100 text-green-800" :
                      order.status === OrderStatus.DELIVERED ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No recent orders
          </div>
        )}
      </CardContent>
    </Card>
  );
}
