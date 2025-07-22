
import { type Order } from "@/lib/mockData";
import { type Customer } from "@/lib/mockData";
import { QuickStats } from "./QuickStats";
import { DashboardStats } from "./DashboardStats";
import { RecentOrders } from "./RecentOrders";
import { RecentCustomers } from "./RecentCustomers";
import { OrderStatusChart } from "./OrderStatusChart";

interface OverviewContentProps {
  orders: Order[];
  customers: Customer[];
  totalRevenue: number;
  pendingOrders: number;
}

export function OverviewContent({ orders, customers, totalRevenue, pendingOrders }: OverviewContentProps) {
  return (
    <>
      <QuickStats 
        totalRevenue={totalRevenue}
        pendingOrders={pendingOrders}
        customerCount={customers.length}
      />
      
      <DashboardStats orders={orders} customerCount={customers.length} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={orders} />
        <RecentCustomers customers={customers} />
      </div>
      
      <OrderStatusChart orders={orders} />
    </>
  );
}
