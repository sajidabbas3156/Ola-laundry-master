// Comprehensive permission system for LaundryPro SaaS

export interface Permission {
  resource: string;
  actions: string[];
  scope?: 'own' | 'branch' | 'organization' | 'global';
}

export type UserType = 'superadmin' | 'vendor' | 'customer';

export interface RoleDefinition {
  name: string;
  slug: string;
  description: string;
  userType: UserType;
  permissions: Permission[];
  isSystemRole: boolean;
}

// Predefined system roles for different user types
export const SYSTEM_ROLES: RoleDefinition[] = [
  // SuperAdmin roles (platform-level)
  {
    name: 'Super Administrator',
    slug: 'superadmin',
    description: 'Full platform access and management',
    userType: 'superadmin',
    isSystemRole: true,
    permissions: [
      { resource: 'organizations', actions: ['create', 'read', 'update', 'delete', 'manage'], scope: 'global' },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'manage'], scope: 'global' },
      { resource: 'billing', actions: ['read', 'update', 'manage'], scope: 'global' },
      { resource: 'platform_settings', actions: ['read', 'update'], scope: 'global' },
      { resource: 'analytics', actions: ['read'], scope: 'global' },
    ]
  },

  // Vendor roles (organization-level)
  {
    name: 'Organization Owner',
    slug: 'org_owner',
    description: 'Full organization management and settings',
    userType: 'vendor',
    isSystemRole: true,
    permissions: [
      { resource: 'organization', actions: ['read', 'update', 'manage'], scope: 'organization' },
      { resource: 'branches', actions: ['create', 'read', 'update', 'delete'], scope: 'organization' },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'], scope: 'organization' },
      { resource: 'roles', actions: ['create', 'read', 'update', 'delete'], scope: 'organization' },
      { resource: 'services', actions: ['create', 'read', 'update', 'delete'], scope: 'organization' },
      { resource: 'billing', actions: ['read', 'update'], scope: 'organization' },
      { resource: 'reports', actions: ['read'], scope: 'organization' },
    ]
  },

  {
    name: 'Branch Manager',
    slug: 'branch_manager',
    description: 'Full branch operations and staff management',
    userType: 'vendor',
    isSystemRole: true,
    permissions: [
      { resource: 'branch', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'users', actions: ['create', 'read', 'update'], scope: 'branch' },
      { resource: 'orders', actions: ['create', 'read', 'update', 'delete'], scope: 'branch' },
      { resource: 'customers', actions: ['create', 'read', 'update'], scope: 'branch' },
      { resource: 'machines', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'inventory', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'staff_schedules', actions: ['create', 'read', 'update'], scope: 'branch' },
      { resource: 'reports', actions: ['read'], scope: 'branch' },
    ]
  },

  {
    name: 'Inventory Manager',
    slug: 'inventory_manager',
    description: 'Inventory and supply management',
    userType: 'vendor',
    isSystemRole: true,
    permissions: [
      { resource: 'inventory', actions: ['create', 'read', 'update', 'delete'], scope: 'branch' },
      { resource: 'supplies', actions: ['create', 'read', 'update', 'delete'], scope: 'branch' },
      { resource: 'vendors', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'machines', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'maintenance', actions: ['create', 'read', 'update'], scope: 'branch' },
      { resource: 'reports', actions: ['read'], scope: 'branch' },
    ]
  },

  {
    name: 'Laundry Staff',
    slug: 'laundry_staff',
    description: 'Order processing and machine operations',
    userType: 'vendor',
    isSystemRole: true,
    permissions: [
      { resource: 'orders', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'machines', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'customers', actions: ['read'], scope: 'branch' },
      { resource: 'inventory', actions: ['read'], scope: 'branch' },
      { resource: 'quality_checks', actions: ['create', 'read', 'update'], scope: 'branch' },
    ]
  },

  {
    name: 'Cashier',
    slug: 'cashier',
    description: 'Point of sale and payment processing',
    userType: 'vendor',
    isSystemRole: true,
    permissions: [
      { resource: 'orders', actions: ['create', 'read', 'update'], scope: 'branch' },
      { resource: 'customers', actions: ['create', 'read', 'update'], scope: 'branch' },
      { resource: 'payments', actions: ['create', 'read'], scope: 'branch' },
      { resource: 'pos', actions: ['read', 'update'], scope: 'branch' },
      { resource: 'receipts', actions: ['create', 'read'], scope: 'branch' },
    ]
  },

  {
    name: 'Delivery Agent',
    slug: 'delivery_agent',
    description: 'Delivery and pickup operations',
    userType: 'vendor',
    isSystemRole: true,
    permissions: [
      { resource: 'delivery_routes', actions: ['read', 'update'], scope: 'own' },
      { resource: 'orders', actions: ['read', 'update'], scope: 'own' },
      { resource: 'customers', actions: ['read'], scope: 'branch' },
      { resource: 'navigation', actions: ['read'], scope: 'branch' },
      { resource: 'delivery_app', actions: ['read', 'update'], scope: 'own' },
    ]
  },

  // Customer roles
  {
    name: 'Customer',
    slug: 'customer',
    description: 'Customer portal and order management',
    userType: 'customer',
    isSystemRole: true,
    permissions: [
      { resource: 'orders', actions: ['create', 'read'], scope: 'own' },
      { resource: 'profile', actions: ['read', 'update'], scope: 'own' },
      { resource: 'payments', actions: ['create', 'read'], scope: 'own' },
      { resource: 'loyalty', actions: ['read'], scope: 'own' },
      { resource: 'customer_app', actions: ['read', 'update'], scope: 'own' },
    ]
  },
];

// Permission checker utility
export class PermissionChecker {
  constructor(private userPermissions: Permission[]) {}

  hasPermission(resource: string, action: string, scope?: string): boolean {
    return this.userPermissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action) &&
      (scope ? permission.scope === scope || permission.scope === 'global' : true)
    );
  }

  canManage(resource: string, scope?: string): boolean {
    return this.hasPermission(resource, 'manage', scope);
  }

  canCreate(resource: string, scope?: string): boolean {
    return this.hasPermission(resource, 'create', scope);
  }

  canRead(resource: string, scope?: string): boolean {
    return this.hasPermission(resource, 'read', scope);
  }

  canUpdate(resource: string, scope?: string): boolean {
    return this.hasPermission(resource, 'update', scope);
  }

  canDelete(resource: string, scope?: string): boolean {
    return this.hasPermission(resource, 'delete', scope);
  }

  getResourcePermissions(resource: string): Permission | undefined {
    return this.userPermissions.find(p => p.resource === resource);
  }
}

// Helper to get role by slug
export function getRoleBySlug(slug: string): RoleDefinition | undefined {
  return SYSTEM_ROLES.find(role => role.slug === slug);
}

// Helper to get roles by user type
export function getRolesByUserType(userType: UserType): RoleDefinition[] {
  return SYSTEM_ROLES.filter(role => role.userType === userType);
}