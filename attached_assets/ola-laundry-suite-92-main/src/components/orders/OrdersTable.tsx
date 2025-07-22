
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@/lib/mockData";
import { EmptyState } from "@/components/ui/loading-states";
import { ShoppingCart } from "lucide-react";

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

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  formatCurrency: (amount: number) => string;
  onStatusUpdate: (orderId: string, status: string) => void;
  getStatusColor: (status: OrderStatus) => string;
}

export function OrdersTable({ 
  orders, 
  isLoading, 
  searchQuery, 
  statusFilter, 
  formatCurrency, 
  onStatusUpdate, 
  getStatusColor 
}: OrdersTableProps) {
  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-sm">
                {order.id}
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(order.total)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {order.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) => onStatusUpdate(order.id, value as OrderStatus)}
                >
                  <SelectTrigger className="w-32 min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={OrderStatus.RECEIVED}>Received</SelectItem>
                    <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                    <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
                    <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                    <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="p-0">
                <EmptyState
                  title="No orders found"
                  description={
                    searchQuery || statusFilter !== "all" 
                      ? "No orders match your filters" 
                      : "No orders found. Orders from POS and Storefront will appear here."
                  }
                  icon={<ShoppingCart className="h-12 w-12 text-gray-400" />}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
