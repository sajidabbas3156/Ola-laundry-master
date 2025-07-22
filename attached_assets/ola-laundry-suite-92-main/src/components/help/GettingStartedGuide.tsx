
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, User, Settings, CreditCard, Users, Package, Smartphone } from "lucide-react";

interface GettingStartedGuideProps {
  onBack: () => void;
}

export function GettingStartedGuide({ onBack }: GettingStartedGuideProps) {
  const steps = [
    {
      icon: User,
      title: "Create Your Account",
      description: "Sign up for your free trial and verify your email",
      details: [
        "Visit the Ola Laundry website and click 'Start Free Trial'",
        "Fill in your business information including name, address, and contact details",
        "Choose a unique subdomain for your business (e.g., yourbusiness.olalaundry.com)",
        "Verify your email address by clicking the confirmation link",
        "Set up your password with strong security requirements"
      ],
      timeEstimate: "5 minutes"
    },
    {
      icon: Settings,
      title: "Business Setup",
      description: "Configure your business details and services",
      details: [
        "Add your business logo and branding colors",
        "Set up your service types (wash & fold, dry cleaning, alterations, etc.)",
        "Configure pricing for each service category",
        "Set your business hours and availability",
        "Define your service areas and delivery zones",
        "Upload any required business licenses or certifications"
      ],
      timeEstimate: "10 minutes"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Add your staff members and set permissions",
      details: [
        "Go to Settings > Team Management",
        "Click 'Add Team Member' and enter their email address",
        "Assign roles: Admin, Manager, Staff, or Driver",
        "Set specific permissions for each role",
        "Send invitation emails to team members",
        "Help them complete their account setup"
      ],
      timeEstimate: "8 minutes"
    },
    {
      icon: CreditCard,
      title: "Payment Setup",
      description: "Configure payment methods and billing",
      details: [
        "Connect your Stripe or Square payment processor",
        "Set up supported payment methods (card, cash, bank transfer)",
        "Configure automatic invoicing and receipts",
        "Set up tax rates for your location",
        "Test payment processing with a small transaction",
        "Enable customer payment notifications"
      ],
      timeEstimate: "12 minutes"
    },
    {
      icon: Package,
      title: "Inventory & Services",
      description: "Set up your service catalog and inventory tracking",
      details: [
        "Create service packages and pricing tiers",
        "Set up inventory items for tracking supplies",
        "Configure low-stock alerts for cleaning supplies",
        "Add special care instructions for different fabric types",
        "Set up add-on services (starch, hangers, etc.)",
        "Create service bundles and promotional packages"
      ],
      timeEstimate: "15 minutes"
    },
    {
      icon: Smartphone,
      title: "Mobile App & Testing",
      description: "Download the mobile app and test your setup",
      details: [
        "Download the Ola Laundry mobile app from App Store or Google Play",
        "Log in with your account credentials",
        "Test creating a sample order from start to finish",
        "Verify customer notifications are working",
        "Test the driver app for pickup and delivery",
        "Ensure all team members can access their assigned features"
      ],
      timeEstimate: "10 minutes"
    }
  ];

  const quickTips = [
    "Start with a few test orders to familiarize yourself with the system",
    "Use the bulk import feature to add existing customers quickly", 
    "Set up automated SMS and email notifications to keep customers informed",
    "Configure your delivery routes for optimal efficiency",
    "Take advantage of the analytics dashboard to track your business growth"
  ];

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
              <Badge className="mb-4 bg-ola-100 text-ola-700">Getting Started</Badge>
              <h1 className="text-5xl font-bold mb-6">Complete Setup Guide</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Follow these steps to get your laundry business up and running with Ola Laundry in under 60 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">Setup Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="h-8 w-8 bg-ola-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-gray-500">{step.timeEstimate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Steps */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              {steps.map((step, index) => (
                <Card key={index} className="p-8">
                  <CardHeader className="px-0 pt-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-2xl">Step {index + 1}: {step.title}</CardTitle>
                          <Badge variant="outline">{step.timeEstimate}</Badge>
                        </div>
                        <CardDescription className="text-lg mt-2">{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0">
                    <ol className="space-y-4">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Pro Tips for Success</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickTips.map((tip, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="px-0 pb-0">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 bg-ola-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="py-20 bg-gradient-to-r from-ola-600 to-ola-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              You're all set! Your Ola Laundry system is ready to help you manage your business efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-ola-600 hover:bg-gray-100">
                Start Free Trial
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
