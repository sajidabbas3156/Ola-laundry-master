
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Image, 
  Calendar, 
  Layout, 
  Palette, 
  Download,
  Upload,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plus,
  Search
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  type: "email" | "sms" | "social" | "flyer";
  category: string;
  lastModified: string;
  preview: string;
  usage: number;
}

interface Asset {
  id: string;
  name: string;
  type: "image" | "logo" | "icon";
  size: string;
  format: string;
  lastUsed: string;
  url: string;
}

export function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [templates] = useState<Template[]>([
    {
      id: "1",
      name: "Welcome Email",
      type: "email",
      category: "onboarding",
      lastModified: "2024-06-10",
      preview: "Welcome to our laundry service! We're excited to...",
      usage: 45
    },
    {
      id: "2",
      name: "Order Ready SMS",
      type: "sms",
      category: "notifications",
      lastModified: "2024-06-08",
      preview: "Hi {name}, your laundry order #{order} is ready...",
      usage: 128
    },
    {
      id: "3",
      name: "Summer Promotion",
      type: "social",
      category: "promotions",
      lastModified: "2024-06-12",
      preview: "Beat the heat with our summer special! 30% off...",
      usage: 23
    },
    {
      id: "4",
      name: "Service Menu Flyer",
      type: "flyer",
      category: "marketing",
      lastModified: "2024-06-05",
      preview: "Professional laundry services at your doorstep...",
      usage: 12
    }
  ]);

  const [assets] = useState<Asset[]>([
    {
      id: "1",
      name: "Company Logo",
      type: "logo",
      size: "256 KB",
      format: "PNG",
      lastUsed: "2024-06-12",
      url: "/placeholder.svg"
    },
    {
      id: "2",
      name: "Washing Machine Icon",
      type: "icon",
      size: "64 KB",
      format: "SVG",
      lastUsed: "2024-06-10",
      url: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Summer Promo Banner",
      type: "image",
      size: "512 KB",
      format: "JPG",
      lastUsed: "2024-06-11",
      url: "/placeholder.svg"
    }
  ]);

  const getTypeColor = (type: Template["type"]) => {
    switch (type) {
      case "email": return "bg-blue-100 text-blue-800";
      case "sms": return "bg-green-100 text-green-800";
      case "social": return "bg-purple-100 text-purple-800";
      case "flyer": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: Template["type"]) => {
    switch (type) {
      case "email": return <FileText className="h-4 w-4" />;
      case "sms": return <FileText className="h-4 w-4" />;
      case "social": return <Image className="h-4 w-4" />;
      case "flyer": return <Layout className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="assets">Brand Assets</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select 
              className="px-3 py-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="onboarding">Onboarding</option>
              <option value="notifications">Notifications</option>
              <option value="promotions">Promotions</option>
              <option value="marketing">Marketing</option>
            </select>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <Badge className={getTypeColor(template.type)}>
                      {template.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.preview}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Used {template.usage} times</span>
                    <span>Modified {new Date(template.lastModified).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search assets..."
              className="sm:max-w-sm"
            />
            <Button className="flex items-center gap-2 sm:ml-auto">
              <Upload className="h-4 w-4" />
              Upload Asset
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {assets.map((asset) => (
              <Card key={asset.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <img 
                      src={asset.url} 
                      alt={asset.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{asset.name}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{asset.format}</span>
                      <span>{asset.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last used: {new Date(asset.lastUsed).toLocaleDateString()}
                    </p>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Brand Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Colors</label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                    <div className="w-8 h-8 bg-blue-500 rounded border"></div>
                    <div className="w-8 h-8 bg-blue-400 rounded border"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secondary Colors</label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded border"></div>
                    <div className="w-8 h-8 bg-green-500 rounded border"></div>
                    <div className="w-8 h-8 bg-green-400 rounded border"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Fonts</label>
                <div className="space-y-1">
                  <p className="font-bold">Primary: Inter (Bold)</p>
                  <p className="font-medium">Secondary: Inter (Medium)</p>
                  <p className="font-normal">Body: Inter (Regular)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Content Calendar
                </CardTitle>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-7">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center">
                      <h4 className="font-medium text-sm mb-2">{day}</h4>
                      <div className="space-y-2">
                        {day === "Mon" && (
                          <div className="p-2 bg-blue-50 rounded text-xs">
                            <Badge variant="outline" className="text-xs">Email</Badge>
                            <p className="mt-1">Newsletter</p>
                          </div>
                        )}
                        {day === "Wed" && (
                          <div className="p-2 bg-green-50 rounded text-xs">
                            <Badge variant="outline" className="text-xs">SMS</Badge>
                            <p className="mt-1">Promo Alert</p>
                          </div>
                        )}
                        {day === "Fri" && (
                          <div className="p-2 bg-purple-50 rounded text-xs">
                            <Badge variant="outline" className="text-xs">Social</Badge>
                            <p className="mt-1">Weekend Post</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Upcoming Content</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-100 text-blue-800">Email</Badge>
                        <span className="text-sm">Monthly Newsletter</span>
                      </div>
                      <span className="text-sm text-muted-foreground">June 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800">SMS</Badge>
                        <span className="text-sm">Weekend Special</span>
                      </div>
                      <span className="text-sm text-muted-foreground">June 16, 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-purple-100 text-purple-800">Social</Badge>
                        <span className="text-sm">Customer Spotlight</span>
                      </div>
                      <span className="text-sm text-muted-foreground">June 18, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
