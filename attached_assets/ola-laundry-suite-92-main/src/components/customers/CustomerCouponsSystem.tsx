
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ticket, Gift, Percent, Calendar, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface LaundryServiceCoupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_service';
  discountValue: number;
  minOrderAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usedCount: number;
  applicableServices: string[];
  termsAndConditions: string;
  isActive: boolean;
}

const laundryServiceCoupons: LaundryServiceCoupon[] = [
  {
    id: '1',
    code: 'WASH20',
    title: '20% Off Wash & Fold',
    description: 'Get 20% discount on wash and fold services',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 15,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    usageLimit: 100,
    usedCount: 23,
    applicableServices: ['wash-fold', 'wash-iron'],
    termsAndConditions: 'Valid for wash & fold services only. Minimum order 15 BD. Cannot be combined with other offers.',
    isActive: true
  },
  {
    id: '2',
    code: 'DRYCLEAN30',
    title: '30% Off Dry Cleaning',
    description: 'Save 30% on all dry cleaning services',
    discountType: 'percentage',
    discountValue: 30,
    minOrderAmount: 25,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-06-30'),
    usageLimit: 50,
    usedCount: 12,
    applicableServices: ['dry-cleaning'],
    termsAndConditions: 'Valid for dry cleaning services only. Minimum order 25 BD.',
    isActive: true
  },
  {
    id: '3',
    code: 'FREEPRESS',
    title: 'Free Pressing Service',
    description: 'Get free pressing service with any wash',
    discountType: 'free_service',
    discountValue: 0,
    minOrderAmount: 20,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-03-31'),
    usageLimit: 30,
    usedCount: 8,
    applicableServices: ['pressing', 'ironing'],
    termsAndConditions: 'Free pressing service with minimum 20 BD wash order. One free service per order.',
    isActive: true
  },
  {
    id: '4',
    code: 'SAVE10BD',
    title: '10 BD Off Large Orders',
    description: 'Fixed 10 BD discount on orders above 50 BD',
    discountType: 'fixed',
    discountValue: 10,
    minOrderAmount: 50,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    usageLimit: 200,
    usedCount: 45,
    applicableServices: ['all'],
    termsAndConditions: 'Valid on all services. Minimum order 50 BD required.',
    isActive: true
  }
];

