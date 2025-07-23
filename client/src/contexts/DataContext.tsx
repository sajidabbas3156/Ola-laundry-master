import React, { createContext, useContext, useState, useEffect } from 'react';

interface Order {
  id: number;
  customerId: number;
  totalAmount: string;
  status: string;
  itemCount: number;
  weight?: string;
  pickupDate?: Date;
  deliveryDate?: Date;
  paymentStatus: string;
  paymentMethod: string;
  instructions?: string;
  createdAt: Date;
  customer?: any;
  items?: any[];
}

interface DataContextType {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  refreshOrders: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token-123'}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  return (
    <DataContext.Provider value={{
      orders,
      setOrders,
      refreshOrders,
      loading,
      error
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};