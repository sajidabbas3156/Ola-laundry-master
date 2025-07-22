
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Receipt, Printer, Download, Share, Search, Eye } from "lucide-react";
import { ReceiptData } from "@/types/pos-settings";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

export function ReceiptManagementTab() {
  const [receipts] = useState<ReceiptData[]>([
    {
      id: "1",
      orderId: "ORD-001",
      customerName: "John Doe",
      customerPhone: "+1234567890",
      items: [{ name: "Shirt Cleaning", quantity: 2, price: 15 }],
      total: 30,
      date: new Date(),
      status: "printed"
    },
    {
      id: "2", 
      orderId: "ORD-002",
      customerName: "Jane Smith",
      customerPhone: "+1234567891",
      items: [{ name: "Dress Cleaning", quantity: 1, price: 25 }],
      total: 25,
      date: new Date(),
      status: "pending"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredReceipts = receipts.filter(receipt => 
    receipt.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    receipt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    receipt.customerPhone.includes(searchQuery)
  );

  const handlePrintReceipt = (receipt: ReceiptData) => {
    // Generate receipt HTML and print
    const receiptHTML = generateReceiptHTML(receipt);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      toast.success("Receipt sent to printer");
    }
  };

  const handleDownloadReceipt = (receipt: ReceiptData) => {
    const receiptHTML = generateReceiptHTML(receipt);
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receipt.orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded");
  };

  const handleViewReceipt = (receipt: ReceiptData) => {
    const receiptHTML = generateReceiptHTML(receipt);
    const viewWindow = window.open('', '_blank');
    if (viewWindow) {
      viewWindow.document.write(receiptHTML);
      viewWindow.document.close();
    }
  };

  const generateReceiptHTML = (receipt: ReceiptData) => {
    return `
      <html>
        <head>
          <title>Receipt - ${receipt.orderId}</title>
          <style>
            body { font-family: 'Courier New', monospace; max-width: 300px; margin: 0 auto; padding: 10px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin: 3px 0; }
            .total { border-top: 2px solid #000; padding-top: 5px; margin-top: 10px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Laundry Service</h2>
            <p>Order #: ${receipt.orderId}</p>
            <p>Date: ${receipt.date.toLocaleDateString()}</p>
            <p>Customer: ${receipt.customerName}</p>
            <p>Phone: ${receipt.customerPhone}</p>
          </div>
          ${receipt.items.map(item => `
            <div class="item">
              <span>${item.quantity}x ${item.name}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="total">
            <div class="item">
              <span>TOTAL:</span>
              <span>$${receipt.total.toFixed(2)}</span>
            </div>
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;
  };

  const generateWhatsAppMessage = (receipt: ReceiptData) => {
    return `Your receipt from Laundry Service:
Order #: ${receipt.orderId}
Date: ${receipt.date.toLocaleDateString()}
Items: ${receipt.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
Total: $${receipt.total.toFixed(2)}
Thank you for your business!`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'printed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Receipt Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredReceipts.map((receipt) => (
            <div key={receipt.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Order #{receipt.orderId}</h3>
                  <p className="text-sm text-muted-foreground">
                    {receipt.customerName} • {receipt.customerPhone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {receipt.date.toLocaleDateString()} • ${receipt.total.toFixed(2)}
                  </p>
                </div>
                <Badge className={getStatusColor(receipt.status)}>
                  {receipt.status.toUpperCase()}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewReceipt(receipt)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePrintReceipt(receipt)}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadReceipt(receipt)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                
                <WhatsAppButton
                  phoneNumber={receipt.customerPhone}
                  message={generateWhatsAppMessage(receipt)}
                  className="h-8 text-xs"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </WhatsAppButton>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
