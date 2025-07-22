import { useAuth, USER_ROLES } from "@/hooks/use-auth";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  Building, 
  Package, 
  Truck, 
  CreditCard,
  BarChart3,
  Shirt,
  Monitor,
  Smartphone,
  LogOut,
  Tag,
  Bell,
  TrendingUp,
  Archive
} from "lucide-react";

export function RoleDashboard() {
  const { user, role, displayName, canAccessAdminDashboard, canAccessPOS, canAccessDelivery } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case USER_ROLES.SUPER_ADMIN: return "bg-red-500";
      case USER_ROLES.ORG_OWNER: return "bg-purple-500";
      case USER_ROLES.BRANCH_MANAGER: return "bg-blue-500";
      case USER_ROLES.INVENTORY_MANAGER: return "bg-green-500";
      case USER_ROLES.LAUNDRY_STAFF: return "bg-orange-500";
      case USER_ROLES.CASHIER: return "bg-teal-500";
      case USER_ROLES.DELIVERY_AGENT: return "bg-indigo-500";
      default: return "bg-gray-500";
    }
  };

  const getRoleName = (userRole: string) => {
    return userRole.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LaundryPro SaaS</h1>
              <p className="text-sm text-gray-600">Multi-Tenant Laundry Management Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-medium text-gray-900">{displayName}</div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getRoleColor(role || '')} text-white`}>
                    {getRoleName(role || '')}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back, {displayName}!</h2>
          <p className="text-gray-600">
            Access your role-specific tools and manage your laundry operations efficiently.
          </p>
        </div>

        {/* Application Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Admin Dashboard - For management roles */}
          <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_OWNER, USER_ROLES.BRANCH_MANAGER, USER_ROLES.INVENTORY_MANAGER]}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin'}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Monitor className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Admin Dashboard</CardTitle>
                    <CardDescription>Comprehensive management interface</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics & Reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>User Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>System Configuration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          {/* Mobile POS - For cashiers and staff */}
          <RoleGuard allowedRoles={[USER_ROLES.CASHIER, USER_ROLES.LAUNDRY_STAFF, USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER]}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/pos'}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Smartphone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mobile POS</CardTitle>
                    <CardDescription>Point of sale for order processing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shirt className="w-4 h-4" />
                    <span>Service Selection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Customer Management</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          {/* Customer App - For all roles to see customer view */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/customer'}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Customer App</CardTitle>
                  <CardDescription>Mobile app for customer orders</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Place Orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Order Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Management</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery App - For delivery agents and managers */}
          <RoleGuard allowedRoles={[USER_ROLES.DELIVERY_AGENT, USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER]}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/delivery'}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Truck className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Delivery App</CardTitle>
                    <CardDescription>Route management and tracking</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>Route Optimization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Delivery Tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Performance Metrics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          {/* Inventory Management */}
          <RoleGuard allowedRoles={[USER_ROLES.INVENTORY_MANAGER, USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER]}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/inventory'}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Archive className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Inventory Management</CardTitle>
                    <CardDescription>Stock tracking and management</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Stock Levels</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Low Stock Alerts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Usage Analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          {/* Promotions Management */}
          <RoleGuard allowedRoles={[USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER]}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/promotions'}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Tag className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Promotions & Offers</CardTitle>
                    <CardDescription>Marketing and discount campaigns</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Discount Codes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Customer Targeting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Campaign Performance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          {/* Analytics Dashboard */}
          <RoleGuard allowedRoles={[USER_ROLES.BRANCH_MANAGER, USER_ROLES.ORG_OWNER, USER_ROLES.SUPER_ADMIN]}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/analytics'}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
                    <CardDescription>Business insights and reports</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Revenue Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Customer Insights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Performance Metrics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          {/* Notification Center */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/notifications'}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Notification Center</CardTitle>
                  <CardDescription>System alerts and messages</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>System Alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>User Messages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Notification Settings</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Super Admin Only - Organization Management */}
          <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Building className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Platform Management</CardTitle>
                    <CardDescription>Multi-tenant administration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Organization Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Global User Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Platform Analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

        </div>

        {/* Role-specific Quick Actions */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <RoleGuard requiredPermission="create_orders">
              <Button variant="outline" className="h-16 flex-col">
                <Package className="w-5 h-5 mb-1" />
                <span className="text-sm">New Order</span>
              </Button>
            </RoleGuard>

            <RoleGuard requiredPermission="manage_customers">
              <Button variant="outline" className="h-16 flex-col">
                <Users className="w-5 h-5 mb-1" />
                <span className="text-sm">Add Customer</span>
              </Button>
            </RoleGuard>

            <RoleGuard requiredPermission="view_reports">
              <Button variant="outline" className="h-16 flex-col">
                <BarChart3 className="w-5 h-5 mb-1" />
                <span className="text-sm">View Reports</span>
              </Button>
            </RoleGuard>

            <RoleGuard requiredPermission="manage_inventory">
              <Button variant="outline" className="h-16 flex-col">
                <Package className="w-5 h-5 mb-1" />
                <span className="text-sm">Inventory</span>
              </Button>
            </RoleGuard>

          </div>
        </div>
      </div>
    </div>
  );
}