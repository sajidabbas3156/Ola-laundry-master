
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Calendar, DollarSign, Settings, Smartphone } from "lucide-react";

interface Category {
  icon: any;
  title: string;
  description: string;
  articles: number;
  onClick: () => void;
}

interface CategoriesSectionProps {
  onNavigate: (section: string) => void;
}

export function CategoriesSection({ onNavigate }: CategoriesSectionProps) {
  const categories: Category[] = [
    {
      icon: Users,
      title: "Customer Management",
      description: "Managing customer profiles, preferences, and communication",
      articles: 12,
      onClick: () => onNavigate("customer-management")
    },
    {
      icon: Package,
      title: "Order Processing",
      description: "Creating, tracking, and fulfilling orders",
      articles: 18,
      onClick: () => onNavigate("order-processing")
    },
    {
      icon: Calendar,
      title: "Scheduling & Delivery",
      description: "Setting up schedules, routes, and delivery management",
      articles: 15,
      onClick: () => onNavigate("scheduling-delivery")
    },
    {
      icon: DollarSign,
      title: "Billing & Payments",
      description: "Payment processing, invoicing, and financial reporting",
      articles: 10,
      onClick: () => onNavigate("billing-payments")
    },
    {
      icon: Settings,
      title: "Settings & Configuration",
      description: "System setup, user management, and customization",
      articles: 8,
      onClick: () => onNavigate("settings-config")
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Using the mobile app for staff and customers",
      articles: 6,
      onClick: () => onNavigate("mobile-app")
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={category.onClick}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-ola-600 transition-colors">{category.title}</CardTitle>
                    <p className="text-sm text-gray-500">{category.articles} articles</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
