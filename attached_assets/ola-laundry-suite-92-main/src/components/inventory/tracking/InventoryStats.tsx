
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryItem } from '@/hooks/useInventoryTracking';

interface InventoryStatsProps {
  inventory: InventoryItem[];
  criticalItems: InventoryItem[];
  lowStockItems: InventoryItem[];
}

export function InventoryStats({ inventory, criticalItems, lowStockItems }: InventoryStatsProps) {
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inventory.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{criticalItems.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${totalValue.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
