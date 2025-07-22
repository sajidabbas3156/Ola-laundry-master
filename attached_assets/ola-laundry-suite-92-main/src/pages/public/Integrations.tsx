import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Mail, MessageCircle, Package, BarChart3, Calendar, MapPin, Shield, Zap, Database, DollarSign } from "lucide-react";

export default function Integrations() {
  const integrationCategories = [
    {
      title: "Payment Processors",
      description: "Accept payments through multiple channels",
      integrations: [
        { name: "Stripe", description: "Online payments and subscriptions", icon: CreditCard },
        { name: "PayPal", description: "Digital wallet payments", icon: CreditCard },
        { name: "Square", description: "In-person and online payments", icon: CreditCard },
        { name: "Authorize.Net", description: "Secure payment processing", icon: Shield }
      ]
    },
    {
      title: "Communication",
      description: "Keep customers informed and engaged",
      integrations: [
        { name: "Twilio SMS", description: "SMS notifications and alerts", icon: MessageCircle },
        { name: "SendGrid", description: "Email marketing and transactional emails", icon: Mail },
        { name: "WhatsApp Business", description: "WhatsApp messaging integration", icon: MessageCircle },
        { name: "Mailchimp", description: "Email marketing campaigns", icon: Mail }
      ]
    },
    {
      title: "Delivery & Logistics",
      description: "Optimize routes and track deliveries",
      integrations: [
        { name: "Google Maps", description: "Route optimization and navigation", icon: MapPin },
        { name: "UberRUSH", description: "On-demand delivery service", icon: Package },
        { name: "Postmates", description: "Last-mile delivery solutions", icon: Package },
        { name: "Route4Me", description: "Multi-stop route planning", icon: MapPin }
      ]
    },
    {
      title: "Analytics & Reporting",
      description: "Get deeper insights into your business",
      integrations: [
        { name: "Google Analytics", description: "Web traffic and customer behavior", icon: BarChart3 },
        { name: "Mixpanel", description: "Advanced user analytics", icon: BarChart3 },
        { name: "Tableau", description: "Data visualization and reporting", icon: BarChart3 },
        { name: "Power BI", description: "Business intelligence dashboards", icon: BarChart3 }
      ]
    },
    {
      title: "Productivity Tools",
      description: "Connect with your existing workflow",
      integrations: [
        { name: "Google Workspace", description: "Calendar, Drive, and productivity tools", icon: Calendar },
        { name: "Microsoft 365", description: "Office suite integration", icon: Calendar },
        { name: "Slack", description: "Team communication and notifications", icon: MessageCircle },
        { name: "Zapier", description: "Automate workflows between apps", icon: Zap }
      ]
    },
    {
      title: "Accounting & Finance",
      description: "Sync financial data with your accounting software",
      integrations: [
        { name: "QuickBooks", description: "Accounting and bookkeeping", icon: DollarSign },
        { name: "Xero", description: "Cloud-based accounting", icon: DollarSign },
        { name: "FreshBooks", description: "Invoicing and time tracking", icon: DollarSign },
        { name: "Sage", description: "Enterprise accounting solutions", icon: DollarSign }
      ]
    }
  ];

  const popularIntegrations = [
    {
      name: "Stripe",
      description: "Accept online payments with industry-leading security",
      logo: "/placeholder.svg",
      category: "Payments",
      features: ["Credit/Debit Cards", "ACH Transfers", "Recurring Billing", "PCI Compliance"]
    },
    {
      name: "Google Maps",
      description: "Optimize delivery routes and provide accurate ETAs",
      logo: "/placeholder.svg", 
      category: "Delivery",
      features: ["Route Optimization", "Real-time Traffic", "GPS Tracking", "Address Validation"]
    },
    {
      name: "Twilio",
      description: "Send SMS notifications and updates to customers",
      logo: "/placeholder.svg",
      category: "Communication", 
      features: ["SMS Notifications", "Two-way Messaging", "Global Reach", "Delivery Reports"]
    },
    {
      name: "QuickBooks",
      description: "Sync financial data with your accounting system",
      logo: "/placeholder.svg",
      category: "Accounting",
      features: ["Auto-sync Transactions", "Invoice Generation", "Tax Reporting", "Financial Reports"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <Badge className="mb-4 bg-ola-100 text-ola-700">Integrations</Badge>
            <h1 className="text-5xl font-bold mb-6">Connect Ola Laundry with Your Favorite Tools</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Seamlessly integrate with 100+ popular business tools to streamline your workflow 
              and create a unified ecosystem for your laundry business.
            </p>
            <Button size="lg" className="bg-ola-600 hover:bg-ola-700">
              Browse All Integrations
            </Button>
          </div>
        </section>

        {/* Popular Integrations */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Most Popular Integrations</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started quickly with these essential integrations used by thousands of laundry businesses.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularIntegrations.map((integration, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img src={integration.logo} alt={integration.name} className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-ola-600 transition-colors">{integration.name}</CardTitle>
                    <Badge variant="outline" className="mx-auto">{integration.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center mb-4">{integration.description}</CardDescription>
                    <ul className="space-y-2 text-sm">
                      {integration.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-ola-600 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Integrations by Category</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find the perfect integration for your needs across all business functions.
              </p>
            </div>
            
            <div className="space-y-12">
              {integrationCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.integrations.map((integration, integrationIndex) => (
                      <Card key={integrationIndex} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                              <integration.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold group-hover:text-ola-600 transition-colors">{integration.name}</h4>
                              <p className="text-sm text-gray-600">{integration.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-ola-100 text-ola-700">Developer API</Badge>
                <h2 className="text-4xl font-bold mb-6">Build Custom Integrations</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Need a custom integration? Use our powerful REST API to connect Ola Laundry 
                  with any system or build your own applications.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-ola-600" />
                    <span>Full CRUD operations on all data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-ola-600" />
                    <span>OAuth 2.0 authentication</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-ola-600" />
                    <span>Real-time webhooks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-ola-600" />
                    <span>Comprehensive documentation</span>
                  </li>
                </ul>
                <div className="flex gap-4">
                  <Button className="bg-ola-600 hover:bg-ola-700">
                    View API Docs
                  </Button>
                  <Button variant="outline">
                    Get API Key
                  </Button>
                </div>
              </div>
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                <div className="mb-4">
                  <span className="text-gray-500"># Create a new order</span>
                </div>
                <div className="mb-2">
                  <span className="text-blue-400">POST</span> /api/v1/orders
                </div>
                <div className="mb-4">
                  <span className="text-yellow-400">Authorization:</span> Bearer your-api-key
                </div>
                <div className="text-white">
                  {`{
  "customer_id": "cus_123",
  "items": [
    {
      "service": "wash_fold",
      "quantity": 2,
      "price": 15.99
    }
  ],
  "pickup_date": "2025-06-03",
  "delivery_date": "2025-06-05"
}`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-ola-600 to-ola-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Connect Your Tools?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Start integrating Ola Laundry with your existing business tools today. 
              Most integrations can be set up in just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-ola-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ola-600">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
