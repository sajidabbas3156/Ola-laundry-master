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
import { Bell, Mail, MessageSquare, Smartphone, Send, Settings, Eye, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  tenantId: number;
  userId: number;
  title: string;
  message: string;
  type: 'order_update' | 'payment_received' | 'delivery_assigned' | 'system_alert' | 'promotion';
  channel: 'in_app' | 'email' | 'sms' | 'push';
  status: 'pending' | 'sent' | 'failed' | 'read';
  sentAt?: string;
  readAt?: string;
  createdAt: string;
}

interface NotificationTemplate {
  id: number;
  name: string;
  type: string;
  subject: string;
  content: string;
  channels: string[];
  isActive: boolean;
}

export default function NotificationsManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'order_update',
    subject: '',
    content: '',
    channels: ['in_app'],
    isActive: true
  });

  // Fetch notifications
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/notifications'],
  });

  // Fetch notification templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/notification-templates'],
  });

  // Create notification template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<NotificationTemplate, 'id'>) => {
      return apiRequest('POST', '/api/notification-templates', template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-templates'] });
      setNewTemplate({
        name: '',
        type: 'order_update',
        subject: '',
        content: '',
        channels: ['in_app'],
        isActive: true
      });
    },
  });

  // Send test notification mutation
  const sendTestMutation = useMutation({
    mutationFn: async (templateId: number) => {
      return apiRequest('POST', `/api/notification-templates/${templateId}/test`);
    },
  });

  const handleCreateTemplate = () => {
    createTemplateMutation.mutate(newTemplate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'push': return <Smartphone className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (notificationsLoading || templatesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LaundrySpinner variant="washing" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications Management</h1>
        <p className="text-gray-600">Manage customer communications and system notifications</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12.3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.4%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Awaiting delivery</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest customer communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(notifications as Notification[] || []).slice(0, 10).map((notification: Notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(notification.channel)}
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(notification.status)}>
                      {notification.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create New Template */}
            <Card>
              <CardHeader>
                <CardTitle>Create Template</CardTitle>
                <CardDescription>Design reusable notification templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    placeholder="Order Confirmation"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="template-type">Type</Label>
                  <Select value={newTemplate.type} onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order_update">Order Update</SelectItem>
                      <SelectItem value="payment_received">Payment Received</SelectItem>
                      <SelectItem value="delivery_assigned">Delivery Assigned</SelectItem>
                      <SelectItem value="system_alert">System Alert</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="template-subject">Subject</Label>
                  <Input
                    id="template-subject"
                    placeholder="Your order is ready!"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="template-content">Message Content</Label>
                  <Textarea
                    id="template-content"
                    placeholder="Hello {{customerName}}, your order #{{orderNumber}} is ready for pickup..."
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newTemplate.isActive}
                    onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, isActive: checked })}
                  />
                  <Label>Active Template</Label>
                </div>

                <Button 
                  onClick={handleCreateTemplate}
                  disabled={createTemplateMutation.isPending}
                  className="w-full"
                >
                  {createTemplateMutation.isPending ? (
                    <>
                      <LaundrySpinner variant="bubbles" size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Template'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Templates</CardTitle>
                <CardDescription>Manage your notification templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(templates as NotificationTemplate[] || []).map((template: NotificationTemplate) => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.subject}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={template.isActive ? "default" : "secondary"}>
                            {template.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendTestMutation.mutate(template.id)}
                            disabled={sendTestMutation.isPending}
                          >
                            Test
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{template.content.substring(0, 100)}...</p>
                      <div className="flex space-x-1">
                        {template.channels.map((channel) => (
                          <Badge key={channel} variant="outline" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Complete log of all sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(notifications as Notification[] || []).map((notification: Notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(notification.channel)}
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span>Created: {new Date(notification.createdAt).toLocaleString()}</span>
                          {notification.sentAt && (
                            <span>Sent: {new Date(notification.sentAt).toLocaleString()}</span>
                          )}
                          {notification.readAt && (
                            <span>Read: {new Date(notification.readAt).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(notification.status)}>
                        {notification.status}
                      </Badge>
                      <Badge variant="outline">{notification.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure global notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications via SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Send push notifications to mobile apps</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Updates</Label>
                    <p className="text-sm text-gray-600">Automatically notify customers of order status changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Payment Confirmations</Label>
                    <p className="text-sm text-gray-600">Send payment receipt notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Delivery Alerts</Label>
                    <p className="text-sm text-gray-600">Notify customers when delivery is assigned</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}