import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCustomer } from "@/contexts/CustomerContext";
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
  DollarSign
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export default function VendorPosApp() {
  const [activeTab, setActiveTab] = useState("pos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const { customers } = useCustomer();

  // Mock services data
  const services = [
    { id: 1, name: "Regular Wash & Fold", price: 2.5, category: "wash_fold", unit: "per kg" },
    { id: 2, name: "Express Wash & Fold", price: 3.5, category: "express", unit: "per kg" },
    { id: 3, name: "Dry Cleaning - Shirt", price: 3.0, category: "dry_clean", unit: "per item" },
    { id: 4, name: "Dry Cleaning - Suit", price: 12.0, category: "dry_clean", unit: "per item" },
    { id: 5, name: "Abaya Cleaning", price: 6.0, category: "dry_clean", unit: "per item" },
    { id: 6, name: "Comforter Cleaning", price: 15.0, category: "wash_fold", unit: "per item" },
  ];

  const addToCart = (service: typeof services[0]) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === service.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: 1,
        category: service.category
      }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">OLA POS</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Staff Mode</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="pos" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              
              {/* Services Grid */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-bold">Services</h2>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search services..." className="pl-10" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => addToCart(service)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">{service.name}</h3>
                          <Plus className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex justify-between items-end">
                          <Badge variant="outline" className="text-xs">
                            {service.category.replace('_', ' ')}
                          </Badge>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              {service.price.toFixed(2)} BHD
                            </p>
                            <p className="text-xs text-gray-600">{service.unit}</p>
                          </div>
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
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName}</p>
                          <p className="text-sm text-gray-600">{selectedCustomer.user?.phone}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                          Change
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={() => setSelectedCustomer(customers[0])}>
                        <Users className="mr-2 h-4 w-4" />
                        Select Customer
                      </Button>
                    )}
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
                      <p className="text-center text-gray-500 py-8">Cart is empty</p>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600">{item.price.toFixed(2)} BHD each</p>
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
                        ))}
                        
                        <Separator />
                        
                        <div className="flex justify-between items-center font-bold">
                          <span>Total:</span>
                          <span className="text-lg text-blue-600">
                            {getTotalAmount().toFixed(2)} BHD
                          </span>
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
                        <p className="text-sm text-gray-600">2 minutes ago</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                        <p className="text-sm text-gray-600">{customer.user?.phone}</p>
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
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">487.50</div>
                  <p className="text-sm text-gray-600">Sales (BHD)</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <p className="text-sm text-gray-600">Orders</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">18</div>
                  <p className="text-sm text-gray-600">Customers</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">21.30</div>
                  <p className="text-sm text-gray-600">Avg Order (BHD)</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
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
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600"
              }`}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}