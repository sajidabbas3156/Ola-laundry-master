import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LaundrySpinner } from '@/components/ui/laundry-spinner';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Play, 
  Pause, 
  Plus, 
  Settings, 
  Clock,
  ArrowRight,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

interface Workflow {
  id: number;
  tenantId: number;
  name: string;
  description: string;
  trigger: 'order_created' | 'payment_received' | 'order_completed' | 'low_inventory' | 'customer_registered';
  conditions: string[];
  actions: WorkflowAction[];
  isActive: boolean;
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
}

interface WorkflowAction {
  type: 'send_notification' | 'update_order_status' | 'assign_driver' | 'send_email' | 'create_inventory_order';
  parameters: Record<string, any>;
}

export default function WorkflowAutomation() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: 'order_created' as const,
    conditions: [] as string[],
    actions: [] as WorkflowAction[],
    isActive: true
  });

  // Fetch workflows
  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ['/api/workflows'],
  });

  // Create workflow mutation
  const createWorkflowMutation = useMutation({
    mutationFn: async (workflow: Omit<Workflow, 'id' | 'tenantId' | 'executionCount' | 'createdAt'>) => {
      return apiRequest('POST', '/api/workflows', workflow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      setNewWorkflow({
        name: '',
        description: '',
        trigger: 'order_created',
        conditions: [],
        actions: [],
        isActive: true
      });
      toast({
        title: "Workflow Created",
        description: "Your automation workflow has been created successfully.",
      });
    },
  });

  // Toggle workflow status mutation
  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return apiRequest('PATCH', `/api/workflows/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
    },
  });

  const handleCreateWorkflow = () => {
    createWorkflowMutation.mutate(newWorkflow);
  };

  const addCondition = () => {
    setNewWorkflow(prev => ({
      ...prev,
      conditions: [...prev.conditions, '']
    }));
  };

  const updateCondition = (index: number, value: string) => {
    setNewWorkflow(prev => ({
      ...prev,
      conditions: prev.conditions.map((cond, i) => i === index ? value : cond)
    }));
  };

  const removeCondition = (index: number) => {
    setNewWorkflow(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const addAction = (type: WorkflowAction['type']) => {
    const newAction: WorkflowAction = {
      type,
      parameters: getDefaultParameters(type)
    };
    setNewWorkflow(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const getDefaultParameters = (type: WorkflowAction['type']): Record<string, any> => {
    switch (type) {
      case 'send_notification':
        return { message: '', recipients: 'customer' };
      case 'update_order_status':
        return { status: 'processing' };
      case 'assign_driver':
        return { criteria: 'nearest_available' };
      case 'send_email':
        return { template: '', subject: '' };
      case 'create_inventory_order':
        return { supplier: '', items: [] };
      default:
        return {};
    }
  };

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'order_created': return 'Order Created';
      case 'payment_received': return 'Payment Received';
      case 'order_completed': return 'Order Completed';
      case 'low_inventory': return 'Low Inventory';
      case 'customer_registered': return 'Customer Registered';
      default: return trigger;
    }
  };

  const getStatusColor = (workflow: Workflow) => {
    if (!workflow.isActive) return 'bg-gray-100 text-gray-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (workflow: Workflow) => {
    if (!workflow.isActive) return <Pause className="h-4 w-4" />;
    return <Play className="h-4 w-4" />;
  };

  if (workflowsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LaundrySpinner variant="washing" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Workflow Automation</h1>
        <p className="text-gray-600">Automate your business processes and improve efficiency</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(workflows as Workflow[] || []).filter(w => w.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">Running automations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(workflows as Workflow[] || []).reduce((acc, w) => acc + w.executionCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">Successful executions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247h</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Workflow Activity</CardTitle>
              <CardDescription>Latest automated processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(workflows as Workflow[] || []).slice(0, 5).map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-gray-600">Trigger: {getTriggerLabel(workflow.trigger)}</p>
                        <p className="text-xs text-gray-400">
                          {workflow.lastExecuted 
                            ? `Last run: ${new Date(workflow.lastExecuted).toLocaleString()}` 
                            : 'Never executed'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(workflow)}>
                        {getStatusIcon(workflow)}
                        {workflow.isActive ? 'Active' : 'Paused'}
                      </Badge>
                      <span className="text-sm text-gray-500">{workflow.executionCount} runs</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Workflow</CardTitle>
              <CardDescription>Automate your business processes with custom workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    placeholder="Auto-assign delivery driver"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Trigger Event</Label>
                  <Select value={newWorkflow.trigger} onValueChange={(value: any) => setNewWorkflow({ ...newWorkflow, trigger: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order_created">Order Created</SelectItem>
                      <SelectItem value="payment_received">Payment Received</SelectItem>
                      <SelectItem value="order_completed">Order Completed</SelectItem>
                      <SelectItem value="low_inventory">Low Inventory</SelectItem>
                      <SelectItem value="customer_registered">Customer Registered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  placeholder="Describe what this workflow does..."
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Conditions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Conditions (Optional)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Condition
                  </Button>
                </div>
                {newWorkflow.conditions.map((condition, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      placeholder="e.g., order amount > 50"
                      value={condition}
                      onChange={(e) => updateCondition(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCondition(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Actions</Label>
                  <div className="flex space-x-2">
                    <Select onValueChange={(value: any) => addAction(value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Add Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_notification">Send Notification</SelectItem>
                        <SelectItem value="update_order_status">Update Order Status</SelectItem>
                        <SelectItem value="assign_driver">Assign Driver</SelectItem>
                        <SelectItem value="send_email">Send Email</SelectItem>
                        <SelectItem value="create_inventory_order">Create Inventory Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {newWorkflow.actions.map((action, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{action.type.replace('_', ' ')}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNewWorkflow(prev => ({
                            ...prev,
                            actions: prev.actions.filter((_, i) => i !== index)
                          }))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {action.type === 'send_notification' && (
                        <div className="space-y-2">
                          <Input
                            placeholder="Notification message"
                            value={action.parameters.message || ''}
                            onChange={(e) => {
                              const updatedActions = [...newWorkflow.actions];
                              updatedActions[index].parameters.message = e.target.value;
                              setNewWorkflow({ ...newWorkflow, actions: updatedActions });
                            }}
                          />
                          <Select 
                            value={action.parameters.recipients || 'customer'}
                            onValueChange={(value) => {
                              const updatedActions = [...newWorkflow.actions];
                              updatedActions[index].parameters.recipients = value;
                              setNewWorkflow({ ...newWorkflow, actions: updatedActions });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="driver">Driver</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {action.type === 'update_order_status' && (
                        <Select 
                          value={action.parameters.status || 'processing'}
                          onValueChange={(value) => {
                            const updatedActions = [...newWorkflow.actions];
                            updatedActions[index].parameters.status = value;
                            setNewWorkflow({ ...newWorkflow, actions: updatedActions });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {action.type === 'send_email' && (
                        <div className="space-y-2">
                          <Input
                            placeholder="Email subject"
                            value={action.parameters.subject || ''}
                            onChange={(e) => {
                              const updatedActions = [...newWorkflow.actions];
                              updatedActions[index].parameters.subject = e.target.value;
                              setNewWorkflow({ ...newWorkflow, actions: updatedActions });
                            }}
                          />
                          <Input
                            placeholder="Email template"
                            value={action.parameters.template || ''}
                            onChange={(e) => {
                              const updatedActions = [...newWorkflow.actions];
                              updatedActions[index].parameters.template = e.target.value;
                              setNewWorkflow({ ...newWorkflow, actions: updatedActions });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newWorkflow.isActive}
                  onCheckedChange={(checked) => setNewWorkflow({ ...newWorkflow, isActive: checked })}
                />
                <Label>Activate workflow immediately</Label>
              </div>

              <Button 
                onClick={handleCreateWorkflow}
                disabled={createWorkflowMutation.isPending}
                className="w-full"
              >
                {createWorkflowMutation.isPending ? (
                  <>
                    <LaundrySpinner variant="washing" size="sm" className="mr-2" />
                    Creating Workflow...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Workflow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Workflows</CardTitle>
              <CardDescription>Manage your automated business processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(workflows as Workflow[] || []).map((workflow) => (
                  <div key={workflow.id} className="p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{workflow.name}</h3>
                        <p className="text-gray-600">{workflow.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Trigger: {getTriggerLabel(workflow.trigger)}</span>
                          <span>•</span>
                          <span>{workflow.conditions.length} conditions</span>
                          <span>•</span>
                          <span>{workflow.actions.length} actions</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(workflow)}>
                          {getStatusIcon(workflow)}
                          {workflow.isActive ? 'Active' : 'Paused'}
                        </Badge>
                        <Switch
                          checked={workflow.isActive}
                          onCheckedChange={(checked) => toggleWorkflowMutation.mutate({ id: workflow.id, isActive: checked })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Executions</p>
                        <p className="font-medium">{workflow.executionCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="font-medium">98.5%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Executed</p>
                        <p className="font-medium">
                          {workflow.lastExecuted 
                            ? new Date(workflow.lastExecuted).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium">{new Date(workflow.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Test Run
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Auto Order Processing',
                description: 'Automatically process orders and assign drivers',
                trigger: 'order_created',
                actions: ['update_order_status', 'assign_driver', 'send_notification']
              },
              {
                name: 'Payment Confirmation',
                description: 'Send confirmation when payment is received',
                trigger: 'payment_received',
                actions: ['send_email', 'update_order_status']
              },
              {
                name: 'Low Inventory Alert',
                description: 'Alert when inventory levels are low and create purchase orders',
                trigger: 'low_inventory',
                actions: ['send_notification', 'create_inventory_order']
              },
              {
                name: 'Welcome New Customer',
                description: 'Send welcome message and promotional offer to new customers',
                trigger: 'customer_registered',
                actions: ['send_email', 'send_notification']
              }
            ].map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">Trigger:</span>
                      <Badge variant="outline">{getTriggerLabel(template.trigger)}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">Actions:</span>
                      <div className="flex space-x-1">
                        {template.actions.map((action, actionIndex) => (
                          <Badge key={actionIndex} variant="secondary" className="text-xs">
                            {action.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}