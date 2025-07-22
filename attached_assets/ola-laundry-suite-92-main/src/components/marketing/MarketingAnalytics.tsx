
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Mail, 
  MessageSquare,
  Share2,
  Target,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function MarketingAnalytics() {
  // Mock data for analytics
  const campaignPerformanceData = [
    { month: "Jan", email: 4200, sms: 1800, social: 3200 },
    { month: "Feb", email: 3800, sms: 2200, social: 2800 },
    { month: "Mar", email: 5200, sms: 1900, social: 3800 },
    { month: "Apr", email: 4800, sms: 2400, social: 4200 },
    { month: "May", email: 6200, sms: 2100, social: 3600 },
    { month: "Jun", email: 7200, sms: 2800, social: 4800 }
  ];

  const customerAcquisitionData = [
    { month: "Jan", organic: 120, referral: 80, paid: 60 },
    { month: "Feb", organic: 140, referral: 95, paid: 75 },
    { month: "Mar", organic: 165, referral: 110, paid: 85 },
    { month: "Apr", organic: 180, referral: 125, paid: 95 },
    { month: "May", organic: 200, referral: 140, paid: 110 },
    { month: "Jun", organic: 220, referral: 155, paid: 125 }
  ];

  const channelDistribution = [
    { name: "Email", value: 45, color: "#3B82F6" },
    { name: "SMS", value: 25, color: "#10B981" },
    { name: "Social Media", value: 20, color: "#F59E0B" },
    { name: "Direct", value: 10, color: "#8B5CF6" }
  ];

  const conversionFunnelData = [
    { stage: "Awareness", visitors: 10000, rate: 100 },
    { stage: "Interest", visitors: 7500, rate: 75 },
    { stage: "Consideration", visitors: 3000, rate: 30 },
    { stage: "Purchase", visitors: 450, rate: 4.5 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ROMI</p>
              <p className="text-xl font-bold">285%</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% vs last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CAC</p>
              <p className="text-xl font-bold">$42</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                -8% vs last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">LTV</p>
              <p className="text-xl font-bold">$680</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +15% vs last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-xl font-bold">4.5%</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +0.8% vs last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Campaign Performance by Channel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="email" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="sms" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="social" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Open Rate</span>
                    <span className="font-medium">24.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Click Rate</span>
                    <span className="font-medium">6.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Conversion</span>
                    <span className="font-medium">2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  SMS Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Delivery Rate</span>
                    <span className="font-medium">98.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Click Rate</span>
                    <span className="font-medium">12.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Conversion</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-orange-600" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reach</span>
                    <span className="font-medium">12.5K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Engagement</span>
                    <span className="font-medium">4.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Conversion</span>
                    <span className="font-medium">1.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="acquisition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Acquisition Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerAcquisitionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="organic" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="referral" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="paid" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={channelDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {channelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelDistribution.map((channel) => (
                    <div key={channel.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: channel.color }}
                        />
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{channel.value}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Marketing Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="text-right">
                        <span className="text-lg font-bold">{stage.visitors.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-2">({stage.rate}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${stage.rate}%` }}
                      >
                        {stage.rate}%
                      </div>
                    </div>
                    {index < conversionFunnelData.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
