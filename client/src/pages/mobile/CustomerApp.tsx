import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useData } from "@/contexts/DataContext";
import { useCustomer } from "@/contexts/CustomerContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Store,
  Package,
  Gift,
  Wallet,
  User,
  Phone,
  MapPin,
  Clock,
  Star,
  Droplets,
  Shirt,
  TrendingUp,
  TrendingDown,
  Coins
} from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";
import { LaundrySpinner } from "@/components/ui/laundry-spinner";

export default function CustomerApp() {
  const [, setLocation] = useLocation();
  const { orders } = useData();
  const { selectedCustomer } = useCustomer();
  const [activeTab, setActiveTab] = useState("store");
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [selectedRedemption, setSelectedRedemption] = useState<number>(0);
  const { toast } = useToast();

  // Mock customer data for demo
  const customer = selectedCustomer || {
    id: 1,
    loyaltyPoints: 250,
    user: {
      firstName: "Sara",
      lastName: "Ahmed",
      email: "sara.ahmed@gmail.com",
      phone: "+973-3311-5678"
    }
  };

  // Mock wallet balance for demo
  const mockWalletBalance = 15.50;

  // Fetch loyalty data
  const { data: loyaltyData, isLoading: loyaltyLoading } = useQuery({
    queryKey: ['/api/loyalty', customer.id],
    queryFn: async () => {
      const response = await fetch(`/api/loyalty/${customer.id}`, {
        headers: {
          'Authorization': 'Bearer demo-token-123'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch loyalty data');
      return response.json();
    },
    enabled: !!customer.id,
  });

  // Fetch available redemptions
  const { data: availableRedemptions } = useQuery({
    queryKey: ['/api/loyalty', customer.id, 'available'],
    queryFn: async () => {
      const response = await fetch(`/api/loyalty/${customer.id}/available`, {
        headers: {
          'Authorization': 'Bearer demo-token-123'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch available redemptions');
      return response.json();
    },
    enabled: !!customer.id,
  });

  // Redeem points mutation
  const redeemMutation = useMutation({
    mutationFn: async (points: number) => {
      return await apiRequest(`/api/loyalty/redeem`, {
        method: 'POST',
        body: JSON.stringify({ customerId: customer.id, points }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Points Redeemed!",
        description: `You've redeemed ${data.pointsRedeemed} points for ${data.discountValue} BHD discount`,
      });
      setRedeemDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/loyalty', customer.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem points",
        variant: "destructive",
      });
    },
  });

  const handleRedemption = () => {
    if (selectedRedemption > 0) {
      redeemMutation.mutate(selectedRedemption);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">OLA</span>
            </div>
            <span className="font-semibold text-foreground">Laundry Master</span>
          </div>
          <div className="flex items-center space-x-2">
            <PWAInstallButton variant="button" size="sm" />
            <span className="text-sm text-muted-foreground">
              Hi, {customer.user?.firstName}!
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="store" className="mt-0 p-4 space-y-4">
            <div className="text-center py-8">
              <Store className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Welcome to Our Store</h2>
              <p className="text-muted-foreground mb-6">Place your laundry order with just a few taps</p>
              <Button 
                className="w-full max-w-sm"
                onClick={() => setLocation("/customer-app/new-order")}
                data-testid="button-start-order"
              >
                <LaundrySpinner variant="clothes" size="sm" className="mr-2" />
                Start New Order
              </Button>
            </div>

            {/* Quick Services */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                    <Droplets className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Wash</h3>
                  <p className="text-xs text-muted-foreground">2.5 BHD/kg</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shirt className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Iron</h3>
                  <p className="text-xs text-muted-foreground">1.5 BHD/item</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Wash+Iron</h3>
                  <p className="text-xs text-muted-foreground">3.5 BHD/kg</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0 p-4 space-y-4">
            <h2 className="text-xl font-bold mb-4">My Orders</h2>
            
            {orders.slice(0, 3).map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={order.status === 'ready' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">{order.totalAmount} BHD</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({ description: "Driver contact feature coming soon!" })}
                      data-testid={`button-contact-driver-${order.id}`}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Driver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="loyalty" className="mt-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5" />
                  Loyalty Points
                </CardTitle>
                <CardDescription>
                  Earn points with every order and redeem for discounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  {loyaltyLoading ? (
                    <LaundrySpinner variant="bubbles" size="lg" />
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-primary mb-2">
                        {loyaltyData?.balance || 0}
                      </div>
                      <p className="text-muted-foreground">Available Points</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        100 points = 5 BHD discount
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => setRedeemDialogOpen(true)}
                        disabled={!loyaltyData?.balance || loyaltyData.balance < 100}
                        data-testid="button-redeem-rewards"
                      >
                        <Coins className="mr-2 h-4 w-4" />
                        Redeem Rewards
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {loyaltyData?.history && loyaltyData.history.length > 0 ? (
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {loyaltyData.history.map((transaction: any) => (
                        <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            {transaction.points > 0 ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.points > 0 ? '+' : ''}{transaction.points}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Gift className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No transaction history yet</p>
                    <p className="text-xs mt-1">Start earning points with your orders!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="mt-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Digital Wallet
                </CardTitle>
                <CardDescription>
                  Manage your account balance and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-accent-foreground mb-2">
                    {mockWalletBalance.toFixed(2)} BHD
                  </div>
                  <p className="text-muted-foreground">Current Balance</p>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => toast({ description: "Add funds feature coming soon!" })}
                      data-testid="button-add-funds"
                    >
                      Add Funds
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => toast({ description: "Payment history feature coming soon!" })}
                      data-testid="button-payment-history"
                    >
                      Payment History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {customer.user?.firstName} {customer.user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{customer.user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.user?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Manama, Bahrain</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast({ description: "Edit profile feature coming soon!" })}
                  data-testid="button-edit-profile"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center py-2">
          {[
            { key: "store", icon: Store, label: "Store" },
            { key: "orders", icon: Package, label: "Orders" },
            { key: "loyalty", icon: Gift, label: "Loyalty" },
            { key: "wallet", icon: Wallet, label: "Wallet" },
            { key: "account", icon: User, label: "Account" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "text-primary bg-accent"
                  : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Redemption Dialog */}
      <Dialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Redeem Loyalty Points</DialogTitle>
            <DialogDescription>
              Select the amount of points you want to redeem for a discount.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-2xl font-bold text-primary">{loyaltyData?.balance || 0} points</p>
            </div>

            {availableRedemptions?.availableRedemptions && availableRedemptions.availableRedemptions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Select redemption option:</p>
                <div className="grid gap-2">
                  {availableRedemptions.availableRedemptions.map((option: any) => (
                    <Button
                      key={option.points}
                      variant={selectedRedemption === option.points ? "default" : "outline"}
                      className="w-full justify-between"
                      onClick={() => setSelectedRedemption(option.points)}
                    >
                      <span className="flex items-center">
                        <Coins className="mr-2 h-4 w-4" />
                        {option.points} points
                      </span>
                      <Badge variant="secondary">{option.value} BHD</Badge>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  You need at least 100 points to redeem
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRedeemDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRedemption}
              disabled={!selectedRedemption || redeemMutation.isPending}
            >
              {redeemMutation.isPending ? (
                <LaundrySpinner variant="bubbles" size="sm" className="mr-2" />
              ) : (
                <Gift className="mr-2 h-4 w-4" />
              )}
              Confirm Redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}