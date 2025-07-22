
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Key, Lock, CheckCircle, XCircle } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: "pos" | "inventory" | "reports" | "customers" | "delivery" | "admin" | "settings";
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  tenantLevel: boolean;
  color: string;
}

interface UserType {
  id: string;
  name: string;
  role: string;
  tenantId?: string;
  scope: "global" | "tenant" | "limited";
}

const PERMISSIONS: Permission[] = [
  { id: "pos_access", name: "POS Access", description: "Access point of sale system", category: "pos" },
  { id: "pos_process_orders", name: "Process Orders", description: "Create and process orders", category: "pos" },
  { id: "pos_refunds", name: "Process Refunds", description: "Handle refunds and cancellations", category: "pos" },
  { id: "inventory_view", name: "View Inventory", description: "View inventory items and stock", category: "inventory" },
  { id: "inventory_manage", name: "Manage Inventory", description: "Add, edit, delete inventory items", category: "inventory" },
  { id: "reports_view", name: "View Reports", description: "Access business reports", category: "reports" },
  { id: "reports_export", name: "Export Reports", description: "Export reports to various formats", category: "reports" },
  { id: "customers_view", name: "View Customers", description: "View customer information", category: "customers" },
  { id: "customers_manage", name: "Manage Customers", description: "Add, edit customer details", category: "customers" },
  { id: "delivery_track", name: "Track Deliveries", description: "View delivery status", category: "delivery" },
  { id: "delivery_manage", name: "Manage Deliveries", description: "Assign drivers, optimize routes", category: "delivery" },
  { id: "admin_users", name: "User Management", description: "Manage user accounts", category: "admin" },
  { id: "admin_tenants", name: "Tenant Management", description: "Manage tenant accounts", category: "admin" },
  { id: "settings_view", name: "View Settings", description: "View system settings", category: "settings" },
  { id: "settings_manage", name: "Manage Settings", description: "Modify system settings", category: "settings" },
];

const ROLES: Role[] = [
  {
    id: "super_admin",
    name: "Super Administrator",
    description: "Full platform access across all tenants",
    permissions: PERMISSIONS.map(p => p.id),
    tenantLevel: false,
    color: "#EF4444"
  },
  {
    id: "tenant_admin",
    name: "Tenant Administrator",
    description: "Full access within tenant scope",
    permissions: PERMISSIONS.filter(p => p.category !== "admin").map(p => p.id),
    tenantLevel: true,
    color: "#8B5CF6"
  },
  {
    id: "manager",
    name: "Manager",
    description: "Operational management access",
    permissions: ["pos_access", "pos_process_orders", "pos_refunds", "inventory_view", "inventory_manage", "reports_view", "customers_view", "customers_manage", "delivery_track", "delivery_manage", "settings_view"],
    tenantLevel: true,
    color: "#10B981"
  },
  {
    id: "staff_pos",
    name: "POS Staff",
    description: "Point of sale operations only",
    permissions: ["pos_access", "pos_process_orders", "customers_view", "inventory_view"],
    tenantLevel: true,
    color: "#3B82F6"
  },
  {
    id: "staff_delivery",
    name: "Delivery Staff",
    description: "Delivery operations access",
    permissions: ["delivery_track", "customers_view"],
    tenantLevel: true,
    color: "#F59E0B"
  },
  {
    id: "staff_inventory",
    name: "Inventory Staff",
    description: "Inventory management access",
    permissions: ["inventory_view", "inventory_manage"],
    tenantLevel: true,
    color: "#EC4899"
  }
];

const USER_TYPES: UserType[] = [
  { id: "super1", name: "Platform Admin", role: "super_admin", scope: "global" },
  { id: "tenant1", name: "Tenant Admin (Demo)", role: "tenant_admin", tenantId: "demo", scope: "tenant" },
  { id: "manager1", name: "Store Manager", role: "manager", tenantId: "demo", scope: "tenant" },
  { id: "pos1", name: "Cashier", role: "staff_pos", tenantId: "demo", scope: "limited" },
  { id: "delivery1", name: "Driver", role: "staff_delivery", tenantId: "demo", scope: "limited" },
];

