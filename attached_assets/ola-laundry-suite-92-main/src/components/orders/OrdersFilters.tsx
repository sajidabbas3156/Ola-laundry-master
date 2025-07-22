
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@/lib/mockData";

interface OrdersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export function OrdersFilters({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Input
        placeholder="Search orders... (Alt+N)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 min-h-[44px]"
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={OrderStatus.RECEIVED}>Received</SelectItem>
          <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
          <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
          <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
          <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
