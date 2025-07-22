
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Download, Users, Package, MapPin, CreditCard, Bell, Camera, Wifi, Shield } from "lucide-react";

export default function MobileApp() {
  const appFeatures = [
    {
      icon: Package,
      title: "Order Management",
      description: "Create, update, and track orders on the go with full offline capabilities."
    },
    {
      icon: Users,
      title: "Customer Access",
      description: "View customer profiles, history, and preferences from anywhere."
    },
    {
      icon: MapPin,
      title: "GPS Navigation",
      description: "Optimized delivery routes with turn-by-turn navigation."
    },
    {
      icon: CreditCard,
      title: "Mobile Payments",
      description: "Process payments securely with built-in card readers and digital wallets."
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      description: "Capture photos for quality control and customer records."
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated with instant push notifications for orders and updates."
    },
    {
      icon: Wifi,
      title: "Offline Mode",
      description: "Continue working even without internet connection."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security with automatic data synchronization."
    }
  ];

  const userTypes = [
    {
      title: "For Business Owners",
      description: "Monitor your business performance and stay connected with real-time dashboards.",
      features: [
        "Real-time business analytics",
        "Team management and communication",
        "Financial reports and insights",
        "Customer feedback monitoring"
      ]
    },
    {
      title: "For Drivers & Staff",
      description: "Streamline delivery operations with GPS navigation and mobile order management.",
      features: [
        "Optimized delivery routes",
        "Order status updates",
        "Customer communication tools",
        "Photo capture for documentation"
      ]
    },
    {
      title: "For Customers",
      description: "Place orders, track deliveries, and manage preferences with ease.",
      features: [
        "Easy order placement",
        "Real-time delivery tracking",
        "Payment management", 
        "Order history and preferences"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-ola-100 text-ola-700">Mobile App</Badge>
                <h1 className="text-5xl font-bold mb-6">Manage Your Laundry Business On The Go</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Take your laundry business mobile with our powerful iOS and Android apps. 
                  Manage orders, track deliveries, and stay connected with your customers from anywhere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-ola-600 hover:bg-ola-700">
                    <Download className="h-5 w-5 mr-2" />
                    Download for iOS
                  </Button>
                  <Button size="lg" variant="outline" className="border-ola-600 text-ola-600 hover:bg-ola-50">
                    <Download className="h-5 w-5 mr-2" />
                    Download for Android
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-ola-100 to-blue-100 p-8 rounded-2xl">
                  <div className="flex justify-center space-x-4">
                    <div className="w-48 h-96 bg-white rounded-3xl shadow-2xl p-4 transform rotate-3">
                      <div className="w-full h-full bg-gradient-to-b from-ola-600 to-ola-700 rounded-2xl flex items-center justify-center text-white">
                        <Smartphone className="h-24 w-24" />
                      </div>
                    </div>
                    <div className="w-48 h-96 bg-white rounded-3xl shadow-2xl p-4 transform -rotate-3">
                      <div className="w-full h-full bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white">
                        <Package className="h-24 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Powerful Mobile Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to run your laundry business efficiently, right in your pocket.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {appFeatures.map((feature, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* User Types */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Built For Every User</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our mobile app is designed to meet the unique needs of every member of your laundry business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {userTypes.map((userType, index) => (
                <Card key={index} className="p-6 group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl group-hover:text-ola-600 transition-colors">{userType.title}</CardTitle>
                    <CardDescription className="text-gray-600">{userType.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <ul className="space-y-3">
                      {userType.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-ola-600 rounded-full" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-20 bg-gradient-to-r from-ola-600 to-ola-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Go Mobile?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Download the Ola Laundry mobile app today and take your business management to the next level. 
              Available for both iOS and Android devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-ola-600 hover:bg-gray-100">
                <Download className="h-5 w-5 mr-2" />
                Download for iOS
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ola-600">
                <Download className="h-5 w-5 mr-2" />
                Download for Android
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-6">
              Compatible with iOS 12.0+ and Android 8.0+
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
