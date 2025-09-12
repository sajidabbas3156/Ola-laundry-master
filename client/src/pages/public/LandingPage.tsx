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
import PWABanner from "@/components/PWABanner";
import PWAInstallButton from "@/components/PWAInstallButton";

export default function LandingPage() {
  const features = [
    {
      icon: Store,
      title: "Web Admin Panel",
      description: "Complete business management dashboard with analytics, orders, and customer management",
      color: "text-primary"
    },
    {
      icon: Smartphone,
      title: "Customer Mobile App",
      description: "User-friendly mobile app for customers to place orders, track deliveries, and manage accounts",
      color: "text-secondary"
    },
    {
      icon: CreditCard,
      title: "Vendor POS System",
      description: "Point-of-sale interface for staff to process orders, manage inventory, and track sales",
      color: "text-primary"
    },
    {
      icon: Truck,
      title: "Delivery Driver App",
      description: "Dedicated driver interface with route optimization, GPS tracking, and delivery management",
      color: "text-secondary"
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
    <div className="min-h-screen bg-gradient-to-b from-accent to-background">
      <PWABanner />
      
      {/* Header */}
      <header className="bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">OLA</span>
              </div>
              <span className="text-2xl font-bold text-foreground">LAUNDRY MASTER</span>
            </div>
            <div className="flex space-x-4">
              <PWAInstallButton variant="button" size="sm" />
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/tenant/ola-laundry/dashboard">
                <Button>Get Started</Button>
              </Link>
              <Link to="/spinner-demo">
                <Button variant="outline">View Animations</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            OLA LAUNDRY MASTER - Clean Green Crisp
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Bahrain's first 100% eco-friendly laundry management platform. Serving Hoora, Manama with premium quality, 
            sustainable operations, and innovative technology. Complete suite for laundry businesses with web admin, 
            customer mobile app, vendor POS system, and delivery driver interface.
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Link to="/customer-app">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Smartphone className="mr-2 h-5 w-5" />
                Try Customer App
              </Button>
            </Link>
            <Link to="/quick-order">
              <Button size="lg" variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Four Powerful Applications</h2>
          <p className="text-lg text-muted-foreground">Everything you need to run a modern laundry business</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose OLA LAUNDRY MASTER?</h2>
            <p className="text-lg text-muted-foreground">100% Eco-friendly operations, sustainable technology, and premium service quality</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary rounded-2xl px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Green with Premium Laundry Service?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience Bahrain's first 100% eco-friendly laundry management platform. Call +973 37960004 or visit www.Olalaundry.com
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/tenant/ola-laundry/dashboard">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">OLA</span>
                </div>
                <span className="text-xl font-bold">LAUNDRY MASTER</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Clean - Green - Crisp<br/>
                100% Eco-friendly Laundry Services
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <p className="text-muted-foreground text-sm mb-2">📞 +973 37960004</p>
              <p className="text-muted-foreground text-sm mb-2">🌐 www.Olalaundry.com</p>
              <p className="text-muted-foreground text-sm">
                📍 Shop 1309A, Road 1819, Block 318<br/>
                Hoora, Manama, Kingdom of Bahrain
              </p>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-4">OLA ORDERS LAUNDRY W.L.L</h3>
              <p className="text-muted-foreground text-sm mb-2">First of a kind in Bahrain</p>
              <p className="text-muted-foreground text-sm">Hygienic - Affordable - Sustainable</p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 OLA ORDERS LAUNDRY W.L.L. All rights reserved. Bahrain's premier eco-friendly laundry management platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}