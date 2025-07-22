
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Percent, Plus, Trash2, Save } from "lucide-react";
import { DiscountSettings } from "@/types/pos-settings";

export function DiscountSettingsTab() {
  const [discountSettings, setDiscountSettings] = useState<DiscountSettings[]>([
    { id: "vip10", name: "VIP Discount", type: "percentage", value: 10, enabled: true, minOrderAmount: 50 },
    { id: "bulk20", name: "Bulk Order", type: "percentage", value: 20, enabled: true, minOrderAmount: 100 },
    { id: "new5", name: "New Customer", type: "fixed", value: 5, enabled: true },
    { id: "loyalty15", name: "Loyalty Discount", type: "percentage", value: 15, enabled: true, minOrderAmount: 75 }
  ]);

  const [newDiscount, setNewDiscount] = useState({
    name: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0
  });

  const handleAddDiscount = () => {
    if (newDiscount.name.trim() && newDiscount.value > 0) {
      const discount: DiscountSettings = {
        id: newDiscount.name.toLowerCase().replace(/\s+/g, '-'),
        name: newDiscount.name,
        type: newDiscount.type,
        value: newDiscount.value,
        enabled: true,
        minOrderAmount: newDiscount.minOrderAmount || undefined,
        maxDiscountAmount: newDiscount.maxDiscountAmount || undefined
      };
      setDiscountSettings(prev => [...prev, discount]);
      setNewDiscount({ name: "", type: "percentage", value: 0, minOrderAmount: 0, maxDiscountAmount: 0 });
      toast.success("Discount added successfully!");
    }
  };

  const handleDeleteDiscount = (discountId: string) => {
    setDiscountSettings(prev => prev.filter(d => d.id !== discountId));
    toast.success("Discount deleted successfully!");
  };

  const handleToggleDiscount = (discountId: string, enabled: boolean) => {
    setDiscountSettings(prev => prev.map(discount => 
      discount.id === discountId ? { ...discount, enabled } : discount
    ));
  };

  const handleSaveDiscountSettings = () => {
    localStorage.setItem('pos_discount_settings', JSON.stringify(discountSettings));
    toast.success("Discount settings saved successfully!");
  };

  const formatDiscountValue = (discount: DiscountSettings) => {
    return discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5" />
          Discount Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {discountSettings.map((discount) => (
          <div key={discount.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-medium">{discount.name}</h3>
                <Badge variant="outline">
                  {formatDiscountValue(discount)}
                </Badge>
                {discount.minOrderAmount && (
                  <Badge variant="secondary">
                    Min: ${discount.minOrderAmount}
                  </Badge>
                )}
                <Badge variant={discount.enabled ? "default" : "secondary"}>
                  {discount.enabled ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={discount.enabled}
                  onCheckedChange={(enabled) => handleToggleDiscount(discount.id, enabled)}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteDiscount(discount.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium mb-3">Add New Discount</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Discount Name</Label>
                <Input
                  placeholder="Enter discount name"
                  value={newDiscount.name}
                  onChange={(e) => setNewDiscount(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newDiscount.type} onValueChange={(value: "percentage" | "fixed") => 
                  setNewDiscount(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>
                  {newDiscount.type === 'percentage' ? 'Percentage' : 'Amount ($)'}
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newDiscount.value || ''}
                  onChange={(e) => setNewDiscount(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Min Order ($)</Label>
                <Input
                  type="number"
                  placeholder="Optional"
                  value={newDiscount.minOrderAmount || ''}
                  onChange={(e) => setNewDiscount(prev => ({ ...prev, minOrderAmount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Discount ($)</Label>
                <Input
                  type="number"
                  placeholder="Optional"
                  value={newDiscount.maxDiscountAmount || ''}
                  onChange={(e) => setNewDiscount(prev => ({ ...prev, maxDiscountAmount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            
            <Button onClick={handleAddDiscount} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Discount
            </Button>
          </div>
        </div>

        <Button onClick={handleSaveDiscountSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Discount Settings
        </Button>
      </CardContent>
    </Card>
  );
}
