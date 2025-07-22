
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Plus, Mail, MessageSquare, Share2, TrendingUp, Users, Calendar } from "lucide-react";
import { CampaignManagement } from "@/components/marketing/CampaignManagement";
import { CustomerEngagement } from "@/components/marketing/CustomerEngagement";
import { MarketingAnalytics } from "@/components/marketing/MarketingAnalytics";
import { ContentManagement } from "@/components/marketing/ContentManagement";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { useTenant } from "@/contexts/TenantContext";

export default function Marketing() {
  const { currentTenant } = useTenant();
  const [activeTab, setActiveTab] = useState("campaigns");

  const handleCreateCampaign = () => {
    toast.success("Opening campaign creation wizard...");
  };

  const handleQuickAction = (action: string) => {
    toast.success(`${action} initiated successfully!`);
  };

  if (!currentTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing Center</h1>
          <p className="text-gray-600 mt-1">Manage campaigns, engagement, and analytics</p>
        </div>
        <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction("Email Campaign")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Email Campaign</h3>
                <p className="text-sm text-gray-600">Send targeted emails</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction("SMS Campaign")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">SMS Campaign</h3>
                <p className="text-sm text-gray-600">Send SMS messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction("Social Media")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Social Media</h3>
                <p className="text-sm text-gray-600">Manage social posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction("Analytics")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-gray-600">View performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignManagement />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <CustomerEngagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <MarketingAnalytics />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
