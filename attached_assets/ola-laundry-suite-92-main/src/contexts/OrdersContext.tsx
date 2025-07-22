
import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderStatus } from '@/lib/mockData';
import { DataPersistence } from '@/utils/DataPersistence';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { toast } from '@/components/ui/sonner';
import { BaseEntity } from '@/types/common';

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  service: string;
}

interface Order extends BaseEntity {
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
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
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  getOrdersByTenant: (tenantId: string) => Order[];
  getTotalRevenue: (tenantId: string) => number;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  getOrderStats: (tenantId: string) => OrderStats;
  isLoading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  revenue: number;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  
  const { isLoading, error, execute } = useAsyncOperation({
    onError: (error) => {
      console.error('Orders operation failed:', error);
      toast.error('Orders operation failed: ' + error.message);
    }
  });

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const saved = DataPersistence.getItem<Order[]>('orders', {
          fallbackValue: [],
          useCache: true,
          cacheTimeout: 2 * 60 * 1000 // 2 minutes
        });

        if (saved) {
          const processedOrders = saved.map((order: any) => ({
            ...order,
            createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
            updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date(),
            pickupDate: order.pickupDate ? new Date(order.pickupDate) : undefined
          }));
          
          setOrders(processedOrders);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast.error('Failed to load orders');
      }
    };

    loadOrders();
  }, []);

  const saveOrders = async (newOrders: Order[]): Promise<boolean> => {
    const success = DataPersistence.setItem('orders', newOrders, {
      useCache: true,
      cacheTimeout: 2 * 60 * 1000
    });

    if (success) {
      setOrders(newOrders);
    }

    return success;
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    return await execute(async () => {
      // Validate order data
      if (!order.tenantId || !order.customerName || !order.items.length) {
        throw new Error('Invalid order data: missing required fields');
      }

      const newOrder: Order = { 
        ...order, 
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newOrders = [...orders, newOrder];
      const success = await saveOrders(newOrders);
      
      if (!success) {
        throw new Error('Failed to save order');
      }

      toast.success('Order created successfully');
      return newOrder.id;
    });
  };

  const updateOrder = async (id: string, updates: Partial<Order>): Promise<boolean> => {
    return await execute(async () => {
      const orderIndex = orders.findIndex(order => order.id === id);
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = { 
        ...updatedOrders[orderIndex], 
        ...updates, 
        updatedAt: new Date() 
      };

      const success = await saveOrders(updatedOrders);
      
      if (!success) {
        throw new Error('Failed to update order');
      }

      toast.success('Order updated successfully');
      return true;
    }) !== null;
  };

  const deleteOrder = async (id: string): Promise<boolean> => {
    return await execute(async () => {
      const newOrders = orders.filter(order => order.id !== id);
      const success = await saveOrders(newOrders);
      
      if (!success) {
        throw new Error('Failed to delete order');
      }

      toast.success('Order deleted successfully');
      return true;
    }) !== null;
  };

  const getOrdersByTenant = (tenantId: string): Order[] => {
    return orders.filter(order => order.tenantId === tenantId);
  };

  const getTotalRevenue = (tenantId: string): number => {
    return getOrdersByTenant(tenantId).reduce((total, order) => total + order.total, 0);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    return await updateOrder(orderId, { status });
  };

  const getOrderStats = (tenantId: string): OrderStats => {
    const tenantOrders = getOrdersByTenant(tenantId);
    return {
      total: tenantOrders.length,
      pending: tenantOrders.filter(o => o.status === OrderStatus.PENDING).length,
      processing: tenantOrders.filter(o => o.status === OrderStatus.PROCESSING).length,
      completed: tenantOrders.filter(o => o.status === OrderStatus.DELIVERED).length,
      revenue: getTotalRevenue(tenantId)
    };
  };

  const refreshOrders = async (): Promise<void> => {
    await execute(async () => {
      const saved = DataPersistence.getItem<Order[]>('orders', {
        fallbackValue: []
      });
      
      if (saved) {
        const processedOrders = saved.map((order: any) => ({
          ...order,
          createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
          updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date(),
          pickupDate: order.pickupDate ? new Date(order.pickupDate) : undefined
        }));
        
        setOrders(processedOrders);
      }
    });
  };

  const value = {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrdersByTenant,
    getTotalRevenue,
    updateOrderStatus,
    getOrderStats,
    isLoading,
    error,
    refreshOrders
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}
