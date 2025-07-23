import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, CheckCircle, XCircle, FileText, DollarSign, Calendar, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const payrollSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  payPeriodStart: z.string().min(1, "Pay period start is required"),
  payPeriodEnd: z.string().min(1, "Pay period end is required"),
  basicSalary: z.string().min(0, "Basic salary must be positive"),
  allowances: z.string().default("0"),
  deductions: z.string().default("0"),
  overtimeHours: z.string().default("0"),
  overtimeRate: z.string().default("1.5"),
});

type PayrollFormValues = z.infer<typeof payrollSchema>;

export default function Payroll() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payrollRecords, isLoading } = useQuery({
    queryKey: ["/api/payroll"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      employeeId: "",
      payPeriodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      payPeriodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      basicSalary: "",
      allowances: "0",
      deductions: "0",
      overtimeHours: "0",
      overtimeRate: "1.5",
    },
  });

  const createPayrollMutation = useMutation({
    mutationFn: async (data: PayrollFormValues) => {
      const basicSalary = parseFloat(data.basicSalary);
      const allowances = parseFloat(data.allowances);
      const deductions = parseFloat(data.deductions);
      const overtimeHours = parseFloat(data.overtimeHours);
      const overtimeRate = parseFloat(data.overtimeRate);
      
      // Calculate overtime pay
      const hourlyRate = basicSalary / 160; // Assuming 160 work hours per month
      const overtimePay = overtimeHours * hourlyRate * overtimeRate;
      
      // Calculate totals
      const grossPay = basicSalary + allowances + overtimePay;
      const netPay = grossPay - deductions;
      
      return await apiRequest("POST", "/api/payroll", {
        employeeId: parseInt(data.employeeId),
        payPeriodStart: new Date(data.payPeriodStart),
        payPeriodEnd: new Date(data.payPeriodEnd),
        basicSalary: basicSalary.toFixed(2),
        allowances: allowances.toFixed(2),
        deductions: deductions.toFixed(2),
        overtimeHours: overtimeHours.toString(),
        overtimeRate: overtimeRate.toString(),
        overtimePay: overtimePay.toFixed(2),
        grossPay: grossPay.toFixed(2),
        netPay: netPay.toFixed(2),
        paymentStatus: 'pending',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      toast({
        title: "Success",
        description: "Payroll record created successfully",
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

  const approvePayrollMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("POST", `/api/payroll/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      toast({
        title: "Success",
        description: "Payroll approved successfully",
      });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async ({ id, paymentDate, paymentReference }: any) => {
      return await apiRequest("POST", `/api/payroll/${id}/pay`, {
        paymentDate,
        paymentReference,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      toast({
        title: "Success",
        description: "Payroll marked as paid",
      });
    },
  });

  const onSubmit = (data: PayrollFormValues) => {
    createPayrollMutation.mutate(data);
  };

  const handleApprove = (id: number) => {
    approvePayrollMutation.mutate(id);
  };

  const handleMarkAsPaid = (id: number) => {
    const paymentReference = prompt("Enter payment reference (e.g., check number, transfer ID):");
    if (paymentReference) {
      markAsPaidMutation.mutate({
        id,
        paymentDate: new Date(),
        paymentReference,
      });
    }
  };

  const getStatusBadge = (status: string, approvedBy: any) => {
    if (status === 'paid') {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
    } else if (approvedBy) {
      return <Badge className="bg-blue-500">Approved</Badge>;
    } else {
      return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const calculateTotalsByStatus = () => {
    const totals = {
      pending: 0,
      approved: 0,
      paid: 0,
      total: 0,
    };

    payrollRecords?.forEach((record: any) => {
      const amount = parseFloat(record.netPay);
      totals.total += amount;
      
      if (record.paymentStatus === 'paid') {
        totals.paid += amount;
      } else if (record.approvedBy) {
        totals.approved += amount;
      } else {
        totals.pending += amount;
      }
    });

    return totals;
  };

  const totals = calculateTotalsByStatus();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground mt-1">Process and track employee payments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Payroll
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Payroll Record</DialogTitle>
              <DialogDescription>
                Generate a new payroll entry for an employee
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees?.map((employee: any) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              {employee.user?.firstName} {employee.user?.lastName} - {employee.jobTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="payPeriodStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pay Period Start</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payPeriodEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pay Period End</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="basicSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Salary ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="2500.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowances"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allowances ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Housing, transport, etc.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deductions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deductions ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Taxes, insurance, etc.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="overtimeHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overtime Hours</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.5" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="overtimeRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overtime Rate Multiplier</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="1.5" {...field} />
                        </FormControl>
                        <FormDescription>1.5 = 150% of regular rate</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createPayrollMutation.isPending}>
                    Create Payroll
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${totals.pending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totals.approved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready to pay</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totals.paid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Records */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>View and process employee payroll</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Pay Period</TableHead>
                    <TableHead>Basic</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords?.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {record.employee?.user?.firstName} {record.employee?.user?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {record.employee?.jobTitle}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(record.payPeriodStart), "MMM d")} - 
                          {format(new Date(record.payPeriodEnd), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>${parseFloat(record.basicSalary).toLocaleString()}</TableCell>
                      <TableCell>${parseFloat(record.allowances).toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">
                        -${parseFloat(record.deductions).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {record.overtimeHours > 0 && (
                          <div className="text-sm">
                            {record.overtimeHours}h @ {record.overtimeRate}x
                            <div className="text-xs text-muted-foreground">
                              ${parseFloat(record.overtimePay).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${parseFloat(record.netPay).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.paymentStatus, record.approvedBy)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {!record.approvedBy && record.paymentStatus !== 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(record.id)}
                            >
                              Approve
                            </Button>
                          )}
                          {record.approvedBy && record.paymentStatus !== 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsPaid(record.id)}
                            >
                              Mark Paid
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}