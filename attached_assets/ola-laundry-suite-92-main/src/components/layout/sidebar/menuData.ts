
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  Truck,
  Settings,
  BarChart3,
  Star,
  Gift,
  Building,
  CreditCard,
  HelpCircle,
  Briefcase,
  Store,
  Zap,
  MessageSquare,
  Globe,
  UserCircle,
  Shirt,
  Droplets,
  Wind,
  Sparkles
} from "lucide-react";

export const mainMenuItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Point of Sale",
    url: "pos",
    icon: CreditCard,
  },
  {
    title: "Storefront",
    url: "storefront",
    icon: Store,
  },
  {
    title: "Orders",
    url: "orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    url: "customers",
    icon: Users,
  },
  {
    title: "Inventory",
    url: "inventory",
    icon: Package,
  },
];

export const businessMenuItems = [
  {
    title: "Reports",
    url: "reports",
    icon: BarChart3,
  },
  {
    title: "Integrations",
    url: "integrations",
    icon: Zap,
  },
  {
    title: "Delivery",
    url: "delivery",
    icon: Truck,
  },
  {
    title: "Scheduling",
    url: "scheduling",
    icon: Calendar,
  },
  {
    title: "Reviews",
    url: "reviews",
    icon: Star,
  },
  {
    title: "Promotions",
    url: "promotions",
    icon: Gift,
  },
  {
    title: "Marketing",
    url: "marketing",
    icon: MessageSquare,
  },
];

export const managementMenuItems = [
  {
    title: "Tenant Profile",
    url: "tenant-profile",
    icon: UserCircle,
  },
  {
    title: "Business Admin",
    url: "business-admin",
    icon: Briefcase,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
  {
    title: "POS Settings",
    url: "pos-settings",
    icon: CreditCard,
  },
  {
    title: "How It Works",
    url: "how-it-works",
    icon: HelpCircle,
  },
];
