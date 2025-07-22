
import { useState, useMemo } from 'react';
import { OrderStatus } from '@/lib/mockData';

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  service: string;
}

interface Order {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export function useOrderFilters(orders: Order[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'customer'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order =>
        order.customerName.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange.from) {
      result = result.filter(order => order.createdAt >= dateRange.from!);
    }
    if (dateRange.to) {
      result = result.filter(order => order.createdAt <= dateRange.to!);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'customer':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [orders, searchQuery, statusFilter, dateRange, sortBy, sortDirection]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateRange({});
    setSortBy('date');
    setSortDirection('desc');
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    filteredOrders,
    resetFilters,
    hasActiveFilters: searchQuery || statusFilter !== "all" || dateRange.from || dateRange.to
  };
}
