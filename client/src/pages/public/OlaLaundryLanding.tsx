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
    { name: "Wash Only", price: "1.0 BHD/kg", time: "24 hours", icon: Sparkles },
    { name: "Wash & Press", price: "1.3 BHD/kg", time: "24 hours", icon: Award },
    { name: "Premium Eco Care", price: "1.5 BHD/kg", time: "48 hours", icon: Heart },
    { name: "Express Service", price: "2.0 BHD/kg", time: "12 hours", icon: Clock }
  ];

  const ecoFeatures = [
    { title: "100% Biodegradable Detergents", description: "Plant-based cleaning solutions" },
    { title: "Energy-Efficient Machines", description: "Reduces carbon footprint by 40%" },
    { title: "Water Conservation", description: "Advanced filtration & recycling system" },
    { title: "Eco-Friendly Packaging", description: "Recyclable bags and hangers" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      
      {/* Navigation Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/icons/ola-logo-original.jpg" 
                alt="OLA Laundry Logo" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold" style={{color: '#1C1C4D'}}>OLA LAUNDRY</h1>
                <p className="text-sm" style={{color: '#27A844'}}>Clean • Green • Crisp</p>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium" data-testid="nav-home">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium" data-testid="nav-about">About Us</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium" data-testid="nav-contact">Contact Us</a>
              <a href="/laundry-master-software" className="text-gray-700 hover:text-blue-600 font-medium" data-testid="nav-software">Laundry Master Software</a>
              <a href="/tenant-management" className="text-gray-700 hover:text-blue-600 font-medium" data-testid="nav-tenants">Tenants List</a>
            </nav>
            
            <div className="flex space-x-3">
              <Button 
                onClick={handlePhoneCall}
                variant="outline" 
                size="sm"
                className="hidden sm:flex border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                data-testid="button-header-call"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button 
                onClick={handleWhatsAppContact}
                size="sm"
                style={{backgroundColor: '#27A844'}}
                className="hover:opacity-90"
                data-testid="button-header-whatsapp"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Support
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Central QR Code */}
      <section id="home" className="py-16" style={{backgroundColor: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <Badge className="text-lg px-6 py-3 mb-6" style={{backgroundColor: '#27A844', color: '#FFFFFF'}}>
                <Leaf className="mr-2 h-5 w-5" />
                100% ECO-FRIENDLY • CLEAN • GREEN • CRISP
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight" style={{color: '#1C1C4D'}}>
              Laundry by the Kilo
              <br />
              <span style={{color: '#27A844'}}>Affordable • Reliable • Sustainable</span>
            </h1>
          </div>
          
          {/* Central QR Code */}
          <div className="flex justify-center mb-12">
            <Card className="p-12 shadow-2xl bg-white" style={{borderColor: '#3F85C8', borderWidth: '3px'}}>
              <div className="text-center">
                <div className="w-80 h-80 rounded-3xl flex items-center justify-center mb-6 mx-auto" style={{backgroundColor: '#F8F9FA'}}>
                  <div className="text-center">
                    <QrCode className="h-40 w-40 mx-auto mb-6" style={{color: '#1C1C4D'}} />
                    <p className="text-lg font-semibold" style={{color: '#1C1C4D'}}>Scan to Order</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleOrderNow}
                  className="text-xl px-12 py-8 font-bold rounded-xl"
                  style={{backgroundColor: '#1C1C4D', color: '#FFFFFF'}}
                  data-testid="button-scan-order"
                >
                  <QrCode className="mr-3 h-6 w-6" />
                  SCAN TO ORDER
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="text-center">
            <p className="text-2xl mb-8" style={{color: '#1C1C4D'}}>Bahrain's First 100% Eco-Friendly Laundry Service</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={handleWhatsAppContact}
                className="text-lg px-10 py-6 font-semibold rounded-xl"
                style={{backgroundColor: '#27A844', color: '#FFFFFF'}}
                data-testid="button-hero-whatsapp"
              >
                <MessageCircle className="mr-3 h-5 w-5" />
                CHAT WITH US
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={handlePhoneCall}
                className="text-lg px-10 py-6 font-semibold rounded-xl"
                style={{borderColor: '#3F85C8', color: '#3F85C8'}}
                data-testid="button-hero-call"
              >
                <Phone className="mr-3 h-5 w-5" />
                CALL NOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Eco-Friendly Promise Section */}
      <section className="py-16" style={{backgroundColor: '#F8F9FA'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="text-lg px-6 py-3 mb-6" style={{backgroundColor: '#27A844', color: '#FFFFFF'}}>
              <Leaf className="mr-2 h-5 w-5" />
              ECO-FRIENDLY PROMISE
            </Badge>
            <h2 className="text-4xl font-bold mb-8" style={{color: '#1C1C4D'}}>Our Green Commitment</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center bg-white border-2" style={{borderColor: '#27A844'}} data-testid="card-water-saving">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{backgroundColor: '#E8F5E8'}}>
                    <span className="text-2xl font-bold" style={{color: '#27A844'}}>50%</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>Less Water Usage</h3>
                <p className="text-gray-600">Advanced water recycling system reduces freshwater consumption</p>
              </Card>
              
              <Card className="p-6 text-center bg-white border-2" style={{borderColor: '#27A844'}} data-testid="card-eco-detergents">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{backgroundColor: '#E8F5E8'}}>
                    <span className="text-lg font-bold" style={{color: '#27A844'}}>100%</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>Eco-Certified Detergents</h3>
                <p className="text-gray-600">Plant-based, biodegradable cleaning solutions only</p>
              </Card>
              
              <Card className="p-6 text-center bg-white border-2" style={{borderColor: '#27A844'}} data-testid="card-biodegradable-packaging">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{backgroundColor: '#E8F5E8'}}>
                    <Leaf className="h-8 w-8" style={{color: '#27A844'}} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>Biodegradable Packaging</h3>
                <p className="text-gray-600">Hemp-cotton covers and reusable packaging materials</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing & Services Section */}
      <section className="py-16" style={{backgroundColor: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{color: '#1C1C4D'}}>Pricing & Offers</h2>
            <div className="inline-block px-6 py-3 rounded-lg mb-8" style={{backgroundColor: '#3F85C8', color: '#FFFFFF'}}>
              <p className="text-xl font-bold">BEST PRICE GUARANTEE</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-white border-2" style={{borderColor: '#3F85C8'}} data-testid={`card-service-${index}`}>
                <CardHeader className="text-center">
                  <service.icon className="h-12 w-12 mx-auto mb-4" style={{color: '#1C1C4D'}} />
                  <CardTitle className="text-lg" style={{color: '#1C1C4D'}}>{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-bold mb-2" style={{color: '#27A844'}}>{service.price}</p>
                  <p className="text-sm text-gray-600">Ready in {service.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-lg text-gray-600">Minimum order: 4 kg • Free pickup & delivery in Hoora & Manama</p>
          </div>
        </div>
      </section>

      {/* About Us & Green Initiatives */}
      <section id="about" className="py-16" style={{backgroundColor: '#F8F9FA'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{color: '#1C1C4D'}}>About Ola Laundry</h2>
              <p className="text-xl text-gray-700 mb-6">
                We are Bahrain's pioneering eco-friendly laundry service, combining innovation, 
                sustainability, and convenience. Our mission is to provide premium laundry care 
                while protecting the environment for future generations.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Based in Hoora, Manama, we've introduced the Kingdom's first 100% sustainable 
                laundry model, setting new standards for environmental responsibility in the industry.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleOrderNow}
                  className="font-semibold"
                  style={{backgroundColor: '#27A844', color: '#FFFFFF'}}
                  data-testid="button-about-order"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Order Now
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{color: '#1C1C4D'}}>Our Green Initiatives</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 mt-1" style={{color: '#27A844'}} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{color: '#1C1C4D'}}>Eco-Friendly Packaging</h4>
                    <p className="text-gray-600">Hemp-cotton covers and biodegradable garment bags</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 mt-1" style={{color: '#27A844'}} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{color: '#1C1C4D'}}>Water Conservation</h4>
                    <p className="text-gray-600">Advanced recycling system reduces freshwater consumption by 50%</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 mt-1" style={{color: '#27A844'}} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{color: '#1C1C4D'}}>Energy Efficient Machines</h4>
                    <p className="text-gray-600">Latest technology reduces carbon footprint while maintaining quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16" style={{backgroundColor: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-8" style={{color: '#1C1C4D'}}>Why Choose Us</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="feature-eco-friendly">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#E8F5E8'}}>
                <Leaf className="h-10 w-10" style={{color: '#27A844'}} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>🌱 Eco-Friendly</h3>
              <p className="text-gray-600">100% sustainable operations with biodegradable materials</p>
            </div>
            
            <div className="text-center" data-testid="feature-affordable">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#E3F2FD'}}>
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>💸 Affordable</h3>
              <p className="text-gray-600">Transparent kilo-based pricing with best price guarantee</p>
            </div>
            
            <div className="text-center" data-testid="feature-technology">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#E3F2FD'}}>
                <Smartphone className="h-10 w-10" style={{color: '#3F85C8'}} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>📲 Technology-Enabled</h3>
              <p className="text-gray-600">QR code ordering, real-time tracking, and AI-powered operations</p>
            </div>
            
            <div className="text-center" data-testid="feature-transparent">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#E8F5E8'}}>
                <CheckCircle className="h-10 w-10" style={{color: '#27A844'}} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>✅ Transparent Pricing</h3>
              <p className="text-gray-600">No hidden fees, clear costs, and honest service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-16" style={{background: 'linear-gradient(135deg, #1C1C4D 0%, #27A844 100%)', color: '#FFFFFF'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Launch Promotions!</h2>
            <p className="text-xl mb-8 opacity-90">Special offers for our eco-conscious customers</p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              
              <Card className="bg-white p-8 rounded-xl shadow-lg" data-testid="card-promotion-new-customer">
                <div className="text-center">
                  <Star className="h-12 w-12 mx-auto mb-4" style={{color: '#27A844'}} />
                  <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>New Customer</h3>
                  <p className="text-4xl font-bold mb-2" style={{color: '#27A844'}}>20% OFF</p>
                  <p className="text-sm text-gray-600">On your first order over 5kg</p>
                </div>
              </Card>

              <Card className="bg-white p-8 rounded-xl shadow-lg" data-testid="card-promotion-bulk-discount">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4" style={{color: '#3F85C8'}} />
                  <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>Bulk Orders</h3>
                  <p className="text-4xl font-bold mb-2" style={{color: '#27A844'}}>15% OFF</p>
                  <p className="text-sm text-gray-600">Orders over 10kg</p>
                </div>
              </Card>

              <Card className="bg-white p-8 rounded-xl shadow-lg" data-testid="card-promotion-weekly">
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4" style={{color: '#1C1C4D'}} />
                  <h3 className="text-xl font-bold mb-2" style={{color: '#1C1C4D'}}>Weekly Service</h3>
                  <p className="text-4xl font-bold mb-2" style={{color: '#27A844'}}>25% OFF</p>
                  <p className="text-sm text-gray-600">Subscribe for regular pickup</p>
                </div>
              </Card>
            </div>

            <div className="mt-12">
              <Button 
                size="lg" 
                onClick={handleOrderNow}
                className="text-xl px-12 py-6 font-bold rounded-xl" 
                style={{backgroundColor: '#FFFFFF', color: '#1C1C4D'}}
                data-testid="button-claim-offer"
              >
                <Star className="mr-3 h-6 w-6" />
                CLAIM YOUR OFFER NOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-16" style={{backgroundColor: '#F8F9FA'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{color: '#1C1C4D'}}>Get in Touch</h2>
            <p className="text-xl text-gray-600">We're here to serve you with eco-friendly laundry solutions</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            
            <div>
              <div className="space-y-8">
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#27A844'}}>
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{color: '#1C1C4D'}}>Phone</p>
                    <p className="text-gray-600 text-lg">+973 37960004</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#27A844'}}>
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{color: '#1C1C4D'}}>WhatsApp Support</p>
                    <p className="text-gray-600">24/7 customer service</p>
                    <a href="#" className="text-blue-600 hover:underline" data-testid="link-chatbot">Chat with our AI assistant</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#27A844'}}>
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{color: '#1C1C4D'}}>Location</p>
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
                  className="font-semibold"
                  style={{backgroundColor: '#27A844', color: '#FFFFFF'}}
                  data-testid="button-contact-whatsapp"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Us
                </Button>
                <Button 
                  onClick={handlePhoneCall}
                  variant="outline"
                  className="font-semibold"
                  style={{borderColor: '#3F85C8', color: '#3F85C8'}}
                  data-testid="button-contact-phone"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </div>

            <div>
              <Card className="p-8 bg-white shadow-lg" style={{borderColor: '#3F85C8', borderWidth: '2px'}}>
                <h3 className="text-2xl font-bold mb-6" style={{color: '#1C1C4D'}}>Service Hours</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Sunday - Thursday</span>
                    <span className="font-bold" style={{color: '#1C1C4D'}}>8:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Friday - Saturday</span>
                    <span className="font-bold" style={{color: '#1C1C4D'}}>9:00 AM - 11:00 PM</span>
                  </div>
                  <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: '#E8F5E8'}}>
                    <p className="font-medium" style={{color: '#27A844'}}>
                      <Truck className="inline h-5 w-5 mr-2" />
                      Free pickup & delivery in Hoora & Manama
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with App Links */}
      <footer style={{backgroundColor: '#1C1C4D', color: '#FFFFFF'}} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <img 
                  src="/icons/ola-logo-original.jpg" 
                  alt="OLA Laundry Logo" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-2xl font-bold">OLA LAUNDRY</h3>
                  <p className="text-sm" style={{color: '#27A844'}}>Clean • Green • Crisp</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Bahrain's first 100% eco-friendly laundry service with sustainable operations and innovative technology.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Download Our Apps</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="/customer-app" 
                  className="hover:bg-gray-700 px-4 py-3 rounded-lg flex items-center justify-center space-x-3 transition-colors"
                  style={{backgroundColor: '#3F85C8'}}
                  data-testid="link-app-store"
                >
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-xs text-gray-200">Download on the</p>
                    <p className="font-semibold">App Store</p>
                  </div>
                </a>
                <a 
                  href="/customer-app" 
                  className="hover:bg-gray-700 px-4 py-3 rounded-lg flex items-center justify-center space-x-3 transition-colors"
                  style={{backgroundColor: '#3F85C8'}}
                  data-testid="link-play-store"
                >
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-xs text-gray-200">Get it on</p>
                    <p className="font-semibold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <div><a href="#home" className="text-gray-300 hover:text-white" data-testid="footer-home">Home</a></div>
                <div><a href="#about" className="text-gray-300 hover:text-white" data-testid="footer-about">About Us</a></div>
                <div><a href="#contact" className="text-gray-300 hover:text-white" data-testid="footer-contact">Contact Us</a></div>
                <div><a href="/laundry-master-software" className="text-gray-300 hover:text-white" data-testid="footer-software">Laundry Master Software</a></div>
                <div><a href="/tenant-management" className="text-gray-300 hover:text-white" data-testid="footer-tenants">Tenants List</a></div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-4">OLA ORDERS LAUNDRY W.L.L</h3>
              <p className="text-gray-300 text-sm mb-2">First of a kind in Bahrain</p>
              <p className="text-gray-300 text-sm mb-6">Hygienic • Affordable • Sustainable</p>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleWhatsAppContact}
                  className="font-semibold"
                  style={{backgroundColor: '#27A844', color: '#FFFFFF'}}
                  data-testid="button-footer-whatsapp"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Support
                </Button>
                <Button 
                  onClick={handlePhoneCall}
                  variant="outline"
                  className="font-semibold border-white text-white hover:bg-white hover:text-gray-900"
                  data-testid="button-footer-call"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
              
              <div className="mt-4 flex justify-center md:justify-end space-x-4 text-gray-300">
                <a href="#" className="hover:text-white" data-testid="link-social-facebook">📱</a>
                <a href="#" className="hover:text-white" data-testid="link-social-instagram">📷</a>
                <a href="#" className="hover:text-white" data-testid="link-social-twitter">🐦</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              © 2024 OLA ORDERS LAUNDRY W.L.L. All rights reserved. • www.Olalaundry.com
            </p>
          </div>
        </div>
      </footer>
      
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={handleWhatsAppContact}
          size="lg"
          className="rounded-full w-16 h-16 shadow-2xl"
          style={{backgroundColor: '#27A844', color: '#FFFFFF'}}
          data-testid="button-floating-whatsapp"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}