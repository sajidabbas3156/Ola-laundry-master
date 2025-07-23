import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CustomerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  flatNo: string;
  buildingNo: string;
  roadNo: string;
  city: string;
}

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerAdded: (customer: any) => void;
}

export default function AddCustomerDialog({ open, onOpenChange, onCustomerAdded }: AddCustomerDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    flatNo: '',
    buildingNo: '',
    roadNo: '',
    city: 'Manama',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least name and phone number",
        variant: "destructive",
      });
      return;
    }

    // Create customer object
    const newCustomer = {
      id: Date.now(), // Temporary ID
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: `${formData.phone}@customer.local`, // Temporary email
      },
      address: `Flat ${formData.flatNo}, Building ${formData.buildingNo}, Road ${formData.roadNo}`,
      city: formData.city,
      loyaltyPoints: 0,
    };

    onCustomerAdded(newCustomer);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      flatNo: '',
      buildingNo: '',
      roadNo: '',
      city: 'Manama',
    });
    
    onOpenChange(false);
    
    toast({
      title: "Customer Added",
      description: `${newCustomer.user.firstName} has been added successfully`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter customer details to create a new account
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+973-XXXX-XXXX"
                required
              />
            </div>

            {/* Address Fields */}
            <div className="space-y-3">
              <Label>Delivery Address</Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Input
                    placeholder="Flat No"
                    value={formData.flatNo}
                    onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Building No"
                    value={formData.buildingNo}
                    onChange={(e) => setFormData({ ...formData, buildingNo: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Road No"
                    value={formData.roadNo}
                    onChange={(e) => setFormData({ ...formData, roadNo: e.target.value })}
                  />
                </div>
              </div>
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}