
import { useState, useMemo } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { useOrders } from "@/contexts/OrdersContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatus } from "@/lib/mockData";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/sonner";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { EnhancedLoadingState, NetworkStatusIndicator } from "@/components/ui/enhanced-loading-states";
import { useOrderFilters } from "@/hooks/useOrderFilters";

export default function TenantOrders() {
  const { currentTenant } = useTenant();
  const { getOrdersByTenant, updateOrderStatus, isLoading, error, refreshOrders } = useOrders();
  const { formatCurrency } = useLocalization();
  const isMobile = useIsMobile();

  console.log("TenantOrders - Component initialized:");
  console.log("- Current tenant:", currentTenant?.name);
  console.log("- Is loading:", isLoading);
  console.log("- Error:", error);

  useKeyboardShortcuts();

  const allOrders = currentTenant?.id ? getOrdersByTenant(currentTenant.id) : [];
  console.log("TenantOrders - All orders for tenant:", allOrders.length);
  
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredOrders,
    hasActiveFilters,
    resetFilters
  } = useOrderFilters(allOrders);

  console.log("TenantOrders - Filtered orders:", filteredOrders.length);
  console.log("TenantOrders - Active filters:", { searchQuery, statusFilter, hasActiveFilters });

  const handleRefresh = async () => {
    console.log("TenantOrders - Refreshing orders");
    try {
      await refreshOrders();
      console.log("TenantOrders - Orders refreshed successfully");
      toast.success("Orders refreshed successfully!");
    } catch (error) {
      console.error("TenantOrders - Refresh failed:", error);
      toast.error("Failed to refresh orders");
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.RECEIVED:
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.READY:
        return "bg-green-100 text-green-800";
      case OrderStatus.DELIVERED:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    console.log("TenantOrders - Updating order status:", { orderId, newStatus });
    try {
      const success = await updateOrderStatus(orderId, newStatus as OrderStatus);
      if (success) {
        console.log("TenantOrders - Status updated successfully");
        toast.success("Order status updated successfully");
      } else {
        console.error("TenantOrders - Status update failed");
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error('TenantOrders - Status update error:', error);
      toast.error("Failed to update order status");
    }
  };

  const content = (
    <ErrorBoundary>
      <NetworkStatusIndicator />
      
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all your laundry orders
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              View and update the status of all orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            <EnhancedLoadingState
              isLoading={isLoading}
              error={error ? new Error(error) : null}
              isEmpty={filteredOrders.length === 0 && !hasActiveFilters}
              onRetry={handleRefresh}
              emptyComponent={
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Orders from POS and Storefront will appear here
                  </p>
                </div>
              }
            >
              <OrdersTable
                orders={filteredOrders}
                isLoading={isLoading}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                formatCurrency={formatCurrency}
                onStatusUpdate={handleStatusUpdate}
                getStatusColor={getStatusColor}
              />
            </EnhancedLoadingState>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );

  if (isMobile) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        {content}
      </PullToRefresh>
    );
  }

  return content;
}
