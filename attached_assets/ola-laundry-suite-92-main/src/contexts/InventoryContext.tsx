
import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryItem, defaultInventoryItems } from '@/lib/defaultInventory';
import { DataPersistence } from '@/utils/DataPersistence';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { toast } from '@/components/ui/sonner';

interface InventoryContextType {
  inventory: InventoryItem[];
  updateInventory: (newInventory: InventoryItem[]) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  const { isLoading, error, execute } = useAsyncOperation({
    onError: (error) => {
      console.error('Inventory operation failed:', error);
      toast.error('Failed to update inventory: ' + error.message);
    },
    onSuccess: () => {
      toast.success('Inventory updated successfully');
    }
  });

  // Load inventory on mount
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const saved = DataPersistence.getItem<InventoryItem[]>('inventory', {
          fallbackValue: defaultInventoryItems,
          useCache: true,
          cacheTimeout: 5 * 60 * 1000 // 5 minutes
        });

        if (saved) {
          // Ensure backward compatibility and data integrity
          const processedInventory = saved.map((item: any) => ({
            ...item,
            enabledForServices: item.enabledForServices || {
              "wash-fold": true,
              "dry-cleaning": false,
              "wash-iron": false,
              "iron-only": false
            }
          }));
          
          setInventory(processedInventory);
        } else {
          setInventory(defaultInventoryItems);
        }
      } catch (error) {
        console.error('Failed to load inventory:', error);
        setInventory(defaultInventoryItems);
        toast.error('Failed to load inventory, using defaults');
      }
    };

    loadInventory();
  }, []);

  const updateInventory = async (newInventory: InventoryItem[]): Promise<boolean> => {
    return await execute(async () => {
      // Validate inventory data
      if (!Array.isArray(newInventory)) {
        throw new Error('Invalid inventory data format');
      }

      // Save to storage
      const success = DataPersistence.setItem('inventory', newInventory, {
        useCache: true,
        cacheTimeout: 5 * 60 * 1000
      });

      if (!success) {
        throw new Error('Failed to save inventory to storage');
      }

      setInventory(newInventory);
      return true;
    }) !== null;
  };

  const refreshInventory = async (): Promise<void> => {
    await execute(async () => {
      const saved = DataPersistence.getItem<InventoryItem[]>('inventory', {
        fallbackValue: defaultInventoryItems
      });
      
      if (saved) {
        setInventory(saved);
      }
    });
  };

  const value = {
    inventory,
    updateInventory,
    isLoading,
    error,
    refreshInventory
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}
