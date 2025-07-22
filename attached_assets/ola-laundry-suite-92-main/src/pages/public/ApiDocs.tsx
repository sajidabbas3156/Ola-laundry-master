
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Database, Shield, Zap, Book, Key, ExternalLink } from "lucide-react";

export default function ApiDocs() {
  const endpoints = [
    {
      method: "GET",
      path: "/customers",
      description: "Retrieve all customers",
      response: "Array of customer objects"
    },
    {
      method: "POST", 
      path: "/customers",
      description: "Create a new customer",
      response: "Created customer object"
    },
    {
      method: "GET",
      path: "/orders",
      description: "Retrieve all orders",
      response: "Array of order objects"
    },
    {
      method: "POST",
      path: "/orders",
      description: "Create a new order", 
      response: "Created order object"
    },
    {
      method: "GET",
      path: "/orders/{id}",
      description: "Retrieve a specific order",
      response: "Order object"
    },
    {
      method: "PUT",
      path: "/orders/{id}",
      description: "Update an order",
      response: "Updated order object"
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-100 text-green-800";
      case "POST": return "bg-blue-100 text-blue-800";
      case "PUT": return "bg-yellow-100 text-yellow-800";
      case "DELETE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ola-50 via-white to-blue-50">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <Badge className="mb-4 bg-ola-100 text-ola-700">API Documentation</Badge>
            <h1 className="text-5xl font-bold mb-6">Ola Laundry API</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Build powerful integrations and custom applications with our comprehensive REST API. 
              Access all your laundry business data programmatically with enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-ola-600 hover:bg-ola-700">
                <Key className="h-5 w-5 mr-2" />
                Get API Key
              </Button>
              <Button size="lg" variant="outline">
                <ExternalLink className="h-5 w-5 mr-2" />
                Interactive Docs
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Quick Start Guide</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get up and running with the Ola Laundry API in minutes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    <Key className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">1. Get API Key</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Sign up for a developer account and generate your API key from the dashboard.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">2. Authenticate</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Include your API key in the Authorization header of all requests.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    <Code className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">3. Make Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Start making API calls to retrieve and manage your laundry business data.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">4. Scale Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Build robust integrations with webhooks, rate limiting, and error handling.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">API Reference</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Complete reference for all available endpoints and methods.
              </p>
            </div>

            <Tabs defaultValue="authentication" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>

              <TabsContent value="authentication" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Authentication</CardTitle>
                    <CardDescription>
                      All API requests must include authentication credentials.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="text-green-400 mb-2"># Include your API key in the Authorization header</div>
                      <div className="text-blue-400">curl -H "Authorization: Bearer your-api-key" \</div>
                      <div className="text-blue-400 ml-4">https://api.olalaundry.com/v1/customers</div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Security:</strong> Never expose your API key in client-side code. 
                        Always make API calls from your server.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="endpoints" className="space-y-6">
                <div className="space-y-4">
                  {endpoints.map((endpoint, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Badge className={getMethodColor(endpoint.method)}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-lg font-mono">/api/v1{endpoint.path}</code>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{endpoint.description}</p>
                        <p className="text-sm text-gray-500">Returns: {endpoint.response}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create a New Order</CardTitle>
                    <CardDescription>Example request to create a new order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="text-green-400 mb-2"># POST /api/v1/orders</div>
                      <div className="text-blue-400 mb-4">curl -X POST "https://api.olalaundry.com/v1/orders" \</div>
                      <div className="text-blue-400 mb-4 ml-4">-H "Authorization: Bearer your-api-key" \</div>
                      <div className="text-blue-400 mb-4 ml-4">-H "Content-Type: application/json" \</div>
                      <div className="text-blue-400 mb-2 ml-4">-d '&#123;</div>
                      <div className="text-white ml-8">
                        <div>"customer_id": "cus_123",</div>
                        <div>"items": [</div>
                        <div className="ml-4">&#123;</div>
                        <div className="ml-8">"service": "wash_fold",</div>
                        <div className="ml-8">"quantity": 2,</div>
                        <div className="ml-8">"price": 15.99</div>
                        <div className="ml-4">&#125;</div>
                        <div>],</div>
                        <div>"pickup_date": "2025-06-03",</div>
                        <div>"delivery_date": "2025-06-05",</div>
                        <div>"notes": "Handle with care"</div>
                      </div>
                      <div className="text-blue-400 ml-4">&#125;'</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Example</CardTitle>
                    <CardDescription>Successful order creation response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="text-white">
                        <div>&#123;</div>
                        <div className="ml-2">"id": "ord_456",</div>
                        <div className="ml-2">"customer_id": "cus_123",</div>
                        <div className="ml-2">"status": "pending",</div>
                        <div className="ml-2">"total": 31.98,</div>
                        <div className="ml-2">"items": [</div>
                        <div className="ml-6">&#123;</div>
                        <div className="ml-8">"service": "wash_fold",</div>
                        <div className="ml-8">"quantity": 2,</div>
                        <div className="ml-8">"price": 15.99</div>
                        <div className="ml-6">&#125;</div>
                        <div className="ml-2">],</div>
                        <div className="ml-2">"pickup_date": "2025-06-03",</div>
                        <div className="ml-2">"delivery_date": "2025-06-05",</div>
                        <div className="ml-2">"created_at": "2025-06-02T10:30:00Z"</div>
                        <div>&#125;</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="webhooks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Webhook Events</CardTitle>
                    <CardDescription>
                      Get real-time notifications when events occur in your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold">order.created</h4>
                          <p className="text-sm text-gray-600">Triggered when a new order is created</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold">order.updated</h4>
                          <p className="text-sm text-gray-600">Triggered when an order status changes</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold">customer.created</h4>
                          <p className="text-sm text-gray-600">Triggered when a new customer registers</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold">payment.completed</h4>
                          <p className="text-sm text-gray-600">Triggered when a payment is processed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* SDKs and Libraries */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">SDKs & Libraries</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Use our official SDKs to integrate faster in your preferred language.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {["JavaScript", "Python", "PHP", "Ruby"].map((language) => (
                <Card key={language} className="text-center group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 bg-gradient-to-r from-ola-600 to-ola-700 rounded-lg flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Code className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{language}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View SDK
                    </Button>
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
