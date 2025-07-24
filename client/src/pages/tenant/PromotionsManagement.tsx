import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LaundrySpinner } from '@/components/ui/laundry-spinner';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Tag, 
  Percent, 
  Calendar, 
  Users, 
  TrendingUp, 
  Gift,
  Target,
  Share2,
  Copy,
  QrCode,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

interface Promotion {
  id: number;
  tenantId: number;
  name: string;
  description: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_delivery';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  targetCustomers: 'all' | 'new' | 'returning' | 'vip';
  createdAt: string;
}

export default function PromotionsManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    code: '',
    type: 'percentage' as const,
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    targetCustomers: 'all' as const
  });

  // Fetch promotions
  const { data: promotions, isLoading: promotionsLoading } = useQuery({
    queryKey: ['/api/promotions'],
  });

  // Create promotion mutation
  const createPromotionMutation = useMutation({
    mutationFn: async (promotion: Omit<Promotion, 'id' | 'tenantId' | 'usedCount' | 'createdAt'>) => {
      return apiRequest('POST', '/api/promotions', promotion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
      setNewPromotion({
        name: '',
        description: '',
        code: '',
        type: 'percentage',
        value: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        usageLimit: 100,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
        targetCustomers: 'all'
      });
      toast({
        title: "Promotion Created",
        description: "Your promotion has been created successfully.",
      });
    },
  });

  // Toggle promotion status mutation
  const togglePromotionMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return apiRequest('PATCH', `/api/promotions/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
    },
  });

  const handleCreatePromotion = () => {
    createPromotionMutation.mutate(newPromotion);
  };

  const generatePromoCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setNewPromotion({ ...newPromotion, code });
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Promotion code copied to clipboard.",
    });
  };

  const getPromotionTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return 'Percentage Off';
      case 'fixed_amount': return 'Fixed Amount';
      case 'buy_one_get_one': return 'BOGO';
      case 'free_delivery': return 'Free Delivery';
      default: return type;
    }
  };

  const getStatusColor = (promotion: Promotion) => {
    if (!promotion.isActive) return 'bg-gray-100 text-gray-800';
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    if (now < start) return 'bg-blue-100 text-blue-800';
    if (now > end) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (promotion: Promotion) => {
    if (!promotion.isActive) return 'Inactive';
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    if (now < start) return 'Scheduled';
    if (now > end) return 'Expired';
    return 'Active';
  };

  if (promotionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LaundrySpinner variant="bubbles" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Promotions & Marketing</h1>
        <p className="text-gray-600">Create and manage promotional campaigns to boost sales</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(promotions as Promotion[] || []).filter((p: Promotion) => p.isActive && new Date() >= new Date(p.startDate) && new Date() <= new Date(p.endDate)).length}
                </div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(promotions as Promotion[] || []).reduce((acc: number, p: Promotion) => acc + p.usedCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.8%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,623</div>
                <p className="text-xs text-muted-foreground">Additional revenue</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Promotions</CardTitle>
              <CardDescription>Your latest promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(promotions as Promotion[] || []).slice(0, 5).map((promotion: Promotion) => (
                  <div key={promotion.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Percent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{promotion.name}</p>
                        <p className="text-sm text-gray-600">Code: {promotion.code}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(promotion)}>
                        {getStatusText(promotion)}
                      </Badge>
                      <span className="text-sm text-gray-500">{promotion.usedCount} uses</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Promotion</CardTitle>
              <CardDescription>Design a promotional campaign to attract customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="promo-name">Promotion Name</Label>
                    <Input
                      id="promo-name"
                      placeholder="Summer Sale 2024"
                      value={newPromotion.name}
                      onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="promo-description">Description</Label>
                    <Textarea
                      id="promo-description"
                      placeholder="Get 20% off on all dry cleaning services this summer!"
                      value={newPromotion.description}
                      onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="promo-code">Promotion Code</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="promo-code"
                        placeholder="SUMMER20"
                        value={newPromotion.code}
                        onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })}
                      />
                      <Button type="button" variant="outline" onClick={generatePromoCode}>
                        Generate
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Promotion Type</Label>
                    <Select value={newPromotion.type} onValueChange={(value: any) => setNewPromotion({ ...newPromotion, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                        <SelectItem value="buy_one_get_one">Buy One Get One</SelectItem>
                        <SelectItem value="free_delivery">Free Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="promo-value">
                      {newPromotion.type === 'percentage' ? 'Discount Percentage' : 'Discount Value'}
                    </Label>
                    <Input
                      id="promo-value"
                      type="number"
                      placeholder={newPromotion.type === 'percentage' ? '20' : '10.00'}
                      value={newPromotion.value}
                      onChange={(e) => setNewPromotion({ ...newPromotion, value: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="min-order">Minimum Order Amount</Label>
                    <Input
                      id="min-order"
                      type="number"
                      placeholder="50.00"
                      value={newPromotion.minOrderAmount}
                      onChange={(e) => setNewPromotion({ ...newPromotion, minOrderAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  {newPromotion.type === 'percentage' && (
                    <div>
                      <Label htmlFor="max-discount">Maximum Discount Amount</Label>
                      <Input
                        id="max-discount"
                        type="number"
                        placeholder="100.00"
                        value={newPromotion.maxDiscount}
                        onChange={(e) => setNewPromotion({ ...newPromotion, maxDiscount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="usage-limit">Usage Limit</Label>
                    <Input
                      id="usage-limit"
                      type="number"
                      placeholder="100"
                      value={newPromotion.usageLimit}
                      onChange={(e) => setNewPromotion({ ...newPromotion, usageLimit: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Label>Target Customers</Label>
                    <Select value={newPromotion.targetCustomers} onValueChange={(value: any) => setNewPromotion({ ...newPromotion, targetCustomers: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="new">New Customers</SelectItem>
                        <SelectItem value="returning">Returning Customers</SelectItem>
                        <SelectItem value="vip">VIP Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newPromotion.isActive}
                  onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, isActive: checked })}
                />
                <Label>Activate promotion immediately</Label>
              </div>

              <Button 
                onClick={handleCreatePromotion}
                disabled={createPromotionMutation.isPending}
                className="w-full"
              >
                {createPromotionMutation.isPending ? (
                  <>
                    <LaundrySpinner variant="bubbles" size="sm" className="mr-2" />
                    Creating Promotion...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Promotion
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Tab */}
        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
              <CardDescription>Manage your currently running promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(promotions as Promotion[] || []).map((promotion: Promotion) => (
                  <div key={promotion.id} className="p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{promotion.name}</h3>
                        <p className="text-gray-600">{promotion.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(promotion)}>
                          {getStatusText(promotion)}
                        </Badge>
                        <Switch
                          checked={promotion.isActive}
                          onCheckedChange={(checked) => togglePromotionMutation.mutate({ id: promotion.id, isActive: checked })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Code</p>
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{promotion.code}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyPromoCode(promotion.code)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">{getPromotionTypeLabel(promotion.type)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Usage</p>
                        <p className="font-medium">{promotion.usedCount} / {promotion.usageLimit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Value</p>
                        <p className="font-medium">
                          {promotion.type === 'percentage' ? `${promotion.value}%` : `$${promotion.value}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Valid: {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                        <Button size="sm" variant="outline">
                          <QrCode className="h-3 w-3 mr-1" />
                          QR Code
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Redemption Trends</CardTitle>
                <CardDescription>Promotion usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <p>Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Promotions</CardTitle>
                <CardDescription>Most successful campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(promotions as Promotion[] || []).sort((a: Promotion, b: Promotion) => b.usedCount - a.usedCount).slice(0, 5).map((promotion: Promotion) => (
                    <div key={promotion.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{promotion.name}</p>
                        <p className="text-sm text-gray-500">{promotion.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{promotion.usedCount} uses</p>
                        <p className="text-sm text-gray-500">
                          {Math.round((promotion.usedCount / (promotion.usageLimit || 1)) * 100)}% of limit
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}