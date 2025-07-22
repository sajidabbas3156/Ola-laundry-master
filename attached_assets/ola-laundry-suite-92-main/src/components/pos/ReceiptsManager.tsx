
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Search, Calendar, Receipt } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useTenant } from "@/contexts/TenantContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { toast } from "@/components/ui/sonner";

export function ReceiptsManager() {
  const { orders, getOrdersByTenant } = useData();
  const { currentTenant } = useTenant();
  const { formatCurrency } = useLocalization();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const tenantOrders = currentTenant?.id ? getOrdersByTenant(currentTenant.id) : [];

  const filteredOrders = tenantOrders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerPhone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    const matchesDate = !dateFilter || 
                       new Date(order.createdAt).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleReprint = (order: any) => {
    const receiptHTML = generateReceiptHTML(order);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      toast.success("Receipt sent to printer");
    } else {
      toast.error("Could not open print window");
    }
  };

  const generateReceiptHTML = (order: any) => {
    return `
      <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              max-width: 300px; 
              margin: 0 auto; 
              padding: 10px;
              font-size: 12px;
              line-height: 1.4;
            }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .logo { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
            .item { display: flex; justify-content: space-between; margin: 3px 0; }
            .total { border-top: 2px solid #000; padding-top: 5px; margin-top: 10px; font-weight: bold; }
            .footer { text-align: center; margin-top: 15px; font-size: 10px; }
            @media print {
              body { width: 58mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${currentTenant?.name || "Laundry Service"}</div>
            <div>${currentTenant?.address || ""}</div>
            <div>${currentTenant?.phone || ""}</div>
          </div>
          
          <div>
            <strong>Order #: ${order.id}</strong><br>
            <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString()}<br>
            <strong>Customer:</strong> ${order.customerName}<br>
            <strong>Phone:</strong> ${order.customerPhone || 'N/A'}<br>
            <strong>Status:</strong> ${order.status.toUpperCase()}
          </div>
          
          <hr style="margin: 10px 0;">
          
          ${order.items.map((item: any) => `
            <div class="item">
              <span>${item.quantity}x ${item.name}</span>
              <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
            ${item.service ? `<div style="font-size: 10px; color: #666; margin-left: 10px;">${item.service}</div>` : ''}
          `).join('')}
          
          <div class="total">
            <div class="item">
              <span>Subtotal:</span>
              <span>${formatCurrency(order.subtotal || 0)}</span>
            </div>
            ${(order.discount || 0) > 0 ? `
            <div class="item">
              <span>Discount:</span>
              <span>-${formatCurrency(order.discount)}</span>
            </div>
            ` : ''}
            ${(order.serviceCharge || 0) > 0 ? `
            <div class="item">
              <span>Service Fee:</span>
              <span>${formatCurrency(order.serviceCharge)}</span>
            </div>
            ` : ''}
            <div class="item">
              <span>Tax:</span>
              <span>${formatCurrency(order.tax || 0)}</span>
            </div>
            <div class="item">
              <span>TOTAL:</span>
              <span>${formatCurrency(order.total)}</span>
            </div>
          </div>
          
          <div class="footer">
            <div>Thank you for your business!</div>
            <div>Please keep this receipt</div>
          </div>
        </body>
      </html>
    `;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="h-6 w-6" />
          Receipts & Transactions
        </h2>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Order ID, customer name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDateFilter("");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipts List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No receipts found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReprint(order)}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Reprint
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer Details</h4>
                    <p className="text-sm">Name: {order.customerName}</p>
                    <p className="text-sm">Phone: {order.customerPhone || 'N/A'}</p>
                    {order.serviceType && order.serviceType !== 'pickup' && (
                      <p className="text-sm">Service: {order.serviceType}</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Payment Details</h4>
                    <p className="text-sm">Method: {order.paymentMethod || 'N/A'}</p>
                    <p className="text-sm">Total: {formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Items</h4>
                  <div className="space-y-1">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name} {item.service && `(${item.service})`}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
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
