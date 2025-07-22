import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { 
  Mail, 
  MessageSquare, 
  Share2, 
  Calendar, 
  TrendingUp, 
  Users, 
  Edit, 
  Play, 
  Pause, 
  Copy,
  Trash2
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "social";
  status: "draft" | "active" | "paused" | "completed";
  audience: number;
  sent: number;
  opens: number;
  clicks: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
}

export function CampaignManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Summer Special Offer",
      type: "email",
      status: "active",
      audience: 2500,
      sent: 2500,
      opens: 875,
      clicks: 210,
      budget: 500,
      spent: 125,
      startDate: "2024-06-01",
      endDate: "2024-06-30"
    },
    {
      id: "2",
      name: "New Customer Welcome",
      type: "sms",
      status: "active",
      audience: 150,
      sent: 150,
      opens: 142,
      clicks: 85,
      budget: 200,
      spent: 75,
      startDate: "2024-06-10",
      endDate: "2024-07-10"
    },
    {
      id: "3",
      name: "Social Media Promotion",
      type: "social",
      status: "paused",
      audience: 10000,
      sent: 8500,
      opens: 3200,
      clicks: 450,
      budget: 1000,
      spent: 650,
      startDate: "2024-05-15",
      endDate: "2024-06-15"
    }
  ]);

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: Campaign["type"]) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "sms": return <MessageSquare className="h-4 w-4" />;
      case "social": return <Share2 className="h-4 w-4" />;
    }
  };

  const handleEditCampaign = (campaignId: string) => {
    toast.success(`Opening edit dialog for campaign ${campaignId}`);
  };

  const handleCopyCampaign = (campaignId: string) => {
    toast.success(`Campaign ${campaignId} duplicated successfully!`);
  };

  const handleToggleCampaign = (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    toast.success(`Campaign ${newStatus === "active" ? "resumed" : "paused"} successfully!`);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    toast.success(`Campaign ${campaignId} deleted successfully!`);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-sm"
        />
        <Tabs defaultValue="all" className="sm:ml-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(campaign.type)}
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {campaign.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCampaign(campaign.id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  {campaign.status === "active" ? (
                    <Button variant="ghost" size="sm" onClick={() => handleToggleCampaign(campaign.id, campaign.status)}>
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleToggleCampaign(campaign.id, campaign.status)}>
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCampaign(campaign.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Audience</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {campaign.audience.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <p className="text-lg font-semibold text-green-600">
                    {((campaign.opens / campaign.sent) * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {((campaign.clicks / campaign.sent) * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                  <p className="text-lg font-semibold">
                    ${campaign.spent} / ${campaign.budget}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  ROI: {(((campaign.clicks * 15) / campaign.spent) * 100).toFixed(0)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
