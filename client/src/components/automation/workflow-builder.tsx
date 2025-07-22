import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Play, Pause, Trash2, Settings, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WorkflowTrigger {
  type: string;
  condition: string;
  value: any;
}

interface WorkflowAction {
  type: string;
  params: Record<string, any>;
}

interface Workflow {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  createdAt: string;
}

const triggerTypes = [
  { value: "order_status_change", label: "Order Status Changes" },
  { value: "inventory_low_stock", label: "Low Stock Alert" },
  { value: "customer_register", label: "New Customer Registration" },
  { value: "payment_received", label: "Payment Received" },
  { value: "delivery_completed", label: "Delivery Completed" },
  { value: "promotion_expires", label: "Promotion Expires" },
  { value: "scheduled", label: "Scheduled Time" },
];

const actionTypes = [
  { value: "send_notification", label: "Send Notification" },
  { value: "send_email", label: "Send Email" },
  { value: "send_sms", label: "Send SMS" },
  { value: "update_inventory", label: "Update Inventory" },
  { value: "create_promotion", label: "Create Promotion" },
  { value: "assign_delivery", label: "Assign Delivery" },
  { value: "generate_report", label: "Generate Report" },
];

export function WorkflowBuilder() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ["/api/workflows"],
  });

  const createWorkflowMutation = useMutation({
    mutationFn: async (workflowData: any) => {
      const response = await apiRequest("POST", "/api/workflows", workflowData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      setIsCreateDialogOpen(false);
      setEditingWorkflow(null);
      toast({
        title: "Success",
        description: "Workflow created successfully",
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

  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/workflows/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      toast({
        title: "Success",
        description: "Workflow updated successfully",
      });
    },
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/workflows/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      toast({
        title: "Success",
        description: "Workflow deleted successfully",
      });
    },
  });

  const handleCreateWorkflow = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const workflowData = {
      name: formData.get("name"),
      description: formData.get("description"),
      isActive: formData.get("isActive") === "on",
      trigger: {
        type: formData.get("triggerType"),
        condition: formData.get("triggerCondition") || "equals",
        value: formData.get("triggerValue"),
      },
      actions: [
        {
          type: formData.get("actionType"),
          params: {
            message: formData.get("actionMessage"),
            recipient: formData.get("actionRecipient"),
          },
        },
      ],
    };
    
    createWorkflowMutation.mutate(workflowData);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Workflow Automation
          </h2>
          <p className="text-muted-foreground">Automate business processes and notifications</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Set up automated processes to streamline your operations
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isActive" name="isActive" defaultChecked />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Trigger</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="triggerType">When</Label>
                    <Select name="triggerType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypes.map((trigger) => (
                          <SelectItem key={trigger.value} value={trigger.value}>
                            {trigger.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="triggerValue">Value</Label>
                    <Input id="triggerValue" name="triggerValue" placeholder="e.g., completed, 10" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Action</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="actionType">Then</Label>
                    <Select name="actionType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map((action) => (
                          <SelectItem key={action.value} value={action.value}>
                            {action.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="actionRecipient">To</Label>
                    <Input id="actionRecipient" name="actionRecipient" placeholder="customer, staff, admin" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="actionMessage">Message</Label>
                  <Textarea id="actionMessage" name="actionMessage" placeholder="Your order is ready for pickup!" />
                </div>
              </div>
              
              <Button type="submit" disabled={createWorkflowMutation.isPending} className="w-full">
                {createWorkflowMutation.isPending ? "Creating..." : "Create Workflow"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflow Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workflows.filter((w: Workflow) => w.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">247</div>
            <p className="text-xs text-muted-foreground">Executions</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No workflows configured yet.</p>
                <p className="text-sm">Create your first workflow to automate business processes.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          workflows.map((workflow: Workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {workflow.name}
                      <Badge variant={workflow.isActive ? "default" : "secondary"}>
                        {workflow.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWorkflowMutation.mutate({
                        id: workflow.id,
                        isActive: !workflow.isActive
                      })}
                    >
                      {workflow.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingWorkflow(workflow)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteWorkflowMutation.mutate(workflow.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Trigger</h4>
                    <div className="text-sm text-gray-600">
                      When <Badge variant="outline">{workflow.trigger.type}</Badge>
                      {workflow.trigger.value && (
                        <span> equals <Badge variant="outline">{workflow.trigger.value}</Badge></span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Actions</h4>
                    <div className="space-y-1">
                      {workflow.actions.map((action, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <Badge variant="outline">{action.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}