export function RBACVisualization() {
  const [selectedRole, setSelectedRole] = useState<string>("tenant_admin");
  const [selectedUser, setSelectedUser] = useState<string>("tenant1");

  const selectedRoleData = ROLES.find(r => r.id === selectedRole);
  const selectedUserData = USER_TYPES.find(u => u.id === selectedUser);

  const getPermissionsByCategory = (permissions: string[]) => {
    const categorized: Record<string, Permission[]> = {};
    permissions.forEach(permId => {
      const perm = PERMISSIONS.find(p => p.id === permId);
      if (perm) {
        if (!categorized[perm.category]) {
          categorized[perm.category] = [];
        }
        categorized[perm.category].push(perm);
      }
    });
    return categorized;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role-Based Access Control (RBAC) Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="users">User Access Matrix</TabsTrigger>
              <TabsTrigger value="security">Security Boundaries</TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Role Selection */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Available Roles
                  </h3>
                  <div className="space-y-2">
                    {ROLES.map(role => (
                      <Button
                        key={role.id}
                        variant={selectedRole === role.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedRole(role.id)}
                        style={{ 
                          backgroundColor: selectedRole === role.id ? role.color : undefined,
                          borderColor: role.color 
                        }}
                      >
                        <div className="text-left">
                          <div className="font-medium">{role.name}</div>
                          <div className="text-xs opacity-75">{role.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Permission Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Permissions for {selectedRoleData?.name}
                  </h3>
                  {selectedRoleData && (
                    <div className="space-y-3">
                      <Badge 
                        variant="outline"
                        style={{ borderColor: selectedRoleData.color, color: selectedRoleData.color }}
                      >
                        {selectedRoleData.tenantLevel ? "Tenant Level" : "Platform Level"}
                      </Badge>
                      
                      {Object.entries(getPermissionsByCategory(selectedRoleData.permissions)).map(([category, perms]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-medium capitalize text-sm">{category}</h4>
                          <div className="space-y-1">
                            {perms.map(perm => (
                              <div key={perm.id} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="font-medium">{perm.name}</span>
                                <span className="text-gray-500">- {perm.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">User Access Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">User</th>
                        <th className="border border-gray-300 p-2 text-left">Role</th>
                        <th className="border border-gray-300 p-2 text-left">Scope</th>
                        <th className="border border-gray-300 p-2 text-left">Tenant</th>
                        {PERMISSIONS.slice(0, 8).map(perm => (
                          <th key={perm.id} className="border border-gray-300 p-1 text-xs">{perm.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {USER_TYPES.map(user => {
                        const userRole = ROLES.find(r => r.id === user.role);
                        return (
                          <tr key={user.id}>
                            <td className="border border-gray-300 p-2 font-medium">{user.name}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge style={{ backgroundColor: userRole?.color }}>
                                {userRole?.name}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              <Badge variant="outline">{user.scope}</Badge>
                            </td>
                            <td className="border border-gray-300 p-2">{user.tenantId || "All"}</td>
                            {PERMISSIONS.slice(0, 8).map(perm => (
                              <td key={perm.id} className="border border-gray-300 p-1 text-center">
                                {userRole?.permissions.includes(perm.id) ? (
                                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Security Boundaries & Data Isolation
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Platform Level (Super Admin)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <strong>Access:</strong> All tenants, global settings
                      </div>
                      <div className="text-sm">
                        <strong>Restrictions:</strong> Cannot access tenant-specific POS operations
                      </div>
                      <div className="text-sm">
                        <strong>Data Scope:</strong> Cross-tenant analytics, platform management
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Tenant Level</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <strong>Access:</strong> Single tenant scope only
                      </div>
                      <div className="text-sm">
                        <strong>Restrictions:</strong> Cannot view other tenants' data
                      </div>
                      <div className="text-sm">
                        <strong>Data Scope:</strong> Tenant-specific orders, customers, inventory
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Permission Inheritance & Overrides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Inheritance:</strong> Staff roles inherit from base permissions</div>
                      <div><strong>Overrides:</strong> Tenant admins can restrict staff permissions</div>
                      <div><strong>Context Switching:</strong> Super admins can switch tenant context</div>
                      <div><strong>Session Management:</strong> Role-based session timeouts</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
