import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCustomer } from "@/contexts/CustomerContext";
import { laundryItems, laundryServices, finishingOptions, deliveryOptions } from "@/lib/laundryItems";
import AddCustomerDialog from "@/components/pos/AddCustomerDialog";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  ShoppingCart,
  Users,
  Package,
  Plus,
  Minus,
  Search,
  Receipt,
  Clock,
  DollarSign,
  UserPlus,
  Edit
} from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";
import { LaundrySpinner } from "@/components/ui/laundry-spinner";

interface CartItem {
  id: string;
  itemName: string;
  service: string;
  price: number;
  quantity: number;
  finishing: string;
  notes?: string;
}

export default function VendorPosApp() {
  const [activeTab, setActiveTab] = useState("pos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedService, setSelectedService] = useState('wash_iron');
  const [selectedFinishing, setSelectedFinishing] = useState('fold');
  const [selectedDelivery, setSelectedDelivery] = useState('store_pickup');
  const [itemNotes, setItemNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { customers } = useCustomer();
  const { toast } = useToast();

  const getServiceMultiplier = (serviceId: string) => {
    const service = laundryServices.find(s => s.id === serviceId);
    return service?.priceMultiplier || 1.0;
  };

  const addToCart = (item: typeof laundryItems[0]) => {
    const cartItemId = `${item.id}-${selectedService}-${selectedFinishing}`;
    const price = item.basePrice * getServiceMultiplier(selectedService);
    
    const existingItem = cart.find(cartItem => cartItem.id === cartItemId);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === cartItemId 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        id: cartItemId,
        itemName: item.name,
        service: selectedService,
        price: price,
        quantity: 1,
        finishing: selectedFinishing,
        notes: itemNotes
      }]);
    }
    
    toast({
      title: "Item Added",
      description: `${item.name} added to cart`,
    });
    
    // Clear notes after adding
    setItemNotes('');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    const itemsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryCharge = deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0;
    return itemsTotal + deliveryCharge;
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setItemNotes('');
  };

  const handleCustomerAdded = (customer: any) => {
    setSelectedCustomer(customer);
  };

  const filteredItems = selectedCategory === 'all' 
    ? laundryItems 
    : laundryItems.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'everyday', name: 'Everyday Wear' },
    { id: 'undergarments', name: 'Undergarments' },
    { id: 'formal', name: 'Formal Wear' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'outerwear', name: 'Outerwear' },
    { id: 'bedding', name: 'Bedding' },
    { id: 'household', name: 'Household' },
    { id: 'accessories', name: 'Accessories' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">OLA POS</span>
          </div>
          <div className="flex items-center space-x-2">
            <PWAInstallButton variant="button" size="sm" />
            <Badge variant="outline">Staff Mode</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="pos" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              
              {/* Services and Items Selection */}
              <div className="lg:col-span-2 space-y-4">
                {/* Service Selection */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Select Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {laundryServices.map((service) => (
                        <Button
                          key={service.id}
                          variant={selectedService === service.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedService(service.id)}
                          className="flex-1"
                        >
                          <span className="mr-1">{service.icon}</span>
                          {service.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Finishing Options */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Finishing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedFinishing} onValueChange={setSelectedFinishing}>
                      <div className="flex gap-4">
                        {finishingOptions.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="flex items-center cursor-pointer">
                              <span className="mr-1">{option.icon}</span>
                              {option.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    
                    <div className="mt-3">
                      <Label htmlFor="notes" className="text-sm">Special Instructions</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any special care instructions..."
                        value={itemNotes}
                        onChange={(e) => setItemNotes(e.target.value)}
                        className="mt-1 h-20"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Category Filter */}
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-bold">Items</h2>
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-2 pb-2">
                      {categories.map((cat) => (
                        <Button
                          key={cat.id}
                          variant={selectedCategory === cat.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(cat.id)}
                          className="whitespace-nowrap"
                        >
                          {cat.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => addToCart(item)}>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-3xl mb-2">{item.icon}</div>
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-lg font-bold text-secondary mt-1">
                            {(item.basePrice * getServiceMultiplier(selectedService)).toFixed(2)} BHD
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cart Sidebar */}
              <div className="space-y-4">
                {/* Customer Selection */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Customer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCustomer ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName}</p>
                            <p className="text-sm text-muted-foreground">{selectedCustomer.user?.phone}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                            Change
                          </Button>
                        </div>
                        {selectedCustomer.address && (
                          <p className="text-xs text-muted-foreground">
                            📍 {selectedCustomer.address}, {selectedCustomer.city}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" onClick={() => setShowAddCustomer(true)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add New Customer
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setSelectedCustomer(customers[0])}>
                          <Users className="mr-2 h-4 w-4" />
                          Select Existing
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Delivery Options */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Delivery Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
                      <div className="space-y-2">
                        {deliveryOptions.map((option) => (
                          <div key={option.id} className="flex items-center justify-between p-2 border border-border rounded">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={option.id} id={`delivery-${option.id}`} />
                              <Label htmlFor={`delivery-${option.id}`} className="flex items-center cursor-pointer">
                                <span className="mr-2">{option.icon}</span>
                                {option.name}
                              </Label>
                            </div>
                            <span className="text-sm font-medium">
                              {option.price > 0 ? `+${option.price.toFixed(2)} BHD` : 'Free'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Cart */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Order ({cart.length} items)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cart.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="border-b pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.itemName}</p>
                                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {laundryServices.find(s => s.id === item.service)?.name}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {finishingOptions.find(f => f.id === item.finishing)?.name}
                                  </Badge>
                                </div>
                                {item.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">📝 {item.notes}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">{item.price.toFixed(2)} BHD each</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Separator />
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} BHD</span>
                          </div>
                          {selectedDelivery === 'home_delivery' && (
                            <div className="flex justify-between">
                              <span>Delivery:</span>
                              <span>+2.00 BHD</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center font-bold text-base pt-2">
                            <span>Total:</span>
                            <span className="text-lg text-secondary">
                              {getTotalAmount().toFixed(2)} BHD
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 pt-3">
                          <Button className="w-full" disabled={!selectedCustomer}>
                            <Receipt className="mr-2 h-4 w-4" />
                            Process Order
                          </Button>
                          <Button variant="outline" className="w-full" onClick={clearCart}>
                            Clear Cart
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0 p-4 space-y-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            
            <div className="space-y-3">
              {[1, 2, 3].map((orderNum) => (
                <Card key={orderNum}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Order #00{orderNum}</p>
                        <p className="text-sm text-muted-foreground">2 minutes ago</p>
                      </div>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm">Sara Ahmed • 3 items</p>
                      <p className="font-bold">22.50 BHD</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="mt-0 p-4 space-y-4">
            <h2 className="text-xl font-bold">Customer Search</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or phone..." className="pl-10" />
            </div>

            <div className="space-y-3">
              {customers.slice(0, 3).map((customer) => (
                <Card key={customer.id} className="cursor-pointer hover:shadow-md"
                      onClick={() => setSelectedCustomer(customer)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {customer.user?.firstName} {customer.user?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{customer.user?.phone}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{customer.loyaltyPoints} pts</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-0 p-4 space-y-4">
            <h2 className="text-xl font-bold">Today's Stats</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent-foreground">487.50</div>
                  <p className="text-sm text-muted-foreground">Sales (BHD)</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-secondary">23</div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent-foreground">18</div>
                  <p className="text-sm text-muted-foreground">Customers</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent-foreground">21.30</div>
                  <p className="text-sm text-muted-foreground">Avg Order (BHD)</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center py-2">
          {[
            { key: "pos", icon: CreditCard, label: "POS" },
            { key: "orders", icon: Package, label: "Orders" },
            { key: "customers", icon: Users, label: "Customers" },
            { key: "stats", icon: DollarSign, label: "Stats" },
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
      
      {/* Add Customer Dialog */}
      <AddCustomerDialog 
        open={showAddCustomer}
        onOpenChange={setShowAddCustomer}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
}