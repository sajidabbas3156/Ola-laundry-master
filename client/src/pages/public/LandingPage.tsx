import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Store,
  Smartphone,
  Truck,
  CreditCard,
  Users,
  BarChart3,
  Zap,
  Shield,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Store,
      title: "Web Admin Panel",
      description: "Complete business management dashboard with analytics, orders, and customer management",
      color: "text-blue-600"
    },
    {
      icon: Smartphone,
      title: "Customer Mobile App",
      description: "User-friendly mobile app for customers to place orders, track deliveries, and manage accounts",
      color: "text-green-600"
    },
    {
      icon: CreditCard,
      title: "Vendor POS System",
      description: "Point-of-sale interface for staff to process orders, manage inventory, and track sales",
      color: "text-purple-600"
    },
    {
      icon: Truck,
      title: "Delivery Driver App",
      description: "Dedicated driver interface with route optimization, GPS tracking, and delivery management",
      color: "text-orange-600"
    }
  ];

  const benefits = [
    { icon: Zap, title: "Real-time Updates", description: "Live order tracking and status updates" },
    { icon: Shield, title: "Secure Payments", description: "Multiple payment methods with secure processing" },
    { icon: Users, title: "Multi-tenant", description: "Support for multiple laundry businesses" },
    { icon: BarChart3, title: "Analytics", description: "Comprehensive business insights and reports" },
    { icon: Globe, title: "Multi-language", description: "Support for Arabic and English" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">OLA</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">LAUNDRY MASTER</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/tenant/ola-laundry/dashboard">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Complete Laundry Management Solution
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your laundry business with our comprehensive multi-platform solution including 
            web admin panel, customer mobile app, vendor POS system, and delivery driver interface.
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Link to="/customer-app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Smartphone className="mr-2 h-5 w-5" />
                Try Customer App
              </Button>
            </Link>
            <Link to="/quick-order">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Smartphone className="mr-2 h-5 w-5" />
                QR Quick Order
              </Button>
            </Link>
            <Link to="/delivery-app">
              <Button size="lg" variant="outline">
                <Truck className="mr-2 h-5 w-5" />
                Try Driver App
              </Button>
            </Link>
            <Link to="/vendor-pos">
              <Button size="lg" variant="outline">
                <CreditCard className="mr-2 h-5 w-5" />
                Try POS System
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Four Powerful Applications</h2>
          <p className="text-lg text-gray-600">Everything you need to run a modern laundry business</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose OLA LAUNDRY MASTER?</h2>
            <p className="text-lg text-gray-600">Built for efficiency, scalability, and user experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-blue-600 rounded-2xl px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Laundry Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the future of laundry management with our comprehensive solution
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/tenant/ola-laundry/dashboard">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OLA</span>
            </div>
            <span className="text-xl font-bold">LAUNDRY MASTER</span>
          </div>
          <p className="text-gray-400">
            © 2024 OLA LAUNDRY MASTER. All rights reserved. Built for modern laundry businesses.
          </p>
        </div>
      </footer>
    </div>
  );
}