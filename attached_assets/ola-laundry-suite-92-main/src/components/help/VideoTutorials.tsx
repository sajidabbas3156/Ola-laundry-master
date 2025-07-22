
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Clock, Users, Package, CreditCard, Smartphone, Settings, BarChart3 } from "lucide-react";

interface VideoTutorialsProps {
  onBack: () => void;
}

export function VideoTutorials({ onBack }: VideoTutorialsProps) {
  const videoCategories = [
    {
      title: "Getting Started",
      videos: [
        {
          title: "Account Setup & First Steps",
          description: "Complete walkthrough of setting up your Ola Laundry account",
          duration: "12:30",
          thumbnail: "/placeholder.svg",
          icon: Settings,
          level: "Beginner"
        },
        {
          title: "Business Configuration",
          description: "Configure your services, pricing, and business settings",
          duration: "8:45",
          thumbnail: "/placeholder.svg",
          icon: Package,
          level: "Beginner"
        },
        {
          title: "Team Setup & Permissions",
          description: "Add team members and configure user roles",
          duration: "6:20",
          thumbnail: "/placeholder.svg",
          icon: Users,
          level: "Beginner"
        }
      ]
    },
    {
      title: "Daily Operations",
      videos: [
        {
          title: "Processing Customer Orders",
          description: "Step-by-step guide to creating and managing orders",
          duration: "15:20",
          thumbnail: "/placeholder.svg",
          icon: Package,
          level: "Intermediate"
        },
        {
          title: "Payment Processing",
          description: "Handle payments, invoicing, and refunds",
          duration: "10:15",
          thumbnail: "/placeholder.svg",
          icon: CreditCard,
          level: "Intermediate"
        },
        {
          title: "Customer Communication",
          description: "Automated notifications and customer service",
          duration: "7:30",
          thumbnail: "/placeholder.svg",
          icon: Users,
          level: "Beginner"
        }
      ]
    },
    {
      title: "Mobile App",
      videos: [
        {
          title: "Driver App Overview",
          description: "Complete guide to using the mobile app for drivers",
          duration: "18:45",
          thumbnail: "/placeholder.svg",
          icon: Smartphone,
          level: "Beginner"
        },
        {
          title: "Customer Mobile Experience",
          description: "How customers use the mobile app to place orders",
          duration: "9:30",
          thumbnail: "/placeholder.svg",
          icon: Smartphone,
          level: "Beginner"
        },
        {
          title: "Route Optimization",
          description: "Optimize delivery routes for maximum efficiency",
          duration: "13:20",
          thumbnail: "/placeholder.svg",
          icon: Smartphone,
          level: "Advanced"
        }
      ]
    },
    {
      title: "Analytics & Reports",
      videos: [
        {
          title: "Dashboard Overview",
          description: "Understanding your business analytics dashboard",
          duration: "11:15",
          thumbnail: "/placeholder.svg",
          icon: BarChart3,
          level: "Intermediate"
        },
        {
          title: "Financial Reports",
          description: "Generate and interpret financial reports",
          duration: "14:20",
          thumbnail: "/placeholder.svg",
          icon: BarChart3,
          level: "Advanced"
        },
        {
          title: "Customer Analytics",
          description: "Track customer behavior and retention metrics",
          duration: "9:45",
          thumbnail: "/placeholder.svg",
          icon: BarChart3,
          level: "Intermediate"
        }
      ]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
              <Badge className="mb-4 bg-ola-100 text-ola-700">Video Tutorials</Badge>
              <h1 className="text-5xl font-bold mb-6">Learn with Video</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Watch step-by-step video tutorials to master Ola Laundry and grow your business efficiently.
              </p>
            </div>
          </div>
        </section>

        {/* Video Categories */}
        {videoCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className={`py-20 ${categoryIndex % 2 === 1 ? 'bg-white' : ''}`}>
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">{category.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.videos.map((video, videoIndex) => (
                  <Card key={videoIndex} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-ola-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                        <div className="h-16 w-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-ola-600 ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge className={getLevelColor(video.level)}>
                          {video.level}
                        </Badge>
                        <Badge variant="outline" className="bg-white bg-opacity-90">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white">
                          <video.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-ola-600 transition-colors">
                            {video.title}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription className="mt-2">
                        {video.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-ola-600 hover:bg-ola-700">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Tutorial
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Learning Path */}
        <section className="py-20 bg-gradient-to-r from-ola-600 to-ola-700 text-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Recommended Learning Path</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Follow this path to become an Ola Laundry expert in just a few hours.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: 1, title: "Account Setup", time: "30 min", description: "Get your account ready" },
                  { step: 2, title: "Daily Operations", time: "45 min", description: "Learn core workflows" },
                  { step: 3, title: "Mobile App", time: "25 min", description: "Master mobile features" },
                  { step: 4, title: "Analytics", time: "30 min", description: "Track your success" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-lg opacity-80 mb-2">{item.time}</p>
                    <p className="text-sm opacity-70">{item.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button size="lg" className="bg-white text-ola-600 hover:bg-gray-100">
                  Start Learning Path
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Complement your video learning with these helpful resources.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-6">
                <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Written Guides</h3>
                <p className="text-gray-600 mb-4">Detailed step-by-step written tutorials</p>
                <Button variant="outline" onClick={onBack}>View Guides</Button>
              </Card>
              
              <Card className="text-center p-6">
                <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Live Training</h3>
                <p className="text-gray-600 mb-4">Join our weekly live training sessions</p>
                <Button variant="outline">Join Session</Button>
              </Card>
              
              <Card className="text-center p-6">
                <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                  <Settings className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">One-on-One Support</h3>
                <p className="text-gray-600 mb-4">Get personalized help from our experts</p>
                <Button variant="outline">Schedule Call</Button>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
