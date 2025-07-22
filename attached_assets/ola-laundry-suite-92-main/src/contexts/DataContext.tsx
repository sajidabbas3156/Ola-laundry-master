
import React, { createContext, useContext } from 'react';
import { OrdersProvider, useOrders } from './OrdersContext';
import { DriversProvider, useDrivers } from './DriversContext';
import { InventoryProvider, useInventory } from './InventoryContext';
import { Driver, DeliveryRoute } from './DriversContext';
import { InventoryItem } from '@/lib/defaultInventory';
import { OrderStatus } from '@/lib/mockData';

// Re-export types for backward compatibility
export type { Driver, DeliveryRoute };

interface Order {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    service: string;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  serviceCharge: number;
  total: number;
  paymentMethod: string;
  serviceType: string;
  pickupDate: Date | undefined;
  pickupTime: string;
  deliveryAddress: string;
  notes: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Updated interface to match async implementations
interface DataContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  inventory: InventoryItem[];
  updateInventory: (newInventory: InventoryItem[]) => Promise<boolean>;
  getOrdersByTenant: (tenantId: string) => Order[];
  getTotalRevenue: (tenantId: string) => number;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  drivers: Driver[];
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  removeDriver: (id: string) => void;
  getDriversByTenant: (tenantId: string) => Driver[];
  routes: DeliveryRoute[];
  assignOrdersToDriver: (driverId: string, orderIds: string[]) => void;
  optimizeRoute: (driverId: string) => DeliveryRoute | null;
  updateRoute: (routeId: string, updates: Partial<DeliveryRoute>) => void;
  getDriverStats: (tenantId: string) => any;
  getOrderStats: (tenantId: string) => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Backward compatibility hook that combines all contexts
function DataContextBridge({ children }: { children: React.ReactNode }) {
  const ordersContext = useOrders();
  const driversContext = useDrivers();
  const inventoryContext = useInventory();

  const value: DataContextType = {
    // Orders - now properly async
    orders: ordersContext.orders,
    addOrder: ordersContext.addOrder,
    updateOrder: ordersContext.updateOrder,
    deleteOrder: ordersContext.deleteOrder,
    getOrdersByTenant: ordersContext.getOrdersByTenant,
    getTotalRevenue: ordersContext.getTotalRevenue,
    updateOrderStatus: ordersContext.updateOrderStatus,
    getOrderStats: ordersContext.getOrderStats,
    
    // Inventory - now properly async
    inventory: inventoryContext.inventory,
    updateInventory: inventoryContext.updateInventory,
    
    // Drivers
    drivers: driversContext.drivers,
    addDriver: driversContext.addDriver,
    updateDriver: driversContext.updateDriver,
    removeDriver: driversContext.removeDriver,
    getDriversByTenant: driversContext.getDriversByTenant,
    routes: driversContext.routes,
    assignOrdersToDriver: driversContext.assignOrdersToDriver,
    optimizeRoute: driversContext.optimizeRoute,
    updateRoute: driversContext.updateRoute,
    getDriverStats: driversContext.getDriverStats
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Main provider that wraps all individual providers
export function DataProvider({ children }: { children: React.ReactNode }) {
  return (
    <OrdersProvider>
      <DriversProvider>
        <InventoryProvider>
          <DataContextBridge>
            {children}
          </DataContextBridge>
        </InventoryProvider>
      </DriversProvider>
    </OrdersProvider>
  );
}
