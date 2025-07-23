import React, { createContext, useContext, useState } from 'react';

interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'online' | 'offline' | 'busy';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  assignedOrders: any[];
}

interface DriversContextType {
  drivers: Driver[];
  selectedDriver: Driver | null;
  setDrivers: (drivers: Driver[]) => void;
  setSelectedDriver: (driver: Driver | null) => void;
  updateDriverLocation: (driverId: number, location: { latitude: number; longitude: number }) => void;
  updateDriverStatus: (driverId: number, status: 'online' | 'offline' | 'busy') => void;
}

const DriversContext = createContext<DriversContextType | undefined>(undefined);

export const DriversProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 1,
      name: "Ahmed Al-Khalifa",
      email: "ahmed.driver@ola-laundry.bh",
      phone: "+973-3311-1234",
      status: 'online',
      currentLocation: { latitude: 26.2285, longitude: 50.5860 },
      assignedOrders: []
    },
    {
      id: 2,
      name: "Mohamed Hassan",
      email: "mohamed.driver@ola-laundry.bh", 
      phone: "+973-3322-5678",
      status: 'offline',
      currentLocation: { latitude: 26.2041, longitude: 50.5712 },
      assignedOrders: []
    }
  ]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const updateDriverLocation = (driverId: number, location: { latitude: number; longitude: number }) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, currentLocation: location }
        : driver
    ));
  };

  const updateDriverStatus = (driverId: number, status: 'online' | 'offline' | 'busy') => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, status }
        : driver
    ));
  };

  return (
    <DriversContext.Provider value={{
      drivers,
      selectedDriver,
      setDrivers,
      setSelectedDriver,
      updateDriverLocation,
      updateDriverStatus
    }}>
      {children}
    </DriversContext.Provider>
  );
};

export const useDrivers = () => {
  const context = useContext(DriversContext);
  if (!context) {
    throw new Error('useDrivers must be used within a DriversProvider');
  }
  return context;
};