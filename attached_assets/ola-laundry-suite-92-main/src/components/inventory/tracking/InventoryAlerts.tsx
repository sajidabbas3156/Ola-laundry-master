
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { InventoryItem } from '@/hooks/useInventoryTracking';

interface InventoryAlertsProps {
  criticalItems: InventoryItem[];
}

export function InventoryAlerts({ criticalItems }: InventoryAlertsProps) {
  if (criticalItems.length === 0) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Critical Stock Alerts ({criticalItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {criticalItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="font-medium">{item.name}</span>
              <Badge variant="destructive">{item.currentStock} {item.unit} left</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
