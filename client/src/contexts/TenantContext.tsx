import React, { createContext, useContext, useState, useEffect } from 'react';

interface Tenant {
  id: number;
  name: string;
  slug: string;
  subdomain: string;
  logo?: string;
  primaryColor?: string;
  settings: any;
}

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load tenant data based on subdomain or slug
    const loadTenant = async () => {
      try {
        // Default tenant for development
        const defaultTenant: Tenant = {
          id: 1,
          name: "OLA LAUNDRY MASTER",
          slug: "ola-laundry",
          subdomain: "ola-laundry",
          logo: "/logo.png",
          primaryColor: "#3b82f6",
          settings: {
            currency: "BHD",
            language: "en",
            timezone: "Asia/Bahrain"
          }
        };
        
        setTenant(defaultTenant);
      } catch (error) {
        console.error('Failed to load tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, setTenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};