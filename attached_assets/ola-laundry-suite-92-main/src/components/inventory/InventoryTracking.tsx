
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventoryTracking } from '@/hooks/useInventoryTracking';
import { InventoryAlerts } from './tracking/InventoryAlerts';
import { InventoryStats } from './tracking/InventoryStats';
import { InventorySearch } from './tracking/InventorySearch';
import { InventoryItemCard } from './tracking/InventoryItemCard';

export function InventoryTracking() {
  const { inventory, updateStock, getStockStatus, criticalItems, lowStockItems } = useInventoryTracking();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
      <InventoryAlerts criticalItems={criticalItems} />

      {/* Overview Stats */}
      <InventoryStats 
        inventory={inventory} 
        criticalItems={criticalItems} 
        lowStockItems={lowStockItems} 
      />

      {/* Search and Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <InventorySearch 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
          </div>

          <div className="space-y-4">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item);
              
              return (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  stockStatus={stockStatus}
                  onStockUpdate={updateStock}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
