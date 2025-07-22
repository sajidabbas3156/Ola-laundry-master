
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'detergent' | 'fabric_softener' | 'stain_remover' | 'supplies';
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: Date;
  usage24h: number;
  predictedDaysLeft: number;
}

const defaultInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium Detergent',
    category: 'detergent',
    currentStock: 45,
    minThreshold: 20,
    maxCapacity: 100,
    unit: 'bottles',
    costPerUnit: 12.50,
    supplier: 'CleanCorp',
    lastRestocked: new Date('2024-01-15'),
    usage24h: 3,
    predictedDaysLeft: 15
  },
  {
    id: '2',
    name: 'Fabric Softener',
    category: 'fabric_softener',
    currentStock: 8,
    minThreshold: 15,
    maxCapacity: 50,
    unit: 'bottles',
    costPerUnit: 8.75,
    supplier: 'SoftTouch',
    lastRestocked: new Date('2024-01-10'),
    usage24h: 2,
    predictedDaysLeft: 4
  },
  {
    id: '3',
    name: 'Stain Remover',
    category: 'stain_remover',
    currentStock: 25,
    minThreshold: 10,
    maxCapacity: 40,
    unit: 'bottles',
    costPerUnit: 15.25,
    supplier: 'StainAway',
    lastRestocked: new Date('2024-01-12'),
    usage24h: 1,
    predictedDaysLeft: 25
  }
];

export function useInventoryTracking() {
  const [inventory, setInventory] = useState<InventoryItem[]>(defaultInventory);

  useEffect(() => {
    const savedInventory = localStorage.getItem('ola_inventory_tracking');
    if (savedInventory) {
      const parsed = JSON.parse(savedInventory);
      const withDates = parsed.map((item: any) => ({
        ...item,
        lastRestocked: new Date(item.lastRestocked)
      }));
      setInventory(withDates);
    }
  }, []);

  const saveInventory = (updatedInventory: InventoryItem[]) => {
    setInventory(updatedInventory);
    localStorage.setItem('ola_inventory_tracking', JSON.stringify(updatedInventory));
  };

  const updateStock = (id: string, change: number, action: 'use' | 'restock') => {
    const updatedInventory = inventory.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, Math.min(item.maxCapacity, item.currentStock + change));
        const updatedItem = {
          ...item,
          currentStock: newStock,
          lastRestocked: action === 'restock' ? new Date() : item.lastRestocked,
          predictedDaysLeft: item.usage24h > 0 ? Math.floor(newStock / item.usage24h) : 999
        };
        
        if (newStock <= item.minThreshold) {
          toast.error(`Low stock alert: ${item.name} is running low!`);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    saveInventory(updatedInventory);
    toast.success(`Stock ${action === 'restock' ? 'restocked' : 'updated'} successfully`);
  };

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxCapacity) * 100;
    if (item.currentStock <= item.minThreshold) return { status: 'critical', color: 'bg-red-500' };
    if (percentage <= 30) return { status: 'low', color: 'bg-yellow-500' };
    if (percentage <= 70) return { status: 'medium', color: 'bg-blue-500' };
    return { status: 'good', color: 'bg-green-500' };
  };

  const criticalItems = inventory.filter(item => item.currentStock <= item.minThreshold);
  const lowStockItems = inventory.filter(item => {
    const percentage = (item.currentStock / item.maxCapacity) * 100;
    return percentage <= 30 && item.currentStock > item.minThreshold;
  });

  return {
    inventory,
    updateStock,
    getStockStatus,
    criticalItems,
    lowStockItems
  };
}
