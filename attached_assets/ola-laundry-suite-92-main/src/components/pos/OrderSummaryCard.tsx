
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/pos";

interface OrderSummaryCardProps {
  orderData: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    date: Date;
  };
  tenantName?: string;
  formatCurrency: (amount: number) => string;
}

export function OrderSummaryCard({
  orderData,
  tenantName,
  formatCurrency
}: OrderSummaryCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg">
          {tenantName || "Laundry Service"}
        </CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          Order #{orderData.orderId}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Customer:</span>
            <span className="font-medium">{orderData.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phone:</span>
            <span>{orderData.customerPhone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date:</span>
            <span>{orderData.date.toLocaleDateString()}</span>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Items:</h4>
          {orderData.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm mb-1">
              <div>
                <span>{item.quantity}x {item.name}</span>
                {item.service && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {item.service.name}
                  </Badge>
                )}
              </div>
              <span className="font-medium">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatCurrency(orderData.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span>{formatCurrency(orderData.tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-blue-600">{formatCurrency(orderData.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
