import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export interface AuthUser extends User {
  permissions?: string[];
}

export const USER_ROLES = {
  SUPER_ADMIN: "superadmin",
  ORG_OWNER: "org_owner", 
  BRANCH_MANAGER: "branch_manager",
  INVENTORY_MANAGER: "inventory_manager",
  LAUNDRY_STAFF: "laundry_staff",
  CASHIER: "cashier",
  DELIVERY_AGENT: "delivery_agent",
  CUSTOMER: "customer"
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Role hierarchy and permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    "manage_organizations",
    "manage_all_users", 
    "view_all_data",
    "manage_subscriptions",
    "system_settings"
  ],
  [USER_ROLES.ORG_OWNER]: [
    "manage_organization",
    "manage_branches",
    "manage_staff",
    "view_reports",
    "manage_services",
    "manage_customers",
    "process_orders",
    "manage_inventory",
    "manage_deliveries"
  ],
  [USER_ROLES.BRANCH_MANAGER]: [
    "manage_branch_staff",
    "view_branch_reports", 
    "manage_branch_services",
    "manage_branch_customers",
    "process_orders",
    "manage_branch_inventory",
    "manage_branch_deliveries"
  ],
  [USER_ROLES.INVENTORY_MANAGER]: [
    "manage_inventory",
    "view_inventory_reports",
    "manage_suppliers",
    "track_supplies"
  ],
  [USER_ROLES.LAUNDRY_STAFF]: [
    "process_orders",
    "update_order_status",
    "operate_machines",
    "view_assigned_orders"
  ],
  [USER_ROLES.CASHIER]: [
    "create_orders",
    "process_payments", 
    "manage_customers",
    "view_daily_sales"
  ],
  [USER_ROLES.DELIVERY_AGENT]: [
    "view_delivery_routes",
    "update_delivery_status",
    "manage_delivery_stops",
    "view_assigned_deliveries"
  ],
  [USER_ROLES.CUSTOMER]: [
    "place_orders",
    "view_own_orders",
    "manage_profile",
    "track_deliveries"
  ]
};

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
    return userPermissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role as UserRole);
    }
    
    return user.role === role;
  };

  const canAccessAdminDashboard = (): boolean => {
    return hasRole([
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ORG_OWNER,
      USER_ROLES.BRANCH_MANAGER,
      USER_ROLES.INVENTORY_MANAGER
    ]);
  };

  const canAccessPOS = (): boolean => {
    return hasRole([
      USER_ROLES.CASHIER,
      USER_ROLES.LAUNDRY_STAFF,
      USER_ROLES.BRANCH_MANAGER,
      USER_ROLES.ORG_OWNER
    ]);
  };

  const canAccessDelivery = (): boolean => {
    return hasRole([
      USER_ROLES.DELIVERY_AGENT,
      USER_ROLES.BRANCH_MANAGER,
      USER_ROLES.ORG_OWNER
    ]);
  };

  const isStaff = (): boolean => {
    return hasRole([
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ORG_OWNER,
      USER_ROLES.BRANCH_MANAGER,
      USER_ROLES.INVENTORY_MANAGER,
      USER_ROLES.LAUNDRY_STAFF,
      USER_ROLES.CASHIER,
      USER_ROLES.DELIVERY_AGENT
    ]);
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    hasPermission,
    hasRole,
    canAccessAdminDashboard,
    canAccessPOS,
    canAccessDelivery,
    isStaff,
    role: user?.role as UserRole | undefined,
    displayName: user ? `${user.firstName} ${user.lastName}`.trim() || user.email : null
  };
}