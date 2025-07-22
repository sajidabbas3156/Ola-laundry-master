
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Workflow, 
  Play, 
  Pause, 
  Plus, 
  Settings,
  Zap,
  Clock,
  Filter,
  ArrowRight,
  BarChart3,
  Mail,
  MessageSquare,
  Database,
  CreditCard
} from "lucide-react";

interface WorkflowAction {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  icon: any;
}

interface WorkflowTrigger {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  icon: any;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
}

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([
    {
      id: "1",
      name: "New Customer Welcome",
      description: "Send welcome email and create CRM record for new customers",
      status: "active",
      trigger: {
        id: "t1",
        type: "customer_created",
        name: "New Customer Created",
        config: {},
        icon: Plus
      },
      actions: [
        {
          id: "a1",
          type: "send_email",
          name: "Send Welcome Email",
          config: { template: "welcome", delay: 0 },
          icon: Mail
        },
        {
          id: "a2", 
          type: "create_crm_record",
          name: "Add to CRM",
          config: { platform: "hubspot" },
          icon: Database
        }
      ],
      executionCount: 127,
      lastExecuted: "2 hours ago",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Payment Processing",
      description: "Update accounting and send receipt when payment is received",
      status: "active",
      trigger: {
        id: "t2",
        type: "payment_received",
        name: "Payment Received",
        config: { amount_threshold: 0 },
        icon: CreditCard
      },
      actions: [
        {
          id: "a3",
          type: "update_accounting",
          name: "Sync to QuickBooks",
          config: { account: "revenue" },
          icon: Database
        },
        {
          id: "a4",
          type: "send_receipt",
          name: "Send Receipt",
          config: { template: "receipt" },
          icon: Mail
        }
      ],
      executionCount: 89,
      lastExecuted: "15 minutes ago",
      createdAt: "2024-01-10"
    },
    {
      id: "3",
      name: "Order Status Updates",
      description: "Send SMS notifications when order status changes",
      status: "inactive",
      trigger: {
        id: "t3",
        type: "order_status_changed",
        name: "Order Status Changed",
        config: { statuses: ["completed", "delivered"] },
        icon: Clock
      },
      actions: [
        {
          id: "a5",
          type: "send_sms",
          name: "Send SMS Notification",
          config: { provider: "twilio" },
          icon: MessageSquare
        }
      ],
      executionCount: 0,
      lastExecuted: undefined,
      createdAt: "2024-01-20"
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: w.status === "active" ? "inactive" : "active" as const }
        : w
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const triggerTypes = [
    { value: "customer_created", label: "New Customer Created", icon: Plus },
    { value: "payment_received", label: "Payment Received", icon: CreditCard },
    { value: "order_status_changed", label: "Order Status Changed", icon: Clock },
    { value: "webhook", label: "Webhook Received", icon: Zap },
    { value: "scheduled", label: "Scheduled Time", icon: Clock }
  ];

  const actionTypes = [
    { value: "send_email", label: "Send Email", icon: Mail },
    { value: "send_sms", label: "Send SMS", icon: MessageSquare },
    { value: "create_crm_record", label: "Create CRM Record", icon: Database },
    { value: "update_accounting", label: "Update Accounting", icon: Database },
    { value: "webhook", label: "Call Webhook", icon: Zap }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Workflow className="h-6 w-6" />
            Workflow Automation
          </h2>
          <p className="text-muted-foreground">
            Create automated workflows to streamline your business processes
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">
              {workflows.filter(w => w.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-green-600">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-green-600">High reliability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">per week</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedWorkflow(workflow)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Workflow className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(workflow.status)}
                <Switch 
                  checked={workflow.status === "active"}
                  onCheckedChange={() => toggleWorkflowStatus(workflow.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <workflow.trigger.icon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{workflow.trigger.name}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-4">
                  {workflow.actions.map((action, index) => (
                    <div key={action.id} className="flex items-center gap-2">
                      {index > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                      <action.icon className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{action.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Executed {workflow.executionCount} times</span>
                {workflow.lastExecuted && <span>Last run: {workflow.lastExecuted}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Builder Modal/Panel would go here */}
      {isCreating && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Workflow Name</Label>
                <Input placeholder="Enter workflow name" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Describe what this workflow does" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Trigger</h4>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      <div className="flex items-center gap-2">
                        <trigger.icon className="h-4 w-4" />
                        {trigger.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Actions</h4>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      <div className="flex items-center gap-2">
                        <action.icon className="h-4 w-4" />
                        {action.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button>Create Workflow</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
