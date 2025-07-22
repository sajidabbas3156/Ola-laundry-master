
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockTenants, mockOrders, mockCustomers } from "@/lib/mockData";

export default function AdminTenants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter tenants based on search and status
  const filteredTenants = mockTenants.filter(tenant => 
    (statusFilter === "all" || tenant.subscriptionStatus === statusFilter) &&
    (searchQuery === "" || 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Calculate subscription status counts
  const activeTenants = mockTenants.filter(tenant => tenant.subscriptionStatus === "active").length;
  const trialTenants = mockTenants.filter(tenant => tenant.subscriptionStatus === "trial").length;
  const expiredTenants = mockTenants.filter(tenant => tenant.subscriptionStatus === "expired").length;
  
  // Calculate tenant-specific stats
  const getTenantStats = (tenantId: string) => {
    const tenantOrders = mockOrders.filter(order => order.tenantId === tenantId);
    const tenantCustomers = mockCustomers.filter(customer => customer.tenantId === tenantId);
    
    return {
      orders: tenantOrders.length,
      customers: tenantCustomers.length,
      revenue: tenantOrders.reduce((sum, order) => sum + order.total, 0)
    };
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              placeholder="Search tenants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Button>Add New Tenant</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">Subdomain</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Created</th>
                  <th className="py-3 px-4 text-left font-medium">Customers</th>
                  <th className="py-3 px-4 text-left font-medium">Orders</th>
                  <th className="py-3 px-4 text-left font-medium">Revenue</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTenants.map(tenant => {
                  const stats = getTenantStats(tenant.id);
                  
                  return (
                    <tr key={tenant.id}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {tenant.logo ? (
                            <img 
                              src={tenant.logo} 
                              alt={`${tenant.name} logo`} 
                              className="h-8 w-8 object-cover rounded" 
                            />
                          ) : (
                            <div className="h-8 w-8 bg-ola-600 rounded flex items-center justify-center text-white font-bold">
                              {tenant.name.charAt(0)}
                            </div>
                          )}
                          {tenant.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <a 
                          href={`https://${tenant.subdomain}.olaorders.site`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-ola-600 hover:underline"
                        >
                          {tenant.subdomain}.olaorders.site
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`font-normal ${
                          tenant.subscriptionStatus === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                          tenant.subscriptionStatus === "trial" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                          "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}>
                          {tenant.subscriptionStatus.charAt(0).toUpperCase() + tenant.subscriptionStatus.slice(1)}
                        </Badge>
                        {tenant.subscriptionStatus === "trial" && tenant.trialEndsAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            Trial ends: {formatDate(tenant.trialEndsAt)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">{formatDate(tenant.createdAt)}</td>
                      <td className="py-3 px-4">{stats.customers}</td>
                      <td className="py-3 px-4">{stats.orders}</td>
                      <td className="py-3 px-4">{formatCurrency(stats.revenue)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTenants.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      {searchQuery || statusFilter !== "all" 
                        ? "No tenants matching your filters" 
                        : "No tenants found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Active Subscriptions</h3>
                  <p className="text-sm text-gray-500">Paying customers</p>
                </div>
                <div className="text-xl font-bold">{activeTenants}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Trial Subscriptions</h3>
                  <p className="text-sm text-gray-500">Currently in trial period</p>
                </div>
                <div className="text-xl font-bold">{trialTenants}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Expired Subscriptions</h3>
                  <p className="text-sm text-gray-500">Subscription ended</p>
                </div>
                <div className="text-xl font-bold">{expiredTenants}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">New tenant registered</p>
                    <p className="text-sm text-gray-500">Fresh Fold Services created an account</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Subscription payment received</p>
                    <p className="text-sm text-gray-500">Clean Drop Laundry - Professional plan</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Yesterday</p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Subscription expired</p>
                    <p className="text-sm text-gray-500">Bright Wash failed to renew</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">1 week ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
