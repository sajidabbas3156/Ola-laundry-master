
import { createContext, useContext, useState, ReactNode } from "react";
import { Customer } from "@/lib/mockData";
import { useTenant } from "./TenantContext";
import { toast } from "@/components/ui/sonner";

interface EnhancedCustomer extends Customer {
  customerType?: "regular" | "premium" | "vip";
  loyaltyPoints?: number;
  walletBalance?: number;
  coupons?: string[];
  address: string; // Make this required to match Customer interface
}

interface CustomerContextType {
  customers: EnhancedCustomer[];
  addCustomer: (customer: Omit<EnhancedCustomer, 'id' | 'createdAt'>) => EnhancedCustomer;
  updateCustomer: (id: string, customer: Partial<EnhancedCustomer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomersByTenant: (tenantId: string) => EnhancedCustomer[];
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<EnhancedCustomer[]>(() => {
    // Load customers from localStorage if available
    const savedCustomers = localStorage.getItem("olaundry_customers");
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  });

  const saveToStorage = (updatedCustomers: EnhancedCustomer[]) => {
    localStorage.setItem("olaundry_customers", JSON.stringify(updatedCustomers));
  };

  const addCustomer = (customerData: Omit<EnhancedCustomer, 'id' | 'createdAt'>): EnhancedCustomer => {
    const newCustomer: EnhancedCustomer = {
      ...customerData,
      id: `customer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      customerType: customerData.customerType || "regular",
      loyaltyPoints: customerData.loyaltyPoints || 0,
      walletBalance: customerData.walletBalance || 0,
      coupons: customerData.coupons || [],
      address: customerData.address || "" // Ensure address is always a string
    };

    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    saveToStorage(updatedCustomers);
    toast.success("Customer added successfully!");
    
    return newCustomer;
  };

  const updateCustomer = (id: string, customerData: Partial<EnhancedCustomer>) => {
    const updatedCustomers = customers.map(customer =>
      customer.id === id ? { ...customer, ...customerData } : customer
    );
    setCustomers(updatedCustomers);
    saveToStorage(updatedCustomers);
    toast.success("Customer updated successfully!");
  };

  const deleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
    saveToStorage(updatedCustomers);
    toast.success("Customer deleted successfully!");
  };

  const getCustomersByTenant = (tenantId: string) => {
    return customers.filter(customer => customer.tenantId === tenantId);
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      getCustomersByTenant
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
}
