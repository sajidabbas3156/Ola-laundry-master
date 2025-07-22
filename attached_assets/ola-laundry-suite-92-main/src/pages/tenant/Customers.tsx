
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Crown, Star, Gift, Wallet, Plus } from "lucide-react";
import { CustomerList } from "@/components/customers/CustomerList";
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { CustomerLoyaltyProgram } from "@/components/customers/CustomerLoyaltyProgram";
import { CustomerWalletSystem } from "@/components/customers/CustomerWalletSystem";
import { CustomerCouponsSystem } from "@/components/customers/CustomerCouponsSystem";
import { PremiumCustomerTiers } from "@/components/customers/PremiumCustomerTiers";
import { useCustomers } from "@/contexts/CustomerContext";
import { useTenant } from "@/contexts/TenantContext";

export default function Customers() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCustomersByTenant } = useCustomers();
  const { currentTenant } = useTenant();

  const customers = currentTenant ? getCustomersByTenant(currentTenant.id) : [];
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-4 md:space-y-6 responsive-p">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 md:h-8 md:w-8" />
            Customer Management
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage customers, loyalty points, wallets, and premium services</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-lg md:text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Premium Members</p>
                <p className="text-lg md:text-2xl font-bold">89</p>
              </div>
              <Crown className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Active Loyalty Points</p>
                <p className="text-lg md:text-2xl font-bold">45,230</p>
              </div>
              <Star className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Wallet Balance</p>
                <p className="text-lg md:text-2xl font-bold">2,450 BD</p>
              </div>
              <Wallet className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-customers" className="space-y-4">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="grid grid-cols-5 w-full min-w-max md:min-w-0 h-auto p-1">
            <TabsTrigger value="all-customers" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Users className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">All Customers</span>
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Crown className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Premium</span>
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Star className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Loyalty</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Wallet className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex flex-col items-center gap-1 px-2 py-2 text-xs md:text-sm md:flex-row md:gap-2 md:px-4 md:py-3">
              <Gift className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Coupons</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all-customers">
          <Card>
            <CardHeader>
              <CardTitle>All Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full max-w-sm px-3 py-2 border rounded-md text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CustomerList customers={filteredCustomers} searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="premium">
          <PremiumCustomerTiers />
        </TabsContent>

        <TabsContent value="loyalty">
          <CustomerLoyaltyProgram />
        </TabsContent>

        <TabsContent value="wallet">
          <CustomerWalletSystem />
        </TabsContent>

        <TabsContent value="coupons">
          <CustomerCouponsSystem />
        </TabsContent>
      </Tabs>

      <AddCustomerDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
