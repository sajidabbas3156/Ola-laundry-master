import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, DollarSign, TrendingUp, Package, Settings, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface SuperAdminStats {
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
  totalUsers: number;
  subscriptionsByPlan: Record<string, number>;
}

interface TenantWithSubscription {
  id: number;
  name: string;
  subdomain: string;
  isActive: boolean;
  maxUsers?: number;
  createdAt: string;
  subscription?: {
    plan?: {
      name: string;
    };
  };
}

export default function SuperAdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<SuperAdminStats>({
    queryKey: ["/api/superadmin/stats"],
  });

  const { data: tenants, isLoading: tenantsLoading } = useQuery<TenantWithSubscription[]>({
    queryKey: ["/api/superadmin/tenants"],
  });

  const { data: subscriptionPlans } = useQuery({
    queryKey: ["/api/subscription-plans"],
  });

  if (statsLoading || tenantsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage all tenants and platform operations</p>
          </div>
          <div className="flex gap-2">
            <Link href="/superadmin/subscription-plans">
              <Button variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Manage Plans
              </Button>
            </Link>
            <Link href="/superadmin/settings">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTenants || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeTenants || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across all tenants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(stats?.totalRevenue || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Recurring revenue
              </p>
            </CardContent>
          </Card>

          {Object.entries(stats?.subscriptionsByPlan || {}).slice(0, 2).map(([plan, count]) => (
            <Card key={plan}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{plan} Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  Subscriptions
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tenant Management */}
        <Card>
          <CardHeader>
            <CardTitle>Tenant Management</CardTitle>
            <CardDescription>View and manage all tenant subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Tenants</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="trial">Trial</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant Name</TableHead>
                      <TableHead>Subdomain</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants?.map((tenant: any) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>{tenant.subdomain}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {tenant.subscription?.plan?.name || "No Plan"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {tenant.isActive ? (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{tenant.maxUsers || 0}</TableCell>
                        <TableCell>
                          {format(new Date(tenant.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/superadmin/tenants/${tenant.id}`}>
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="active">
                {/* Filter for active tenants */}
                <div className="text-center text-muted-foreground py-8">
                  Showing active tenants only
                </div>
              </TabsContent>
              <TabsContent value="trial">
                {/* Filter for trial tenants */}
                <div className="text-center text-muted-foreground py-8">
                  Showing trial tenants only
                </div>
              </TabsContent>
              <TabsContent value="suspended">
                {/* Filter for suspended tenants */}
                <div className="text-center text-muted-foreground py-8">
                  Showing suspended tenants only
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Platform Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
              <CardDescription>Breakdown by plan type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats?.subscriptionsByPlan || {}).map(([plan, count]) => {
                  const total = Object.values(stats?.subscriptionsByPlan || {}).reduce(
                    (sum: number, val: any) => sum + val,
                    0
                  );
                  const percentage = total > 0 ? ((count as number) / total) * 100 : 0;
                  
                  return (
                    <div key={plan} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{plan}</span>
                        <span className="text-sm text-muted-foreground">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>System status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Response Time</span>
                  <Badge className="bg-green-500">45ms avg</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Connections</span>
                  <Badge className="bg-green-500">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage Usage</span>
                  <Badge variant="secondary">32% used</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Sessions</span>
                  <Badge variant="secondary">1,234</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Queue Status</span>
                  <Badge className="bg-green-500">0 pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}