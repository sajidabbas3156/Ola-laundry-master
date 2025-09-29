import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Leaf, 
  Clock, 
  Truck, 
  Star,
  QrCode,
  Smartphone,
  ShoppingBag,
  Users,
  Award,
  Heart,
  Sparkles,
  CheckCircle
} from "lucide-react";

export default function OlaLaundryLanding() {
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/97337960004', '_blank');
  };

  const handlePhoneCall = () => {
    window.open('tel:+97337960004');
  };

  const handleOrderNow = () => {
    // This would link to your ordering system/QR code scanner
    window.open('/customer-app', '_blank');
  };

  const services = [
    { name: "Wash & Iron", price: "2.5 BHD/kg", time: "24 hours", icon: Sparkles },
    { name: "Dry Clean", price: "3.5 BHD/kg", time: "48 hours", icon: Award },
    { name: "Premium Care", price: "4.0 BHD/kg", time: "24 hours", icon: Heart },
    { name: "Express Service", price: "5.0 BHD/kg", time: "12 hours", icon: Clock }
  ];

  const ecoFeatures = [
    { title: "100% Biodegradable Detergents", description: "Plant-based cleaning solutions" },
    { title: "Energy-Efficient Machines", description: "Reduces carbon footprint by 40%" },
    { title: "Water Conservation", description: "Advanced filtration & recycling system" },
    { title: "Eco-Friendly Packaging", description: "Recyclable bags and hangers" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/icons/ola-logo-original.jpg" 
                alt="OLA Laundry Logo" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-green-800">OLA LAUNDRY</h1>
                <p className="text-sm text-green-600">Clean • Green • Crisp</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handlePhoneCall}
                variant="outline" 
                size="sm"
                className="hidden sm:flex"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button 
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Central QR Code */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2 mb-4 text-center">
                <Leaf className="mr-2 h-4 w-4" />
                100% ECO-FRIENDLY LAUNDRY
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Bahrain's First
              <span className="text-green-600 block">Eco-Friendly</span>
              Laundry Service
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Premium quality laundry with 100% biodegradable detergents. 
              Serving Hoora & Manama with sustainable operations and innovative technology.
            </p>

            {/* Pricing Highlight */}
            <div className="bg-green-50 p-6 rounded-2xl mb-8 border border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-2">Starting from 2.5 BHD/kg</h3>
              <p className="text-green-600">Kilo-based pricing • Free pickup & delivery</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={handleOrderNow}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
                data-testid="button-order-now"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                ORDER NOW
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleWhatsAppContact}
                className="text-lg px-8 py-6 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                data-testid="button-whatsapp"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                CHAT WITH US
              </Button>
            </div>
          </div>

          {/* Right Side - QR Code */}
          <div className="flex justify-center lg:justify-end">
            <Card className="p-8 shadow-2xl bg-white border-2 border-green-200">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <div className="w-64 h-64 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <div className="text-center">
                    <QrCode className="h-32 w-32 text-green-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Scan to order instantly</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Ordering</h3>
                <p className="text-gray-600 text-sm">Scan QR code with your phone camera to place an order in seconds</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Premium Services</h2>
            <p className="text-lg text-gray-600">Kilo-based pricing with transparent costs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-white" data-testid={`card-service-${index}`}>
                <CardHeader className="text-center">
                  <service.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-lg text-gray-900">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-green-600 mb-2">{service.price}</p>
                  <p className="text-sm text-gray-600">Ready in {service.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eco-Friendly Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 text-lg px-6 py-3 mb-6">
              <Leaf className="mr-2 h-5 w-5" />
              100% ECO-FRIENDLY GUARANTEE
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why We're Different</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to protecting our planet while delivering exceptional laundry services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {ecoFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4" data-testid={`eco-feature-${index}`}>
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Limited Time Offers!</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              
              <Card className="bg-white text-gray-900 p-6" data-testid="card-promotion-new-customer">
                <div className="text-center">
                  <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">New Customer</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">20% OFF</p>
                  <p className="text-sm text-gray-600">On your first order over 5kg</p>
                </div>
              </Card>

              <Card className="bg-white text-gray-900 p-6" data-testid="card-promotion-bulk-discount">
                <div className="text-center">
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Bulk Discount</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">15% OFF</p>
                  <p className="text-sm text-gray-600">Orders over 10kg</p>
                </div>
              </Card>

              <Card className="bg-white text-gray-900 p-6" data-testid="card-promotion-weekly">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Weekly Service</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">25% OFF</p>
                  <p className="text-sm text-gray-600">Subscribe for weekly pickup</p>
                </div>
              </Card>
            </div>

            <div className="mt-8">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleOrderNow}
                className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4"
                data-testid="button-claim-offer"
              >
                CLAIM YOUR OFFER NOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+973 37960004</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-gray-600">Chat with us 24/7</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">
                      Shop 1309A, Road 1819, Block 318<br/>
                      Hoora, Manama, Kingdom of Bahrain
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleWhatsAppContact}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-contact-whatsapp"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message on WhatsApp
                </Button>
                <Button 
                  onClick={handlePhoneCall}
                  variant="outline"
                  data-testid="button-contact-phone"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Service Hours</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday - Thursday</span>
                    <span className="font-semibold">8:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Friday - Saturday</span>
                    <span className="font-semibold">9:00 AM - 11:00 PM</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      <Truck className="inline h-4 w-4 mr-1" />
                      Free pickup & delivery available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with App Links */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <img 
                  src="/icons/ola-logo-original.jpg" 
                  alt="OLA Laundry Logo" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold">OLA LAUNDRY</h3>
                  <p className="text-sm text-gray-400">Clean • Green • Crisp</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Bahrain's first 100% eco-friendly laundry service.<br/>
                Premium quality with sustainable operations.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Download Our App</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="#" 
                  className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center justify-center space-x-3 transition-colors"
                  data-testid="link-app-store"
                >
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Download on the</p>
                    <p className="font-semibold">App Store</p>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center justify-center space-x-3 transition-colors"
                  data-testid="link-play-store"
                >
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Get it on</p>
                    <p className="font-semibold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-4">OLA ORDERS LAUNDRY W.L.L</h3>
              <p className="text-gray-400 text-sm mb-2">First of a kind in Bahrain</p>
              <p className="text-gray-400 text-sm mb-4">Hygienic • Affordable • Sustainable</p>
              <div className="flex justify-center md:justify-end space-x-4">
                <Button 
                  size="sm" 
                  onClick={handleWhatsAppContact}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-footer-whatsapp"
                >
                  WhatsApp
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handlePhoneCall}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  data-testid="button-footer-call"
                >
                  Call
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 OLA ORDERS LAUNDRY W.L.L. All rights reserved. • www.Olalaundry.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}