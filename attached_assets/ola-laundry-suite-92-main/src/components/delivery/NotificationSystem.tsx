
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone,
  Settings,
  Check,
  AlertTriangle,
  Info
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Notification {
  id: string;
  type: "delivery_update" | "driver_alert" | "customer_feedback" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "delivery_update",
      title: "Delivery Completed",
      message: "Order #1234 has been successfully delivered to customer",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: "low"
    },
    {
      id: "2",
      type: "driver_alert",
      title: "Driver Offline",
      message: "John Doe has gone offline unexpectedly",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      priority: "high"
    },
    {
      id: "3",
      type: "customer_feedback",
      title: "New Customer Review",
      message: "5-star rating received for recent delivery",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      priority: "medium"
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    deliveryUpdates: true,
    driverAlerts: true,
    customerFeedback: true,
    systemAlerts: true
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery_update":
        return <Info className="h-4 w-4 text-blue-600" />;
      case "driver_alert":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "customer_feedback":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "delivery_update",
          title: "Route Update",
          message: `Driver ${Math.random() > 0.5 ? 'Jane Smith' : 'Mike Johnson'} is en route to next delivery`,
          timestamp: new Date(),
          read: false,
          priority: "low"
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        toast.info("New notification received");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </h2>
        <Button onClick={markAllAsRead} variant="outline" disabled={unreadCount === 0}>
          <Check className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 rounded-lg cursor-pointer transition-colors ${
                        getPriorityColor(notification.priority)
                      } ${notification.read ? 'opacity-60' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-sm">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Notification Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <Switch
                      id="email"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="sms">SMS</Label>
                    </div>
                    <Switch
                      id="sms"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="push">Push</Label>
                    </div>
                    <Switch
                      id="push"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="delivery">Delivery Updates</Label>
                    <Switch
                      id="delivery"
                      checked={notificationSettings.deliveryUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, deliveryUpdates: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="driver">Driver Alerts</Label>
                    <Switch
                      id="driver"
                      checked={notificationSettings.driverAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, driverAlerts: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="feedback">Customer Feedback</Label>
                    <Switch
                      id="feedback"
                      checked={notificationSettings.customerFeedback}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, customerFeedback: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system">System Alerts</Label>
                    <Switch
                      id="system"
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
