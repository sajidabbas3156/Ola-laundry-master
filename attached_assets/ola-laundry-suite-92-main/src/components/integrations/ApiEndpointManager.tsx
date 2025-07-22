
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Plus, 
  Settings, 
  Eye, 
  Copy, 
  Play,
  BarChart3,
  Shield,
  Key,
  Zap,
  Database,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  status: "active" | "inactive" | "deprecated";
  authentication: "none" | "api_key" | "bearer" | "oauth";
  lastUsed: string;
  requestCount: number;
  responseTime: number;
  successRate: number;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  lastTriggered?: string;
  deliveryCount: number;
  successRate: number;
}

export function ApiEndpointManager() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    {
      id: "1",
      name: "Get Customer Data",
      method: "GET",
      path: "/api/customers/{id}",
      description: "Retrieve customer information by ID",
      status: "active",
      authentication: "api_key",
      lastUsed: "2 minutes ago",
      requestCount: 1247,
      responseTime: 120,
      successRate: 99.2
    },
    {
      id: "2", 
      name: "Create Order",
      method: "POST",
      path: "/api/orders",
      description: "Create a new order in the system",
      status: "active",
      authentication: "bearer",
      lastUsed: "5 minutes ago",
      requestCount: 892,
      responseTime: 250,
      successRate: 98.8
    },
    {
      id: "3",
      name: "Update Payment Status",
      method: "PUT",
      path: "/api/payments/{id}/status",
      description: "Update payment status for an order",
      status: "active",
      authentication: "oauth",
      lastUsed: "1 hour ago",
      requestCount: 456,
      responseTime: 180,
      successRate: 97.5
    }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: "1",
      name: "Payment Completed",
      url: "https://app.example.com/webhooks/payment-completed",
      events: ["payment.completed", "payment.failed"],
      status: "active",
      lastTriggered: "15 minutes ago",
      deliveryCount: 234,
      successRate: 99.1
    },
    {
      id: "2",
      name: "Order Status Changed",
      url: "https://app.example.com/webhooks/order-status",
      events: ["order.created", "order.updated", "order.completed"],
      status: "active",
      lastTriggered: "2 hours ago",
      deliveryCount: 567,
      successRate: 98.5
    }
  ]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: "bg-green-100 text-green-800",
      POST: "bg-blue-100 text-blue-800", 
      PUT: "bg-yellow-100 text-yellow-800",
      DELETE: "bg-red-100 text-red-800"
    };
    return <Badge className={colors[method as keyof typeof colors]}>{method}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "deprecated":
        return <Badge className="bg-red-100 text-red-800">Deprecated</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            API Endpoint Manager
          </h2>
          <p className="text-muted-foreground">
            Manage custom API endpoints and webhook integrations
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Endpoint
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endpoints.length}</div>
            <p className="text-xs text-muted-foreground">
              {endpoints.filter(e => e.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests Today</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-green-600">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">185ms</div>
            <p className="text-xs text-green-600">-15ms from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-green-600">Excellent</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints">
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <Card key={endpoint.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedEndpoint(endpoint)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getMethodBadge(endpoint.method)}
                        <span className="font-mono text-sm">{endpoint.path}</span>
                      </div>
                      <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(endpoint.status)}
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(`${window.location.origin}${endpoint.path}`);
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Requests:</span>
                      <div className="font-medium">{endpoint.requestCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Response Time:</span>
                      <div className="font-medium">{endpoint.responseTime}ms</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <div className="font-medium text-green-600">{endpoint.successRate}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Used:</span>
                      <div className="font-medium">{endpoint.lastUsed}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{webhook.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">{webhook.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(webhook.status)}
                    <Switch checked={webhook.status === "active"} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Events:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {webhook.events.map((event, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Deliveries:</span>
                        <div className="font-medium">{webhook.deliveryCount}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <div className="font-medium text-green-600">{webhook.successRate}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Triggered:</span>
                        <div className="font-medium">{webhook.lastTriggered || "Never"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="authentication">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary API Key</Label>
                  <div className="flex items-center gap-2">
                    <Input value="lndry_sk_test_*********************" readOnly />
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary API Key</Label>
                  <div className="flex items-center gap-2">
                    <Input value="lndry_sk_prod_*********************" readOnly />
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button>Generate New Key</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Limit requests per minute</p>
                  </div>
                  <Switch checked />
                </div>
                <div className="space-y-2">
                  <Label>Rate Limit</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requests/min</SelectItem>
                      <SelectItem value="500">500 requests/min</SelectItem>
                      <SelectItem value="1000">1000 requests/min</SelectItem>
                      <SelectItem value="5000">5000 requests/min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">Restrict access by IP</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Base URL</h4>
                  <code className="text-sm">https://api.yourlaundry.com/v1</code>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include your API key in the Authorization header:
                  </p>
                  <div className="p-3 bg-gray-900 text-green-400 rounded font-mono text-sm">
                    Authorization: Bearer your-api-key
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Example Request</h4>
                  <div className="p-3 bg-gray-900 text-green-400 rounded font-mono text-sm">
                    {`curl -H "Authorization: Bearer your-api-key" \\
     -H "Content-Type: application/json" \\
     https://api.yourlaundry.com/v1/customers/123`}
                  </div>
                </div>

                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Endpoint Modal */}
      {isCreating && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Create New API Endpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Endpoint Name</Label>
                <Input placeholder="e.g., Get Customer Orders" />
              </div>
              <div className="space-y-2">
                <Label>HTTP Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Path</Label>
              <Input placeholder="/api/customers/{id}/orders" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe what this endpoint does..." />
            </div>
            <div className="flex gap-2">
              <Button>Create Endpoint</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
