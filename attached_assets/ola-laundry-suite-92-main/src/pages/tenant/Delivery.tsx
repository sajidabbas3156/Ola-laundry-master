
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Users, Route, BarChart3, Radio, Bell } from "lucide-react";
import { DriverManagement } from "@/components/delivery/DriverManagement";
import { RouteTracking } from "@/components/delivery/RouteTracking";
import { RouteOptimization } from "@/components/delivery/RouteOptimization";
import { RealTimeTracking } from "@/components/delivery/RealTimeTracking";
import { DeliveryAnalytics } from "@/components/delivery/DeliveryAnalytics";
import { NotificationSystem } from "@/components/delivery/NotificationSystem";
import { EnhancedDriverAssignment } from "@/components/delivery/EnhancedDriverAssignment";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";

export default function TenantDelivery() {
  const { currentTenant } = useTenant();
  const { getDriverStats, getOrderStats } = useData();
  
  const driverStats = currentTenant?.id ? getDriverStats(currentTenant.id) : {
    available: 0,
    busy: 0,
    offline: 0
  };
  
  const orderStats = currentTenant?.id ? getOrderStats(currentTenant.id) : {
    pending: 0,
    processing: 0,
    ready: 0,
    delivered: 0
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <p className="text-gray-600 mt-1">Complete delivery management system</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Enhanced with Assignment System
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Drivers</p>
                <p className="text-2xl font-bold text-green-600">{driverStats.available}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Busy Drivers</p>
                <p className="text-2xl font-bold text-blue-600">{driverStats.busy}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-orange-600">{orderStats.pending}</p>
              </div>
              <Route className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-purple-600">{orderStats.delivered}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assignment
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Live Tracking
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignment">
          <EnhancedDriverAssignment />
        </TabsContent>
        
        <TabsContent value="drivers">
          <DriverManagement />
        </TabsContent>
        
        <TabsContent value="routes">
          <RouteTracking />
        </TabsContent>
        
        <TabsContent value="optimization">
          <RouteOptimization />
        </TabsContent>
        
        <TabsContent value="tracking">
          <RealTimeTracking />
        </TabsContent>
        
        <TabsContent value="analytics">
          <DeliveryAnalytics />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
}
