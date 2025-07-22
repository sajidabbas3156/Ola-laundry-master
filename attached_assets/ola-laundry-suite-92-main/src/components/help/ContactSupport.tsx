
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageCircle, Phone, Mail, Clock, Zap, HeadphonesIcon } from "lucide-react";
import { useState } from "react";

interface ContactSupportProps {
  onBack: () => void;
}

export function ContactSupport({ onBack }: ContactSupportProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    priority: ""
  });

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Available 24/7",
      responseTime: "< 2 minutes",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      availability: "Mon-Fri, 8AM-8PM EST",
      responseTime: "Immediate",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      availability: "24/7",
      responseTime: "< 2 hours",
      action: "Send Email"
    },
    {
      icon: HeadphonesIcon,
      title: "Screen Share",
      description: "Let us help you directly on your screen",
      availability: "Mon-Fri, 9AM-6PM EST",
      responseTime: "Schedule within 30 min",
      action: "Schedule Session"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support ticket submitted:", formData);
    // Handle form submission logic here
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        {/* Header Section */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Help Center
            </Button>
            
            <div className="text-center">
              <Badge className="mb-4 bg-ola-100 text-ola-700">Support</Badge>
              <h1 className="text-5xl font-bold mb-6">Contact Support</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Our dedicated support team is here to help you succeed. Choose your preferred way to get in touch.
              </p>
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Support Channel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportChannels.map((channel, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <channel.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{channel.title}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {channel.availability}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                        <Zap className="h-4 w-4" />
                        {channel.responseTime}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Submit a Support Ticket</h2>
                <p className="text-xl text-gray-600">
                  Fill out the form below and we'll get back to you within 2 hours.
                </p>
              </div>
              
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="account">Account Management</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="training">Training & Setup</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        Priority *
                      </label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your issue"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please provide detailed information about your issue or question..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-ola-600 hover:bg-ola-700 text-lg py-3">
                    Submit Support Ticket
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* Support Stats */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Support Performance</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're committed to providing world-class support to help your business thrive.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { metric: "< 2 min", label: "Average Response Time", description: "Live chat responses" },
                { metric: "99.8%", label: "Customer Satisfaction", description: "Based on support ratings" },
                { metric: "24/7", label: "Availability", description: "Always here when you need us" },
                { metric: "< 1 hour", label: "Issue Resolution", description: "For most common issues" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-ola-600 mb-2">{stat.metric}</div>
                  <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-20 bg-gradient-to-r from-ola-600 to-ola-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Emergency Support</h2>
            <p className="text-xl mb-8 opacity-90">
              For critical issues affecting your business operations, call our emergency hotline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-ola-600 hover:bg-gray-100">
                <Phone className="h-5 w-5 mr-2" />
                Call Emergency Hotline
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ola-600" onClick={onBack}>
                Back to Help Center
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
