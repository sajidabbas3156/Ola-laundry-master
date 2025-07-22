
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Plus, Phone, Mail, MapPin } from "lucide-react";
import { useCustomers } from "@/contexts/CustomerContext";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "@/components/ui/sonner";

interface EnhancedCustomerSelectorProps {
  selectedCustomer: string;
  setSelectedCustomer: (customerId: string) => void;
  tenantCustomers: any[];
}

export function EnhancedCustomerSelector({
  selectedCustomer,
  setSelectedCustomer,
  tenantCustomers
}: EnhancedCustomerSelectorProps) {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    block: "",
    road: "",
    building: "",
    landmark: ""
  });

  const { addCustomer } = useCustomers();
  const { currentTenant } = useTenant();

  const cities = [
    "Manama", "Muharraq", "Riffa", "Hamad Town", "A'ali", "Isa Town", 
    "Sitra", "Budaiya", "Jidhafs", "Al-Manamah"
  ];

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim() || !currentTenant?.id) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      const fullAddress = [
        newCustomer.block && `Block ${newCustomer.block}`,
        newCustomer.road && `Road ${newCustomer.road}`,
        newCustomer.building && `Building ${newCustomer.building}`,
        newCustomer.landmark && newCustomer.landmark,
        newCustomer.city
      ].filter(Boolean).join(", ");

      const customer = addCustomer({
        tenantId: currentTenant.id,
        name: newCustomer.name.trim(),
        email: newCustomer.email.trim(),
        phone: newCustomer.phone.trim(),
        address: fullAddress,
        customerType: "regular",
        loyaltyPoints: 0,
        walletBalance: 0,
        coupons: []
      });

      setSelectedCustomer(customer.id);
      setShowAddCustomer(false);
      setNewCustomer({
        name: "", phone: "", email: "", address: "", city: "",
        block: "", road: "", building: "", landmark: ""
      });
      
      toast.success("Customer added successfully!");
    } catch (error) {
      toast.error("Failed to add customer");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {tenantCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-sm text-muted-foreground">{customer.phone}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Customer name"
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Select value={newCustomer.city} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, city: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Block No</Label>
                    <Input
                      value={newCustomer.block}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, block: e.target.value }))}
                      placeholder="Block"
                    />
                  </div>
                  <div>
                    <Label>Road No</Label>
                    <Input
                      value={newCustomer.road}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, road: e.target.value }))}
                      placeholder="Road"
                    />
                  </div>
                  <div>
                    <Label>Building No</Label>
                    <Input
                      value={newCustomer.building}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, building: e.target.value }))}
                      placeholder="Building"
                    />
                  </div>
                </div>

                <div>
                  <Label>Landmark (Optional)</Label>
                  <Input
                    value={newCustomer.landmark}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="Nearby landmark"
                  />
                </div>

                <Button 
                  onClick={handleAddCustomer}
                  disabled={!newCustomer.name.trim() || !newCustomer.phone.trim()}
                  className="w-full"
                >
                  Add Customer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
