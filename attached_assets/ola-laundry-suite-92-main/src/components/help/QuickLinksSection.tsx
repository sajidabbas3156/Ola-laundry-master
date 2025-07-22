
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Video, Download, MessageCircle } from "lucide-react";

interface QuickLink {
  icon: any;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}

interface QuickLinksSectionProps {
  onNavigate: (section: string) => void;
}

export function QuickLinksSection({ onNavigate }: QuickLinksSectionProps) {
  const quickLinks: QuickLink[] = [
    {
      icon: Book,
      title: "Getting Started Guide",
      description: "Complete setup guide for new users",
      action: "Read Guide",
      onClick: () => onNavigate("getting-started")
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      action: "Watch Videos",
      onClick: () => onNavigate("video-tutorials")
    },
    {
      icon: Download,
      title: "Download Mobile App",
      description: "Get our mobile app for iOS and Android",
      action: "Download",
      onClick: () => window.open("/mobile-app", "_blank")
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Get help from our support team",
      action: "Contact Us",
      onClick: () => onNavigate("contact-support")
    }
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <link.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={link.onClick}>
                  {link.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
