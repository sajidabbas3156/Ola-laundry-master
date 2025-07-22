
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Calendar, DollarSign, Zap, Shield, Smartphone, BarChart3, Bell, MapPin, CreditCard, Settings } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Users,
      title: "Customer Management",
      description: "Complete customer database with preferences, history, and automated communication.",
      features: ["Customer profiles", "Purchase history", "Automated notifications", "Loyalty programs"]
    },
    {
      icon: Package,
      title: "Order Management", 
      description: "Track orders from pickup to delivery with real-time status updates.",
      features: ["Order tracking", "Status updates", "Batch processing", "Quality control"]
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Intelligent scheduling with route optimization and capacity management.",
      features: ["Route optimization", "Capacity planning", "Recurring orders", "Time slot booking"]
    },
    {
      icon: DollarSign,
      title: "Billing & Payments",
      description: "Automated invoicing, multiple payment methods, and financial reporting.",
      features: ["Auto invoicing", "Payment processing", "Financial reports", "Tax management"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive business insights with customizable dashboards.",
      features: ["Performance metrics", "Custom reports", "Trend analysis", "Export capabilities"]
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Full mobile app for staff and customers with offline capabilities.",
      features: ["Mobile apps", "Offline mode", "Push notifications", "GPS tracking"]
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Multi-channel communication via SMS, email, and push notifications.",
      features: ["SMS alerts", "Email updates", "Push notifications", "Custom templates"]
    },
    {
      icon: MapPin,
      title: "Delivery Management",
      description: "Optimize delivery routes and track driver performance in real-time.",
      features: ["Route planning", "Driver tracking", "Delivery confirmation", "Customer updates"]
    },
    {
      icon: CreditCard,
      title: "POS Integration",
      description: "Integrated point-of-sale system with inventory management.",
      features: ["POS system", "Inventory tracking", "Barcode scanning", "Receipt printing"]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with data encryption and compliance features.",
      features: ["Data encryption", "Access controls", "Audit trails", "GDPR compliance"]
    },
    {
      icon: Settings,
      title: "Customization",
      description: "Highly customizable platform to fit your business needs.",
      features: ["Custom workflows", "Branded interface", "API access", "Third-party integrations"]
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate repetitive tasks and streamline your operations.",
      features: ["Workflow automation", "Auto-scheduling", "Smart pricing", "Inventory alerts"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <Badge className="mb-4 bg-ola-100 text-ola-700">Complete Feature Set</Badge>
            <h1 className="text-5xl font-bold mb-6">Everything You Need to Run Your Laundry Business</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From customer management to delivery tracking, our comprehensive platform includes all the tools 
              you need to streamline operations and grow your business.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-ola-200">
                  <CardHeader>
                    <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-ola-600 rounded-full mr-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
