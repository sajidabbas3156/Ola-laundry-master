
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Minus, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '@/hooks/useInventoryTracking';

interface InventoryItemCardProps {
  item: InventoryItem;
  stockStatus: { status: string; color: string };
  onStockUpdate: (id: string, change: number, action: 'use' | 'restock') => void;
}

export function InventoryItemCard({ item, stockStatus, onStockUpdate }: InventoryItemCardProps) {
  const stockPercentage = (item.currentStock / item.maxCapacity) * 100;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Package className="h-4 w-4" />
          <div>
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-gray-600">
              {item.supplier} • Last restocked: {item.lastRestocked.toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="capitalize">
          {item.category.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Current Stock</p>
          <p className="font-bold text-lg">{item.currentStock} {item.unit}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Stock Level</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${stockStatus.color}`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            <span className="text-sm">{stockPercentage.toFixed(0)}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">Predicted Days Left</p>
          <p className="font-bold">{item.predictedDaysLeft} days</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Value</p>
          <p className="font-bold">${(item.currentStock * item.costPerUnit).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStockUpdate(item.id, -1, 'use')}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStockUpdate(item.id, 1, 'restock')}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onStockUpdate(item.id, item.maxCapacity - item.currentStock, 'restock')}
        >
          Full Restock
        </Button>
        
        {item.currentStock <= item.minThreshold && (
          <Badge variant="destructive" className="ml-auto">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Needs Restocking
          </Badge>
        )}
      </div>
    </Card>
  );
}
