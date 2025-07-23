import React, { createContext, useContext, useState } from 'react';

interface LocalizationContextType {
  language: string;
  currency: string;
  setLanguage: (lang: string) => void;
  setCurrency: (curr: string) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Simple translations for key terms
const translations: Record<string, Record<string, string>> = {
  en: {
    'dashboard': 'Dashboard',
    'orders': 'Orders',
    'customers': 'Customers',
    'inventory': 'Inventory',
    'reports': 'Reports',
    'settings': 'Settings',
    'logout': 'Logout',
    'welcome': 'Welcome',
    'total_revenue': 'Total Revenue',
    'pending_orders': 'Pending Orders',
    'active_customers': 'Active Customers',
  },
  ar: {
    'dashboard': 'لوحة التحكم',
    'orders': 'الطلبات',
    'customers': 'العملاء',
    'inventory': 'المخزون',
    'reports': 'التقارير',
    'settings': 'الإعدادات',
    'logout': 'تسجيل الخروج',
    'welcome': 'مرحباً',
    'total_revenue': 'إجمالي الإيرادات',
    'pending_orders': 'الطلبات المعلقة',
    'active_customers': 'العملاء النشطون',
  }
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('BHD');

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    const formatter = new Intl.NumberFormat('en-BH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  return (
    <LocalizationContext.Provider value={{
      language,
      currency,
      setLanguage,
      setCurrency,
      t,
      formatCurrency
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};