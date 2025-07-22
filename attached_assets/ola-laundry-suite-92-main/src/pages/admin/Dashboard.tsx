
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTenants, mockOrders, mockCustomers } from "@/lib/mockData";

// Import recharts for the graphs
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  // Calculate tenant statistics
  const totalTenants = mockTenants.length;
  const activeTenants = mockTenants.filter(t => t.subscriptionStatus === "active").length;
  const trialTenants = mockTenants.filter(t => t.subscriptionStatus === "trial").length;
  const expiredTenants = mockTenants.filter(t => t.subscriptionStatus === "expired").length;
  
  // Calculate total revenue - in a real app this would be from actual subscription data
  const monthlyRevenue = activeTenants * 59; // Assuming $59 per tenant
  
  // Example tenant data by month for the chart
  const tenantGrowthData = [
    { name: 'Jan', count: 1 },
    { name: 'Feb', count: 2 },
    { name: 'Mar', count: 3 },
    { name: 'Apr', count: 4 },
    { name: 'May', count: totalTenants },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {activeTenants} active, {trialTenants} trial, {expiredTenants} expired
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(monthlyRevenue * 12)} annual run rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalTenants} tenants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
            <p className="text-xs text-muted-foreground">
              Avg. {Math.round(mockCustomers.length / Math.max(totalTenants, 1))} per tenant
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tenant Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenantGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Tenant Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTenants.map((tenant) => (
                <div key={tenant.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {tenant.logo ? (
                        <img 
                          src={tenant.logo} 
                          alt={`${tenant.name} logo`} 
                          className="h-10 w-10 object-cover rounded" 
                        />
                      ) : (
                        <div className="h-10 w-10 bg-ola-600 rounded flex items-center justify-center text-white font-bold">
                          {tenant.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-gray-500">{tenant.subdomain}.olaorders.site</p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        tenant.subscriptionStatus === "active" ? "bg-green-100 text-green-800" :
                        tenant.subscriptionStatus === "trial" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {tenant.subscriptionStatus.charAt(0).toUpperCase() + tenant.subscriptionStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
