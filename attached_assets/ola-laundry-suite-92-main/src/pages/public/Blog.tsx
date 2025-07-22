
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      title: "10 Ways to Improve Your Laundry Business Efficiency",
      excerpt: "Discover proven strategies to streamline your operations and increase profitability in the competitive laundry industry.",
      author: "Sarah Johnson",
      date: "March 15, 2025",
      readTime: "5 min read",
      category: "Business Tips",
      image: "/placeholder.svg"
    },
    {
      title: "The Future of Laundry Technology: AI and Automation",
      excerpt: "Explore how artificial intelligence and automation are revolutionizing the laundry industry and what it means for your business.",
      author: "Mike Chen",
      date: "March 10, 2025", 
      readTime: "8 min read",
      category: "Technology",
      image: "/placeholder.svg"
    },
    {
      title: "Customer Retention Strategies for Laundry Services",
      excerpt: "Learn effective techniques to keep your customers coming back and build long-term loyalty in your laundry business.",
      author: "Lisa Rodriguez",
      date: "March 5, 2025",
      readTime: "6 min read",
      category: "Customer Service",
      image: "/placeholder.svg"
    },
    {
      title: "Implementing a Mobile-First Strategy for Your Laundry Business",
      excerpt: "Why mobile apps are essential for modern laundry services and how to implement them successfully.",
      author: "David Kim",
      date: "February 28, 2025",
      readTime: "7 min read",
      category: "Technology",
      image: "/placeholder.svg"
    },
    {
      title: "Sustainable Practices in the Laundry Industry",
      excerpt: "How to make your laundry business more environmentally friendly while reducing costs and attracting eco-conscious customers.",
      author: "Emma Green",
      date: "February 20, 2025",
      readTime: "5 min read",
      category: "Sustainability",
      image: "/placeholder.svg"
    },
    {
      title: "Pricing Strategies That Drive Revenue Growth",
      excerpt: "Learn how to price your services competitively while maximizing profitability and customer satisfaction.",
      author: "John Martinez",
      date: "February 15, 2025",
      readTime: "6 min read",
      category: "Business Tips",
      image: "/placeholder.svg"
    }
  ];

  const categories = ["All", "Business Tips", "Technology", "Customer Service", "Sustainability"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <Badge className="mb-4 bg-ola-100 text-ola-700">Ola Laundry Blog</Badge>
            <h1 className="text-5xl font-bold mb-6">Insights & Resources</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Stay updated with the latest trends, tips, and best practices in the laundry industry. 
              Our expert insights help you grow your business and stay ahead of the competition.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <Button key={category} variant="outline" className="hover:bg-ola-100 hover:border-ola-300">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <Card className="mb-12 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-gradient-to-r from-ola-100 to-blue-100 p-8 lg:p-12 flex items-center">
                  <div>
                    <Badge className="mb-4 bg-ola-600 text-white">Featured</Badge>
                    <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
                    <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {blogPosts[0].author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {blogPosts[0].date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {blogPosts[0].readTime}
                      </div>
                    </div>
                    <Button className="bg-ola-600 hover:bg-ola-700">Read More</Button>
                  </div>
                </div>
                <div className="h-64 lg:h-auto">
                  <img src={blogPosts[0].image} alt={blogPosts[0].title} className="w-full h-full object-cover" />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-ola-600 transition-colors">{post.title}</CardTitle>
                    <CardDescription className="text-gray-600">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-ola-600 hover:text-ola-700">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
