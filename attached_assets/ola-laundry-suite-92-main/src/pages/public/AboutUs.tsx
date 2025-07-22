import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutUs() {
  const team = [
    {
      name: "Sajid Abbas",
      role: "CEO & Founder",
      image: "/placeholder.svg",
      description: "Visionary leader with extensive experience in business technology and innovation"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible in laundry management technology."
    },
    {
      icon: Users,
      title: "Customer Success",
      description: "Your success is our success. We're committed to helping your business grow and thrive."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from code quality to customer service."
    },
    {
      icon: Heart,
      title: "Community",
      description: "We believe in building strong relationships and supporting the laundry business community."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <Badge className="mb-4 bg-ola-100 text-ola-700">About Ola Laundry</Badge>
            <h1 className="text-5xl font-bold mb-6">Revolutionizing Laundry Management</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Founded in 2020, Ola Laundry has been at the forefront of transforming how laundry businesses operate. 
              We're passionate about helping small and medium-sized laundry services compete with enterprise-level efficiency.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  To democratize advanced laundry management technology, making it accessible and affordable 
                  for businesses of all sizes. We believe every laundry service deserves enterprise-grade tools 
                  to streamline operations, delight customers, and grow their business.
                </p>
                <p className="text-lg text-gray-600">
                  Since our founding, we've helped over 10,000 laundry businesses increase their efficiency 
                  by an average of 40% and improve customer satisfaction scores by 60%.
                </p>
              </div>
              <div className="bg-gradient-to-r from-ola-100 to-blue-100 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-ola-600">10,000+</div>
                    <div className="text-gray-600">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-ola-600">50M+</div>
                    <div className="text-gray-600">Orders Processed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-ola-600">99.9%</div>
                    <div className="text-gray-600">Uptime</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-ola-600">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-b from-ola-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we do and shape how we build products and serve our customers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="h-16 w-16 bg-gradient-to-r from-ola-600 to-ola-700 rounded-xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Leadership</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the visionary leading Ola Laundry's mission to transform the laundry industry.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="text-center group max-w-md">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-r from-ola-100 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Avatar className="w-44 h-44">
                    <AvatarImage src={team[0].image} alt={team[0].name} />
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-r from-ola-600 to-ola-700 text-white">
                      SA
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-2xl font-bold mb-2">{team[0].name}</h3>
                <p className="text-ola-600 font-medium mb-4 text-lg">{team[0].role}</p>
                <p className="text-gray-600 text-lg">{team[0].description}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
