
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Tutorial {
  title: string;
  description: string;
  duration: string;
  steps: string[];
  onClick: () => void;
}

interface TutorialsSectionProps {
  onNavigate: (section: string) => void;
}

export function TutorialsSection({ onNavigate }: TutorialsSectionProps) {
  const tutorials: Tutorial[] = [
    {
      title: "Setting Up Your Account",
      description: "Complete walkthrough of initial account setup and configuration",
      duration: "10 min",
      steps: [
        "Create your account and verify email",
        "Complete business profile setup",
        "Configure services and pricing",
        "Add team members and set permissions",
        "Customize branding and settings"
      ],
      onClick: () => onNavigate("tutorial-account-setup")
    },
    {
      title: "Managing Customers",
      description: "Learn how to add, edit, and organize customer information",
      duration: "8 min",
      steps: [
        "Add new customers manually",
        "Import customers from CSV file",
        "Set customer preferences and notes",
        "View customer history and analytics",
        "Set up customer loyalty programs"
      ],
      onClick: () => onNavigate("tutorial-customer-management")
    },
    {
      title: "Processing Orders",
      description: "Step-by-step guide to creating and managing orders",
      duration: "12 min",
      steps: [
        "Create new orders in POS system",
        "Add items and apply pricing",
        "Set pickup and delivery schedules",
        "Process payments and receipts",
        "Track order status and updates"
      ],
      onClick: () => onNavigate("tutorial-order-processing")
    },
    {
      title: "Using the Mobile App",
      description: "Getting started with the mobile app for drivers and staff",
      duration: "15 min",
      steps: [
        "Download and install the mobile app",
        "Log in and navigate the interface",
        "View assigned routes and orders",
        "Capture photos and signatures",
        "Update order status and communicate"
      ],
      onClick: () => onNavigate("tutorial-mobile-app")
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Step-by-Step Tutorials</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tutorials.map((tutorial, index) => (
            <Card key={index} className="p-6">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                  <Badge variant="outline">{tutorial.duration}</Badge>
                </div>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <ol className="space-y-3">
                  {tutorial.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3">
                      <div className="h-6 w-6 bg-ola-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {stepIndex + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
                <Button className="w-full mt-6 bg-ola-600 hover:bg-ola-700" onClick={tutorial.onClick}>
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
