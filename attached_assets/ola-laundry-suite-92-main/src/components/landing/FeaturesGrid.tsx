
import { Badge } from "@/components/ui/badge";
import { Users, Package, Calendar, DollarSign, Zap, Shield } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: Users,
      title: "Smart Customer Management",
      description: "AI-powered customer insights, preferences tracking, and automated communication.",
      color: "bg-blue-500"
    },
    {
      icon: Package,
      title: "Order Management",
      description: "Real-time tracking from pickup to delivery with SMS notifications.",
      color: "bg-green-500"
    },
    {
      icon: Calendar,
      title: "Intelligent Scheduling",
      description: "Route optimization and automated scheduling for maximum efficiency.",
      color: "bg-purple-500"
    },
    {
      icon: DollarSign,
      title: "Advanced Billing",
      description: "Automated invoicing, payment processing, and financial reporting.",
      color: "bg-yellow-500"
    },
    {
      icon: Zap,
      title: "Performance Analytics",
      description: "Real-time dashboards and insights to grow your business.",
      color: "bg-red-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with data encryption and compliance.",
      color: "bg-ola-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-ola-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-ola-100 text-ola-700">Complete Solution</Badge>
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From customer management to delivery tracking, we've got every aspect of your laundry business covered.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-ola-200">
              <div className={`h-14 w-14 ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
