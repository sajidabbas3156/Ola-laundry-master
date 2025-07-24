import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Settings, 
  Clock, 
  DollarSign, 
  Globe, 
  Shield, 
  Bell,
  Mail,
  Smartphone,
  MapPin,
  Calendar,
  Save,
  RefreshCw
} from 'lucide-react';

interface BusinessSetting {
  id: number;
  tenantId: number;
  settingKey: string;
  settingValue: string;
  category: string;
  description?: string;
  isActive: boolean;
  updatedAt: string;
}

export default function BusinessSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // General Settings
    businessName: 'OLA Laundry',
    businessDescription: 'Professional laundry and dry cleaning services',
    businessPhone: '+973 1234 5678',
    businessEmail: 'info@olalaundry.bh',
    businessAddress: '123 Main Street, Manama, Bahrain',
    
    // Operating Hours
    mondayHours: '08:00-20:00',
    tuesdayHours: '08:00-20:00',
    wednesdayHours: '08:00-20:00',
    thursdayHours: '08:00-20:00',
    fridayHours: '14:00-20:00',
    saturdayHours: '08:00-20:00',
    sundayHours: 'Closed',
    
    // Pricing Settings
    deliveryFee: 2.50,
    minimumOrder: 10.00,
    expressServiceFee: 5.00,
    taxRate: 10,
    currency: 'BHD',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderConfirmations: true,
    statusUpdates: true,
    promotionalMessages: false,
    
    // System Settings
    autoAcceptOrders: false,
    requireOrderApproval: true,
    enableReviews: true,
    enableLoyaltyProgram: true,
    timezone: 'Asia/Bahrain',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    apiAccessEnabled: false
  });

  // Fetch business settings
  const { data: businessSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/business-settings'],
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: any) => {
      return apiRequest('PUT', '/api/business-settings', updatedSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/business-settings'] });
      toast({
        title: "Settings Updated",
        description: "Your business settings have been saved successfully.",
      });
    },
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LaundrySpinner variant="washing" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Settings</h1>
        <p className="text-gray-600">Configure your laundry business preferences and operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Business Information</span>
              </CardTitle>
              <CardDescription>Basic information about your laundry business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    value={settings.businessName}
                    onChange={(e) => handleSettingChange('businessName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="business-phone">Phone Number</Label>
                  <Input
                    id="business-phone"
                    value={settings.businessPhone}
                    onChange={(e) => handleSettingChange('businessPhone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="business-email">Email Address</Label>
                <Input
                  id="business-email"
                  type="email"
                  value={settings.businessEmail}
                  onChange={(e) => handleSettingChange('businessEmail', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="business-description">Business Description</Label>
                <Textarea
                  id="business-description"
                  value={settings.businessDescription}
                  onChange={(e) => handleSettingChange('businessDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="business-address">Business Address</Label>
                <Textarea
                  id="business-address"
                  value={settings.businessAddress}
                  onChange={(e) => handleSettingChange('businessAddress', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Localization</span>
              </CardTitle>
              <CardDescription>Language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Bahrain">Asia/Bahrain</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operating Hours */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Operating Hours</span>
              </CardTitle>
              <CardDescription>Set your business operating hours for each day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'mondayHours', label: 'Monday' },
                { key: 'tuesdayHours', label: 'Tuesday' },
                { key: 'wednesdayHours', label: 'Wednesday' },
                { key: 'thursdayHours', label: 'Thursday' },
                { key: 'fridayHours', label: 'Friday' },
                { key: 'saturdayHours', label: 'Saturday' },
                { key: 'sundayHours', label: 'Sunday' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-4">
                  <div className="w-24">
                    <Label>{label}</Label>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={settings[key as keyof typeof settings] as string}
                      onChange={(e) => handleSettingChange(key, e.target.value)}
                      placeholder="08:00-20:00 or Closed"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Settings */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Pricing Configuration</span>
              </CardTitle>
              <CardDescription>Configure your pricing and fee structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delivery-fee">Delivery Fee ({settings.currency})</Label>
                  <Input
                    id="delivery-fee"
                    type="number"
                    step="0.01"
                    value={settings.deliveryFee}
                    onChange={(e) => handleSettingChange('deliveryFee', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="minimum-order">Minimum Order Amount ({settings.currency})</Label>
                  <Input
                    id="minimum-order"
                    type="number"
                    step="0.01"
                    value={settings.minimumOrder}
                    onChange={(e) => handleSettingChange('minimumOrder', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="express-fee">Express Service Fee ({settings.currency})</Label>
                  <Input
                    id="express-fee"
                    type="number"
                    step="0.01"
                    value={settings.expressServiceFee}
                    onChange={(e) => handleSettingChange('expressServiceFee', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BHD">BHD - Bahraini Dinar</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Configure how you want to communicate with customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Communication Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-600">Send push notifications to mobile apps</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Confirmations</Label>
                      <p className="text-sm text-gray-600">Notify when orders are confirmed</p>
                    </div>
                    <Switch
                      checked={settings.orderConfirmations}
                      onCheckedChange={(checked) => handleSettingChange('orderConfirmations', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Status Updates</Label>
                      <p className="text-sm text-gray-600">Notify on order status changes</p>
                    </div>
                    <Switch
                      checked={settings.statusUpdates}
                      onCheckedChange={(checked) => handleSettingChange('statusUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Promotional Messages</Label>
                      <p className="text-sm text-gray-600">Send marketing and promotional content</p>
                    </div>
                    <Switch
                      checked={settings.promotionalMessages}
                      onCheckedChange={(checked) => handleSettingChange('promotionalMessages', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>System Configuration</span>
              </CardTitle>
              <CardDescription>Configure system behavior and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Order Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Accept Orders</Label>
                      <p className="text-sm text-gray-600">Automatically accept new orders</p>
                    </div>
                    <Switch
                      checked={settings.autoAcceptOrders}
                      onCheckedChange={(checked) => handleSettingChange('autoAcceptOrders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Order Approval</Label>
                      <p className="text-sm text-gray-600">Orders need manual approval before processing</p>
                    </div>
                    <Switch
                      checked={settings.requireOrderApproval}
                      onCheckedChange={(checked) => handleSettingChange('requireOrderApproval', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Customer Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Reviews</Label>
                      <p className="text-sm text-gray-600">Allow customers to leave reviews</p>
                    </div>
                    <Switch
                      checked={settings.enableReviews}
                      onCheckedChange={(checked) => handleSettingChange('enableReviews', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Loyalty Program</Label>
                      <p className="text-sm text-gray-600">Enable customer loyalty points system</p>
                    </div>
                    <Switch
                      checked={settings.enableLoyaltyProgram}
                      onCheckedChange={(checked) => handleSettingChange('enableLoyaltyProgram', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>API Access</Label>
                      <p className="text-sm text-gray-600">Enable API access for integrations</p>
                    </div>
                    <Switch
                      checked={settings.apiAccessEnabled}
                      onCheckedChange={(checked) => handleSettingChange('apiAccessEnabled', checked)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Input
                        id="password-expiry"
                        type="number"
                        value={settings.passwordExpiry}
                        onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Changes
        </Button>
        <Button
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
        >
          {updateSettingsMutation.isPending ? (
            <>
              <LaundrySpinner variant="washing" size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}