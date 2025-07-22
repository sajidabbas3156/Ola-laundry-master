
import { useState, useMemo, useCallback } from 'react';
import { useOrders } from '@/contexts/OrdersContext';
import { useDrivers } from '@/contexts/DriversContext';
import { useTenant } from '@/contexts/TenantContext';
import { cacheManager } from '@/utils/CacheManager';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'order' | 'customer' | 'product' | 'integration' | 'campaign';
  route: string;
  score: number;
}

export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { orders } = useOrders();
  const { drivers } = useDrivers();
  const { currentTenant } = useTenant();

  const searchResults = useMemo(() => {
    if (!query.trim() || !currentTenant) return [];

    const cacheKey = `search_${currentTenant.id}_${query}`;
    const cached = cacheManager.get<SearchResult[]>(cacheKey);
    if (cached) return cached;

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search orders
    const tenantOrders = orders.filter(order => order.tenantId === currentTenant.id);
    tenantOrders.forEach(order => {
      const orderText = `${order.id} ${order.customerName} ${order.status}`.toLowerCase();
      if (orderText.includes(searchTerm)) {
        results.push({
          id: order.id,
          title: `Order #${order.id}`,
          description: `Customer: ${order.customerName} - Status: ${order.status}`,
          type: 'order',
          route: `/tenant/${currentTenant.slug}/orders`,
          score: orderText.indexOf(searchTerm) === 0 ? 100 : 50
        });
      }
    });

    // Search drivers
    const tenantDrivers = drivers.filter(driver => driver.tenantId === currentTenant.id);
    tenantDrivers.forEach(driver => {
      const driverText = `${driver.name} ${driver.phone} ${driver.email}`.toLowerCase();
      if (driverText.includes(searchTerm)) {
        results.push({
          id: driver.id,
          title: driver.name,
          description: `Driver - ${driver.phone} - Status: ${driver.status}`,
          type: 'customer',
          route: `/tenant/${currentTenant.slug}/delivery`,
          score: driverText.indexOf(searchTerm) === 0 ? 100 : 50
        });
      }
    });

    // Sort by score
    results.sort((a, b) => b.score - a.score);
    
    cacheManager.set(cacheKey, results, 2 * 60 * 1000); // 2 minute cache
    return results;
  }, [query, orders, drivers, currentTenant]);

  const performSearch = useCallback((searchQuery: string) => {
    setIsSearching(true);
    setQuery(searchQuery);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  }, []);

  return {
    query,
    searchResults,
    isSearching,
    performSearch,
    clearSearch: () => setQuery('')
  };
}
