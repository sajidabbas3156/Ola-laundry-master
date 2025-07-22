
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'offline';
  assignedOrders: string[];
  vehicleInfo: {
    type: string;
    plate: string;
  };
  tenantId: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface DeliveryRoute {
  id: string;
  driverId: string;
  orders: string[];
  optimizedRoute: {
    orderId: string;
    address: string;
    estimatedTime: number;
  }[];
  status: 'pending' | 'in-progress' | 'completed';
  estimatedTime: number;
  actualTime?: number;
  startTime?: Date;
  endTime?: Date;
}

interface DriversContextType {
  drivers: Driver[];
  routes: DeliveryRoute[];
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  removeDriver: (id: string) => void;
  getDriversByTenant: (tenantId: string) => Driver[];
  assignOrdersToDriver: (driverId: string, orderIds: string[]) => void;
  optimizeRoute: (driverId: string) => DeliveryRoute | null;
  updateRoute: (routeId: string, updates: Partial<DeliveryRoute>) => void;
  getDriverStats: (tenantId: string) => any;
}

const DriversContext = createContext<DriversContextType | undefined>(undefined);

export const useDrivers = () => {
  const context = useContext(DriversContext);
  if (!context) {
    throw new Error('useDrivers must be used within a DriversProvider');
  }
  return context;
};

export function DriversProvider({ children }: { children: React.ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('drivers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [routes, setRoutes] = useState<DeliveryRoute[]>(() => {
    const saved = localStorage.getItem('routes');
    if (saved) {
      try {
        return JSON.parse(saved).map((route: any) => ({
          ...route,
          startTime: route.startTime ? new Date(route.startTime) : undefined,
          endTime: route.endTime ? new Date(route.endTime) : undefined
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('routes', JSON.stringify(routes));
  }, [routes]);

  const addDriver = (driver: Omit<Driver, 'id'>) => {
    const newDriver: Driver = { ...driver, id: Date.now().toString() };
    setDrivers(prev => [...prev, newDriver]);
  };

  const updateDriver = (id: string, updates: Partial<Driver>) => {
    setDrivers(prev => prev.map(driver => driver.id === id ? { ...driver, ...updates } : driver));
  };

  const removeDriver = (id: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== id));
  };

  const getDriversByTenant = (tenantId: string) => {
    return drivers.filter(driver => driver.tenantId === tenantId);
  };

  const assignOrdersToDriver = (driverId: string, orderIds: string[]) => {
    updateDriver(driverId, { 
      assignedOrders: [...drivers.find(d => d.id === driverId)?.assignedOrders || [], ...orderIds],
      status: 'busy'
    });
  };

  const optimizeRoute = (driverId: string): DeliveryRoute | null => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver || driver.assignedOrders.length === 0) return null;

    const optimizedRoute = driver.assignedOrders.map((orderId, index) => ({
      orderId,
      address: 'Address not provided',
      estimatedTime: (index + 1) * 15
    }));

    const newRoute: DeliveryRoute = {
      id: Date.now().toString(),
      driverId,
      orders: driver.assignedOrders,
      optimizedRoute,
      status: 'pending',
      estimatedTime: optimizedRoute.reduce((total, stop) => total + stop.estimatedTime, 0)
    };

    setRoutes(prev => [...prev, newRoute]);
    return newRoute;
  };

  const updateRoute = (routeId: string, updates: Partial<DeliveryRoute>) => {
    setRoutes(prev => prev.map(route => route.id === routeId ? { ...route, ...updates } : route));
  };

  const getDriverStats = (tenantId: string) => {
    const tenantDrivers = getDriversByTenant(tenantId);
    return {
      total: tenantDrivers.length,
      available: tenantDrivers.filter(d => d.status === 'available').length,
      busy: tenantDrivers.filter(d => d.status === 'busy').length,
      offline: tenantDrivers.filter(d => d.status === 'offline').length
    };
  };

  const value = {
    drivers,
    routes,
    addDriver,
    updateDriver,
    removeDriver,
    getDriversByTenant,
    assignOrdersToDriver,
    optimizeRoute,
    updateRoute,
    getDriverStats
  };

  return <DriversContext.Provider value={value}>{children}</DriversContext.Provider>;
}
