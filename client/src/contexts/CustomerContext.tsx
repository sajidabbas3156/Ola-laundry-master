import React, { createContext, useContext, useState } from 'react';

interface Customer {
  id: number;
  userId?: number;
  address?: string;
  city?: string;
  zipCode?: string;
  preferences?: any;
  loyaltyPoints?: number;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

interface CustomerContextType {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setCustomers: (customers: Customer[]) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  refreshCustomers: () => Promise<void>;
  loading: boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token-123'}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      selectedCustomer,
      setCustomers,
      setSelectedCustomer,
      refreshCustomers,
      loading
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};