
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from "@/types/pos";

interface ReceiptData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  date: Date;
  notes?: string;
}

interface ReceiptContentProps {
  receiptData: ReceiptData;
  tenantName?: string;
  formatCurrency: (amount: number) => string;
}

export function ReceiptContent({ receiptData, tenantName, formatCurrency }: ReceiptContentProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg">
          {tenantName || "Laundry Service"}
        </CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          Order #{receiptData.orderId}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Customer:</span>
            <span className="font-medium">{receiptData.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phone:</span>
            <span>{receiptData.customerPhone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date:</span>
            <span>{receiptData.date.toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <h4 className="font-medium mb-2">Items:</h4>
          {receiptData.items.map((item, index) => (
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
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(receiptData.total)}</span>
          </div>
        </div>
        
        {receiptData.notes && (
          <div className="border-t pt-3">
            <div className="text-sm">
              <span className="font-medium">Notes:</span> {receiptData.notes}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
