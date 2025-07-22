
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  subscriptionStatus: "trial" | "active" | "expired" | "cancelled";
  trialEndsAt?: Date;
  createdAt: Date;
  email: string;
  contactEmail: string;
  phone: string;          
  address: string;
  isActive: boolean;
  subscriptionPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  whatsappNumber?: string;
  customDomain?: string;
  defaultCurrency?: string;
  defaultLanguage?: string;
  googleMapsApiKey?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
}

interface TenantContextType {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  updateTenant: (updates: Partial<Tenant>) => void;
  isTenantLoading: boolean;
  setIsTenantLoading: (loading: boolean) => void;
  tenants: Tenant[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [isTenantLoading, setIsTenantLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // Initialize with a default tenant to prevent context errors
  useEffect(() => {
    const initializeTenant = () => {
      // For demo purposes, create a default tenant
      const defaultTenant: Tenant = {
        id: "demo-tenant-1",
        name: "Demo Laundry Service",
        subdomain: "demo",
        slug: "fastwash",
        email: "demo@example.com",
        contactEmail: "contact@example.com",
        phone: "+1-555-0123",
        address: "123 Main St, Demo City, DC 12345",
        isActive: true,
        subscriptionStatus: "active",
        subscriptionPlan: "premium",
        createdAt: new Date(),
        primaryColor: "#0ea5e9",
        defaultCurrency: "USD",
        defaultLanguage: "en"
      };
      
      setCurrentTenant(defaultTenant);
      setTenants([defaultTenant]);
      setIsTenantLoading(false);
    };

    // Simulate loading time
    const timer = setTimeout(initializeTenant, 100);
    return () => clearTimeout(timer);
  }, []);

  const updateTenant = (updates: Partial<Tenant>) => {
    if (currentTenant) {
      setCurrentTenant({ ...currentTenant, ...updates });
    }
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        setCurrentTenant,
        updateTenant,
        isTenantLoading,
        setIsTenantLoading,
        tenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
