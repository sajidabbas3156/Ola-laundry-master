import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Package, Users, Building2, Receipt } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const subscriptionPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required").regex(/^[A-Z_]+$/, "Code must be uppercase with underscores"),
  description: z.string().optional(),
  price: z.string().min(0, "Price must be positive"),
  billingPeriod: z.enum(["monthly", "quarterly", "annual"]),
  maxUsers: z.string().optional(),
  maxOrganizations: z.string().optional(),
  maxOrdersPerMonth: z.string().optional(),
  features: z.string(),
  isActive: z.boolean().default(true),
});

type SubscriptionPlanFormValues = z.infer<typeof subscriptionPlanSchema>;

export default function SubscriptionPlansManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  interface SubscriptionPlan {
    id: number;
    name: string;
    code: string;
    description?: string;
    price: number;
    billingPeriod: string;
    maxUsers?: number;
    maxOrganizations?: number;
    maxOrdersPerMonth?: number;
    features?: string;
    isActive: boolean;
  }

  const { data: plans, isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
  });

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      price: "",
      billingPeriod: "monthly",
      maxUsers: "",
      maxOrganizations: "",
      maxOrdersPerMonth: "",
      features: "",
      isActive: true,
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: async (data: SubscriptionPlanFormValues) => {
      return await apiRequest("POST", "/api/subscription-plans", {
        ...data,
        price: parseFloat(data.price),
        maxUsers: data.maxUsers ? parseInt(data.maxUsers) : null,
        maxOrganizations: data.maxOrganizations ? parseInt(data.maxOrganizations) : null,
        maxOrdersPerMonth: data.maxOrdersPerMonth ? parseInt(data.maxOrdersPerMonth) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-plans"] });
      toast({
        title: "Success",
        description: "Subscription plan created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SubscriptionPlanFormValues }) => {
      return await apiRequest("PATCH", `/api/subscription-plans/${id}`, {
        ...data,
        price: parseFloat(data.price),
        maxUsers: data.maxUsers ? parseInt(data.maxUsers) : null,
        maxOrganizations: data.maxOrganizations ? parseInt(data.maxOrganizations) : null,
        maxOrdersPerMonth: data.maxOrdersPerMonth ? parseInt(data.maxOrdersPerMonth) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-plans"] });
      toast({
        title: "Success",
        description: "Subscription plan updated successfully",
      });
      setIsDialogOpen(false);
      setEditingPlan(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubscriptionPlanFormValues) => {
    if (editingPlan) {
      updatePlanMutation.mutate({ id: editingPlan.id, data });
    } else {
      createPlanMutation.mutate(data);
    }
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    form.reset({
      name: plan.name,
      code: plan.code,
      description: plan.description || "",
      price: plan.price.toString(),
      billingPeriod: plan.billingPeriod,
      maxUsers: plan.maxUsers?.toString() || "",
      maxOrganizations: plan.maxOrganizations?.toString() || "",
      maxOrdersPerMonth: plan.maxOrdersPerMonth?.toString() || "",
      features: plan.features || "",
      isActive: plan.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPlan(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getBillingPeriodLabel = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/superadmin">
                <Button variant="ghost" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Subscription Plans</h1>
            <p className="text-muted-foreground mt-1">Manage platform subscription tiers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPlan ? "Edit" : "Create"} Subscription Plan</DialogTitle>
                <DialogDescription>
                  Define the features and limitations for this subscription tier
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Professional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan Code</FormLabel>
                          <FormControl>
                            <Input placeholder="PROFESSIONAL" {...field} />
                          </FormControl>
                          <FormDescription>Uppercase with underscores</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Perfect for growing laundry businesses..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="99.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Period</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              {...field}
                            >
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="annual">Annual</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="maxUsers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Users</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Unlimited" {...field} />
                          </FormControl>
                          <FormDescription>Leave empty for unlimited</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxOrganizations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Organizations</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Unlimited" {...field} />
                          </FormControl>
                          <FormDescription>Leave empty for unlimited</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxOrdersPerMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Orders/Month</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Unlimited" {...field} />
                          </FormControl>
                          <FormDescription>Leave empty for unlimited</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List features, one per line"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Enter each feature on a new line</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Allow new subscriptions to this plan
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createPlanMutation.isPending || updatePlanMutation.isPending}>
                      {editingPlan ? "Update" : "Create"} Plan
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Subscription Plans</CardTitle>
            <CardDescription>Configure features and pricing for each tier</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Limits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans?.map((plan: any) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        {plan.description && (
                          <div className="text-sm text-muted-foreground">{plan.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{plan.code}</code>
                    </TableCell>
                    <TableCell>${plan.price}</TableCell>
                    <TableCell>{getBillingPeriodLabel(plan.billingPeriod)}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {plan.maxUsers || "Unlimited"} users
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {plan.maxOrganizations || "Unlimited"} orgs
                        </div>
                        <div className="flex items-center gap-1">
                          <Receipt className="h-3 w-3" />
                          {plan.maxOrdersPerMonth || "Unlimited"} orders/mo
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={plan.isActive ? "bg-green-500" : "bg-gray-500"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}