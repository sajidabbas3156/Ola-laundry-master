import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Globe,
  Cloud,
  Settings,
  TrendingUp,
  Database,
  Wifi,
  Lock,
  CheckCircle,
  Monitor,
  TabletSmartphone,
  HeadphonesIcon
} from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";

export default function LaundryMasterSoftware() {
  const applications = [
    {
      icon: Monitor,
      title: "Smart POS for Laundries",
      description: "Advanced point-of-sale system with AI-powered financial forecasting, real-time business analytics, and automated profit optimization with 94%+ accuracy",
      features: ["AI Financial Forecasting", "Real-time Analytics", "Automated Pricing", "KPI Monitoring", "ROI Optimization"],
      color: "text-blue-600",
      demoLink: "/tenant/demo/ai-operations"
    },
    {
      icon: TabletSmartphone,
      title: "Customer Order App",
      description: "QR code-enabled ordering system with AI pricing calculator, eco-performance tracking, and real-time delivery notifications",
      features: ["QR Code Ordering", "AI Pricing Engine", "Eco-Performance Tracking", "Payment Gateway", "Real-time Tracking"],
      color: "text-green-600",
      demoLink: "/customer-app"
    },
    {
      icon: BarChart3,
      title: "Real-time Financial Dashboards",
      description: "Comprehensive business intelligence with automated financial reporting, sustainability metrics, and strategic insights powered by AI",
      features: ["Financial AI Analysis", "Sustainability Tracking", "Automated Reports", "KPI Dashboards", "Strategic Insights"],
      color: "text-purple-600",
      demoLink: "/tenant/demo/ai-operations"
    },
    {
      icon: Users,
      title: "Tenant/Vendor Management System",
      description: "Multi-tenant platform for managing multiple laundry businesses with automated branding, marketing recommendations, and operations optimization",
      features: ["Multi-Tenant Support", "Automated Branding", "Marketing AI", "Operations Optimization", "Vendor Management"],
      color: "text-orange-600",
      demoLink: "/tenant-management"
    }
  ];

  const features = [
    { icon: Cloud, title: "Cloud-Based Architecture", description: "Scalable infrastructure with 99.9% uptime guarantee" },
    { icon: Shield, title: "Enterprise Security", description: "End-to-end encryption and secure payment processing" },
    { icon: Users, title: "Multi-Tenant Support", description: "Support multiple laundry businesses from single platform" },
    { icon: BarChart3, title: "Advanced Analytics", description: "AI-powered insights and predictive analytics" },
    { icon: Globe, title: "Multi-Language", description: "Full support for Arabic, English, and other languages" },
    { icon: Wifi, title: "Real-Time Updates", description: "Live synchronization across all devices and applications" },
    { icon: Settings, title: "Workflow Automation", description: "Automated processes for orders, inventory, and notifications" },
    { icon: Database, title: "Data Management", description: "Comprehensive database with backup and recovery systems" }
  ];

  const businessBenefits = [
    {
      title: "Increase Revenue",
      description: "Up to 35% increase in revenue through optimized operations and customer retention",
      metric: "+35%",
      color: "text-green-600"
    },
    {
      title: "Reduce Costs",
      description: "Decrease operational costs by 25% through automation and efficient resource management",
      metric: "-25%",
      color: "text-blue-600"
    },
    {
      title: "Improve Efficiency",
      description: "40% faster order processing with automated workflows and digital systems",
      metric: "+40%",
      color: "text-purple-600"
    },
    {
      title: "Customer Satisfaction",
      description: "95% customer satisfaction rate with real-time tracking and quality service",
      metric: "95%",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">LM</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LAUNDRY MASTER</h1>
                <p className="text-sm text-gray-600">Complete Software Solution</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <PWAInstallButton variant="button" size="sm" />
              <Link to="/ola-laundry">
                <Button variant="outline">View OLA Laundry</Button>
              </Link>
              <Link to="/tenant/demo/dashboard">
                <Button>Try Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Badge className="bg-blue-100 text-blue-800 text-lg px-6 py-3 mb-6">
            Complete Software Platform
          </Badge>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight" style={{color: '#1C1C4D'}}>
            Ola Laundry Master
            <span className="block" style={{color: '#27A844'}}>
              Smart Software for Laundries
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Complete B2B technology solution featuring Smart POS for laundries, Customer order app with AI pricing, 
            Real-time financial dashboards with 94%+ accuracy, and Tenant/vendor management system. 
            Built with enterprise-grade AI operations and advanced business analytics.
          </p>
          
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Link to="/tenant/demo/ai-operations">
              <Button size="lg" style={{backgroundColor: '#1C1C4D', color: '#FFFFFF'}} className="hover:opacity-90">
                <BarChart3 className="mr-2 h-5 w-5" />
                Try AI Operations Center
              </Button>
            </Link>
            <Link to="/customer-app">
              <Button size="lg" variant="outline" style={{borderColor: '#3F85C8', color: '#3F85C8'}}>
                <Smartphone className="mr-2 h-5 w-5" />
                Customer App Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Four Powerful Applications</h2>
            <p className="text-lg text-gray-600">Complete ecosystem for modern laundry business management</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {applications.map((app, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white" data-testid={`card-application-${index}`}>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <app.icon className={`h-12 w-12 ${app.color}`} />
                    <div>
                      <CardTitle className="text-xl text-gray-900">{app.title}</CardTitle>
                      <Link to={app.demoLink}>
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Try Demo →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 text-base">
                    {app.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900 text-sm">Key Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {app.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Technology Stack</h2>
            <p className="text-lg text-gray-600">Built with cutting-edge technology for reliability and performance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow" data-testid={`feature-${index}`}>
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Proven Business Results</h2>
            <p className="text-xl opacity-90">Transform your laundry business with measurable outcomes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessBenefits.map((benefit, index) => (
              <Card key={index} className="bg-white text-gray-900 text-center p-6" data-testid={`benefit-${index}`}>
                <div className={`text-4xl font-bold ${benefit.color} mb-2`}>
                  {benefit.metric}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Automation & AI Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <Badge className="bg-purple-100 text-purple-800 mb-4">
                AI-Powered Automation
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Intelligent Automation & AI Features
              </h2>
              <div className="space-y-6">
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Predictive Analytics</h3>
                    <p className="text-gray-600">AI-powered demand forecasting and inventory optimization</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Automated Workflows</h3>
                    <p className="text-gray-600">Smart order routing and status updates without manual intervention</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Customer Intelligence</h3>
                    <p className="text-gray-600">Personalized recommendations and retention strategies</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Financial AI</h3>
                    <p className="text-gray-600">Automated financial reporting and profit optimization</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center bg-white">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-2xl text-gray-900 mb-1">30%</h3>
                <p className="text-sm text-gray-600">Faster Processing</p>
              </Card>
              
              <Card className="p-6 text-center bg-white">
                <Settings className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-2xl text-gray-900 mb-1">85%</h3>
                <p className="text-sm text-gray-600">Task Automation</p>
              </Card>
              
              <Card className="p-6 text-center bg-white">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-2xl text-gray-900 mb-1">99.5%</h3>
                <p className="text-sm text-gray-600">Accuracy Rate</p>
              </Card>
              
              <Card className="p-6 text-center bg-white">
                <Zap className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                <h3 className="font-bold text-2xl text-gray-900 mb-1">24/7</h3>
                <p className="text-sm text-gray-600">Availability</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-8 py-16 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Laundry Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join the digital revolution in laundry management with our comprehensive software suite
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/tenant/demo/dashboard">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  data-testid="button-try-demo"
                >
                  <Monitor className="mr-2 h-5 w-5" />
                  Try Free Demo
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-blue-600"
                data-testid="button-contact-sales"
              >
                <HeadphonesIcon className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LM</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">LAUNDRY MASTER</h3>
                  <p className="text-sm text-gray-400">Software Suite</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Complete software platform for modern<br/>
                laundry business management and automation.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Applications</h3>
              <div className="space-y-2">
                <Link to="/tenant/demo/dashboard">
                  <Button variant="link" className="text-gray-400 hover:text-white p-0">
                    Admin Dashboard
                  </Button>
                </Link>
                <Link to="/customer-app">
                  <Button variant="link" className="text-gray-400 hover:text-white p-0">
                    Customer App
                  </Button>
                </Link>
                <Link to="/vendor-pos">
                  <Button variant="link" className="text-gray-400 hover:text-white p-0">
                    POS System
                  </Button>
                </Link>
                <Link to="/delivery-app">
                  <Button variant="link" className="text-gray-400 hover:text-white p-0">
                    Driver App
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-4">Technology</h3>
              <p className="text-gray-400 text-sm mb-4">
                Built with modern web technologies<br/>
                React • TypeScript • Node.js • PostgreSQL
              </p>
              <div className="flex justify-center md:justify-end space-x-2">
                <Badge variant="secondary">Cloud-Based</Badge>
                <Badge variant="secondary">AI-Powered</Badge>
                <Badge variant="secondary">Multi-Tenant</Badge>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Laundry Master Software Suite. Built for modern laundry businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}