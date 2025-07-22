import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag, Plus, Calendar as CalendarIcon, Percent, Gift } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Promotion {
  id: number;
  name: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  validFrom: string;
  validUntil: string;
  maxUsages: number;
  currentUsages: number;
  isActive: boolean;
  tenantId: number;
}

export default function PromotionManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [validFromDate, setValidFromDate] = useState<Date | undefined>(new Date());
  const [validUntilDate, setValidUntilDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["/api/promotions"],
  });

  const createPromotionMutation = useMutation({
    mutationFn: async (promotionData: any) => {
      const response = await apiRequest("POST", "/api/promotions", promotionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      setIsCreateDialogOpen(false);
      setValidFromDate(new Date());
      setValidUntilDate(new Date());
      toast({
        title: "Success",
        description: "Promotion created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePromotionMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const response = await apiRequest("PUT", `/api/promotions/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      setEditingPromotion(null);
      toast({
        title: "Success",
        description: "Promotion updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePromotion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const promotionData = {
      name: formData.get("name"),
      code: formData.get("code"),
      description: formData.get("description"),
      discountType: formData.get("discountType"),
      discountValue: parseFloat(formData.get("discountValue") as string),
      minOrderAmount: parseFloat(formData.get("minOrderAmount") as string) || 0,
      maxDiscountAmount: parseFloat(formData.get("maxDiscountAmount") as string) || null,
      validFrom: validFromDate?.toISOString(),
      validUntil: validUntilDate?.toISOString(),
      maxUsages: parseInt(formData.get("maxUsages") as string) || null,
      isActive: formData.get("isActive") === "on",
      tenantId: 1, // Default tenant for now
    };
    createPromotionMutation.mutate(promotionData);
  };

  const handleUpdatePromotion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPromotion) return;
    
    const formData = new FormData(event.currentTarget);
    const updates = {
      id: editingPromotion.id,
      name: formData.get("name"),
      description: formData.get("description"),
      discountValue: parseFloat(formData.get("discountValue") as string),
      minOrderAmount: parseFloat(formData.get("minOrderAmount") as string) || 0,
      maxDiscountAmount: parseFloat(formData.get("maxDiscountAmount") as string) || null,
      maxUsages: parseInt(formData.get("maxUsages") as string) || null,
      isActive: formData.get("isActive") === "true",
    };
    updatePromotionMutation.mutate(updates);
  };

  const generatePromotionCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const getPromotionStatus = (promotion: Promotion) => {
    if (!promotion.isActive) return { status: "Inactive", color: "bg-gray-100 text-gray-800" };
    
    const now = new Date();
    const validFrom = new Date(promotion.validFrom);
    const validUntil = new Date(promotion.validUntil);
    
    if (now < validFrom) return { status: "Scheduled", color: "bg-blue-100 text-blue-800" };
    if (now > validUntil) return { status: "Expired", color: "bg-red-100 text-red-800" };
    if (promotion.maxUsages && promotion.currentUsages >= promotion.maxUsages) {
      return { status: "Used Up", color: "bg-orange-100 text-orange-800" };
    }
    return { status: "Active", color: "bg-green-100 text-green-800" };
  };

  const getActivePromotions = () => {
    return promotions.filter((promo: Promotion) => {
      const status = getPromotionStatus(promo);
      return status.status === "Active";
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const activePromotions = getActivePromotions();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tag className="h-8 w-8" />
            Promotion Management
          </h1>
          <p className="text-muted-foreground">Create and manage promotional offers</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
              <DialogDescription>
                Set up a new promotional offer for your customers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePromotion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Promotion Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="code">Promotion Code</Label>
                  <div className="flex gap-2">
                    <Input id="code" name="code" required />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const codeInput = document.getElementById("code") as HTMLInputElement;
                        if (codeInput) codeInput.value = generatePromotionCode();
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select name="discountType" defaultValue="percentage">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input id="discountValue" name="discountValue" type="number" step="0.01" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minOrderAmount">Min Order Amount (BHD)</Label>
                  <Input id="minOrderAmount" name="minOrderAmount" type="number" step="0.01" />
                </div>
                <div>
                  <Label htmlFor="maxDiscountAmount">Max Discount Amount (BHD)</Label>
                  <Input id="maxDiscountAmount" name="maxDiscountAmount" type="number" step="0.01" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valid From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !validFromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validFromDate ? format(validFromDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={validFromDate}
                        onSelect={setValidFromDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !validUntilDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validUntilDate ? format(validUntilDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={validUntilDate}
                        onSelect={setValidUntilDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="maxUsages">Max Usage Count (optional)</Label>
                <Input id="maxUsages" name="maxUsages" type="number" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" defaultChecked />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <Button type="submit" disabled={createPromotionMutation.isPending} className="w-full">
                {createPromotionMutation.isPending ? "Creating..." : "Create Promotion"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Gift className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePromotions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.reduce((sum: number, promo: Promotion) => sum + promo.currentUsages, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Discount</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.length > 0 ? 
                (promotions.reduce((sum: number, promo: Promotion) => 
                  sum + (promo.discountType === 'percentage' ? promo.discountValue : 0), 0) / 
                  promotions.filter((p: Promotion) => p.discountType === 'percentage').length || 0
                ).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion: Promotion) => {
          const status = getPromotionStatus(promotion);
          const usagePercentage = promotion.maxUsages ? 
            (promotion.currentUsages / promotion.maxUsages) * 100 : 0;
          
          return (
            <Card key={promotion.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{promotion.name}</CardTitle>
                  <Badge className={status.color}>
                    {status.status}
                  </Badge>
                </div>
                <CardDescription>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {promotion.code}
                  </code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Discount</span>
                    <span className="font-medium">
                      {promotion.discountType === 'percentage' 
                        ? `${promotion.discountValue}%` 
                        : `BHD ${promotion.discountValue}`
                      }
                    </span>
                  </div>
                  
                  {promotion.minOrderAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Min Order</span>
                      <span className="text-sm">BHD {promotion.minOrderAmount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Valid Period</span>
                    <span className="text-sm">
                      {format(new Date(promotion.validFrom), "MMM dd")} - {format(new Date(promotion.validUntil), "MMM dd")}
                    </span>
                  </div>
                  
                  {promotion.maxUsages && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Usage</span>
                        <span className="text-sm">
                          {promotion.currentUsages} / {promotion.maxUsages}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {promotion.description && (
                    <p className="text-sm text-muted-foreground">
                      {promotion.description}
                    </p>
                  )}
                  
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPromotion(promotion)}
                      className="w-full"
                    >
                      Edit Promotion
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPromotion} onOpenChange={() => setEditingPromotion(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
            <DialogDescription>
              Update promotion details and settings
            </DialogDescription>
          </DialogHeader>
          {editingPromotion && (
            <form onSubmit={handleUpdatePromotion} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Promotion Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  defaultValue={editingPromotion.name} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  defaultValue={editingPromotion.description} 
                />
              </div>
              <div>
                <Label htmlFor="edit-discountValue">Discount Value</Label>
                <Input 
                  id="edit-discountValue" 
                  name="discountValue" 
                  type="number" 
                  step="0.01"
                  defaultValue={editingPromotion.discountValue} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-minOrderAmount">Min Order Amount (BHD)</Label>
                <Input 
                  id="edit-minOrderAmount" 
                  name="minOrderAmount" 
                  type="number" 
                  step="0.01"
                  defaultValue={editingPromotion.minOrderAmount} 
                />
              </div>
              <div>
                <Label htmlFor="edit-maxUsages">Max Usage Count</Label>
                <Input 
                  id="edit-maxUsages" 
                  name="maxUsages" 
                  type="number"
                  defaultValue={editingPromotion.maxUsages || ""} 
                />
              </div>
              <div>
                <Label htmlFor="edit-isActive">Status</Label>
                <Select name="isActive" defaultValue={editingPromotion.isActive.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={updatePromotionMutation.isPending} className="w-full">
                {updatePromotionMutation.isPending ? "Updating..." : "Update Promotion"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}