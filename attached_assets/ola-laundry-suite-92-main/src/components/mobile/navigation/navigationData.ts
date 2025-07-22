
import { 
  LayoutDashboard, 
  CreditCard,
  Store,
  ShoppingBag,
  ClipboardList,
  Users,
  Package, 
  BarChart3,
  Truck,
  Tag,
  Star,
  Briefcase,
  Palette,
  Settings,
  Megaphone,
  Zap,
  UserCircle,
  Shirt,
  Droplets,
  Wind,
  Sparkles
} from "lucide-react";

export const getMainOperationsItems = (tenantSlug: string) => [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    href: `/tenant/${tenantSlug}/dashboard`,
    badge: null
  },
  { 
    icon: CreditCard, 
    label: "POS", 
    href: `/tenant/${tenantSlug}/pos`,
    badge: null
  },
  { 
    icon: Store, 
    label: "Storefront", 
    href: `/tenant/${tenantSlug}/storefront`,
    badge: null
  },
  { 
    icon: Package, 
    label: "Inventory", 
    href: `/tenant/${tenantSlug}/inventory`,
    badge: null
  },
  { 
    icon: Users, 
    label: "Customers", 
    href: `/tenant/${tenantSlug}/customers`,
    badge: null
  },
  { 
    icon: ClipboardList, 
    label: "Orders", 
    href: `/tenant/${tenantSlug}/orders`,
    badge: "3"
  },
  { 
    icon: Truck, 
    label: "Delivery", 
    href: `/tenant/${tenantSlug}/delivery`,
    badge: null
  }
];

export const getBusinessToolsItems = (tenantSlug: string) => [
  { 
    icon: Tag, 
    label: "Promotions", 
    href: `/tenant/${tenantSlug}/promotions`,
    badge: null
  },
  { 
    icon: Megaphone, 
    label: "Marketing", 
    href: `/tenant/${tenantSlug}/marketing`,
    badge: null
  },
  { 
    icon: Star, 
    label: "Reviews", 
    href: `/tenant/${tenantSlug}/reviews`,
    badge: null
  },
  { 
    icon: Zap, 
    label: "Integrations", 
    href: `/tenant/${tenantSlug}/integrations`,
    badge: null
  }
];

export const getManagementItems = (tenantSlug: string) => [
  { 
    icon: UserCircle, 
    label: "Tenant Profile", 
    href: `/tenant/${tenantSlug}/tenant-profile`,
    badge: null
  },
  { 
    icon: Briefcase, 
    label: "Business Admin", 
    href: `/tenant/${tenantSlug}/business-admin`,
    badge: null
  },
  { 
    icon: Settings, 
    label: "Settings", 
    href: `/tenant/${tenantSlug}/settings`,
    badge: null
  },
  { 
    icon: CreditCard, 
    label: "POS Settings", 
    href: `/tenant/${tenantSlug}/pos-settings`,
    badge: null
  },
  { 
    icon: Palette, 
    label: "Store Customization", 
    href: `/tenant/${tenantSlug}/store-customization`,
    badge: null
  },
  { 
    icon: BarChart3, 
    label: "Reports", 
    href: `/tenant/${tenantSlug}/reports`,
    badge: null
  }
];
