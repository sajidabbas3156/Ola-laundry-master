import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CreditCard, 
  Smartphone, 
  Truck,
  Menu
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    name: "Admin Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Manage your entire laundry business"
  },
  {
    name: "Point of Sale",
    href: "/pos",
    icon: CreditCard,
    description: "Process orders and payments quickly"
  },
  {
    name: "Customer Portal",
    href: "/customer",
    icon: Smartphone,
    description: "Customer self-service and tracking"
  },
  {
    name: "Delivery Hub",
    href: "/delivery",
    icon: Truck,
    description: "Manage deliveries and routes"
  }
];

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="@assets/1750529717604(1)_1753277923428.png" 
                alt="OLA LAUNDRY" 
                className="h-10 w-auto"
              />
              <div>
                <span className="text-xl font-bold text-gray-900">OLA LAUNDRY MASTER</span>
                <p className="text-xs text-gray-500 -mt-1">Premium Management</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || 
                            (item.href === "/admin" && location === "/");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-primary/5 hover:shadow-md"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{item.name.replace(' App', '').replace(' Dashboard', '')}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || 
                            (item.href === "/admin" && location === "/");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
