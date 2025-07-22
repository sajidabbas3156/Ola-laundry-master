
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    toast.success("Message sent successfully! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", company: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@olalaundry.com",
      description: "24/7 support"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "123 Business Ave, Suite 100",
      description: "New York, NY 10001"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 9AM-6PM EST",
      description: "Weekends: 10AM-4PM EST"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <Badge className="mb-4 bg-ola-100 text-ola-700">Get In Touch</Badge>
            <h1 className="text-5xl font-bold mb-6">Contact Our Team</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Have questions about Ola Laundry? Need help getting started? Our team is here to help you 
              transform your laundry business. Reach out and we'll get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <info.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-gray-900 mb-1">{info.details}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-ola-600 hover:bg-ola-700">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-ola-600" />
                      Need Immediate Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <p className="text-gray-600 mb-4">
                      For urgent support or technical issues, you can reach us directly:
                    </p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Support: +1 (555) 123-4567
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Email: support@olalaundry.com
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Sales Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <p className="text-gray-600 mb-4">
                      Interested in learning more about our plans and pricing?
                    </p>
                    <Button className="w-full bg-ola-600 hover:bg-ola-700">
                      Schedule a Demo
                    </Button>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-ola-100 to-blue-100">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Office Location</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Ola Laundry Headquarters</strong><br />
                      123 Business Avenue, Suite 100<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