export function CustomerCouponsSystem() {
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as const,
    discountValue: 0,
    minOrderAmount: 0,
    validUntil: '',
    usageLimit: 100,
    applicableServices: 'all',
    termsAndConditions: ''
  });

  const [couponToRedeem, setCouponToRedeem] = useState('');
  const [customerForCoupon, setCustomerForCoupon] = useState('');

  const mockCustomers = [
    { id: '1', name: 'Ahmed Al-Mahmoud' },
    { id: '2', name: 'Fatima Hassan' },
    { id: '3', name: 'Mohammed Ali' },
  ];

  const createCoupon = () => {
    if (!newCoupon.code || !newCoupon.title || !newCoupon.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success(`Laundry service coupon "${newCoupon.code}" created successfully!`);
    
    // Reset form
    setNewCoupon({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      validUntil: '',
      usageLimit: 100,
      applicableServices: 'all',
      termsAndConditions: ''
    });
  };

  const redeemCoupon = () => {
    if (!couponToRedeem || !customerForCoupon) {
      toast.error("Please select a coupon and customer");
      return;
    }

    const coupon = laundryServiceCoupons.find(c => c.id === couponToRedeem);
    const customer = mockCustomers.find(c => c.id === customerForCoupon);
    
    if (!coupon || !customer) return;

    if (coupon.usedCount >= coupon.usageLimit) {
      toast.error("Coupon usage limit reached");
      return;
    }

    toast.success(`Coupon "${coupon.code}" redeemed successfully for ${customer.name}!`);
    setCouponToRedeem('');
    setCustomerForCoupon('');
  };

  const toggleCouponStatus = (couponId: string) => {
    const coupon = laundryServiceCoupons.find(c => c.id === couponId);
    if (!coupon) return;
    
    toast.success(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'} successfully!`);
  };

  const getDiscountDisplay = (coupon: LaundryServiceCoupon) => {
    switch (coupon.discountType) {
      case 'percentage':
        return `${coupon.discountValue}% OFF`;
      case 'fixed':
        return `${coupon.discountValue} BD OFF`;
      case 'free_service':
        return 'FREE SERVICE';
      default:
        return 'DISCOUNT';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Laundry Service Coupons Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Ticket className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Active Coupons</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {laundryServiceCoupons.filter(c => c.isActive).length}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold text-green-800">Total Redemptions</h3>
                <p className="text-2xl font-bold text-green-600">
                  {laundryServiceCoupons.reduce((sum, c) => sum + c.usedCount, 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Percent className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Avg. Discount</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(laundryServiceCoupons.reduce((sum, c) => sum + (c.discountType === 'percentage' ? c.discountValue : 0), 0) / laundryServiceCoupons.filter(c => c.discountType === 'percentage').length)}%
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Expiring Soon</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {laundryServiceCoupons.filter(c => {
                    const daysUntilExpiry = Math.ceil((c.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 30;
                  }).length}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Laundry Service Coupon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <Input
                  placeholder="e.g., WASH25"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <select 
                  className="w-full border rounded px-3 py-2"
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value as any }))}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount (BD)</option>
                  <option value="free_service">Free Service</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g., 25% Off Wash & Fold"
                value={newCoupon.title}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe what this coupon offers..."
                value={newCoupon.description}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  placeholder={newCoupon.discountType === 'percentage' ? '25' : '10'}
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Min Order (BD)</Label>
                <Input
                  type="number"
                  placeholder="15"
                  value={newCoupon.minOrderAmount}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, minOrderAmount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 100 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Input
                  type="date"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Applicable Services</Label>
                <select 
                  className="w-full border rounded px-3 py-2"
                  value={newCoupon.applicableServices}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, applicableServices: e.target.value }))}
                >
                  <option value="all">All Services</option>
                  <option value="wash-fold">Wash & Fold</option>
                  <option value="dry-cleaning">Dry Cleaning</option>
                  <option value="pressing">Pressing/Ironing</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <Textarea
                placeholder="Enter terms and conditions for this coupon..."
                value={newCoupon.termsAndConditions}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, termsAndConditions: e.target.value }))}
              />
            </div>

            <Button onClick={createCoupon} className="w-full">
              Create Laundry Service Coupon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redeem Coupon for Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Customer</Label>
              <select 
                className="w-full border rounded px-3 py-2"
                value={customerForCoupon}
                onChange={(e) => setCustomerForCoupon(e.target.value)}
              >
                <option value="">Select a customer...</option>
                {mockCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Select Coupon</Label>
              <select 
                className="w-full border rounded px-3 py-2"
                value={couponToRedeem}
                onChange={(e) => setCouponToRedeem(e.target.value)}
              >
                <option value="">Select a coupon...</option>
                {laundryServiceCoupons.filter(c => c.isActive).map(coupon => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.code} - {coupon.title} ({getDiscountDisplay(coupon)})
                  </option>
                ))}
              </select>
            </div>

            <Button onClick={redeemCoupon} className="w-full" disabled={!couponToRedeem || !customerForCoupon}>
              Redeem Coupon
            </Button>

            <div className="space-y-3 mt-6">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  Send Coupon via SMS
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Email Coupon to Customer
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Print Coupon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Laundry Service Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {laundryServiceCoupons.map((coupon) => (
              <Card key={coupon.id} className={`border-2 ${coupon.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-blue-600" />
                      <code className="bg-white px-2 py-1 rounded font-mono text-sm">
                        {coupon.code}
                      </code>
                    </div>
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                      {getDiscountDisplay(coupon)}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{coupon.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Valid until:</span>
                      <span>{coupon.validUntil.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Used:</span>
                      <span>{coupon.usedCount}/{coupon.usageLimit}</span>
                    </div>
                    {coupon.minOrderAmount && (
                      <div className="flex justify-between">
                        <span>Min order:</span>
                        <span>{coupon.minOrderAmount} BD</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white p-2 rounded text-xs text-gray-600 mt-3">
                    <strong>Terms:</strong> {coupon.termsAndConditions}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant={coupon.isActive ? "destructive" : "default"}
                      onClick={() => toggleCouponStatus(coupon.id)}
                    >
                      {coupon.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
