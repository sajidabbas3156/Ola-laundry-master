
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/business-admin/AdminDashboard";
import { StaffManagement } from "@/components/business-admin/StaffManagement";
import { PurchasingInventory } from "@/components/business-admin/PurchasingInventory";
import { BusinessReports } from "@/components/business-admin/BusinessReports";

export default function BusinessAdmin() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Business Administration</h1>
          <p className="text-gray-600">Comprehensive business management and analytics</p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="inventory">Purchasing & Inventory</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-4">
          <StaffManagement />
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <PurchasingInventory />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <BusinessReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
