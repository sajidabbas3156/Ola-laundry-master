
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tag, Percent, DollarSign } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface PromoCodeFormProps {
  onPromoCreate: (promo: any) => void;
}

export function PromoCodeForm({ onPromoCreate }: PromoCodeFormProps) {
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed' | 'wallet-bonus'>('percentage');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !value || !description || !validFrom || !validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    const promo = {
      id: Date.now().toString(),
      code: code.toUpperCase(),
      type,
      value: parseFloat(value),
      description,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      usedCount: 0,
      isActive: true,
      tenantId: 'current-tenant'
    };

    onPromoCreate(promo);
    toast.success('Promo code created successfully!');
    
    // Reset form
    setCode('');
    setValue('');
    setDescription('');
    setMinOrderAmount('');
    setMaxDiscount('');
    setValidFrom('');
    setValidUntil('');
    setUsageLimit('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Create Promo Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Promo Code</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="WELCOME20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Percentage Off
                    </div>
                  </SelectItem>
                  <SelectItem value="fixed">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Fixed Amount Off
                    </div>
                  </SelectItem>
                  <SelectItem value="wallet-bonus">
                    <div className="flex items-center gap-2">
                      <Badge className="h-4 w-4" />
                      Wallet Bonus
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Value {type === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === 'percentage' ? '20' : '10.00'}
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Usage Limit (Optional)</Label>
              <Input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="20% off for first-time customers"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Order Amount ($)</Label>
              <Input
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                placeholder="25.00"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Maximum Discount ($)</Label>
              <Input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="50.00"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valid From</Label>
              <Input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Promo Code
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
