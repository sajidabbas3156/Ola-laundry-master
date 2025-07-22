
import { Card, CardContent } from "@/components/ui/card";

export function BankTransferInfo() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Bank Details:</strong></p>
          <p>Account: Ola Laundry Services</p>
          <p>Account Number: 1234567890</p>
          <p>Routing Number: 987654321</p>
          <p>Reference: Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
