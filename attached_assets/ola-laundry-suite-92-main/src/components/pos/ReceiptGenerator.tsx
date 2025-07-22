
import { CartItem } from "@/types/pos";

interface ReceiptData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: Date;
}

export class ReceiptGenerator {
  static generateHTML(
    orderData: ReceiptData,
    tenantName: string,
    formatCurrency: (amount: number) => string
  ): string {
    return `
      <html>
        <head>
          <title>Receipt - ${orderData.orderId}</title>
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
            <div class="logo">${tenantName}</div>
          </div>
          
          <div>
            <strong>Order #: ${orderData.orderId}</strong><br>
            <strong>Date:</strong> ${orderData.date.toLocaleDateString()} ${orderData.date.toLocaleTimeString()}<br>
            <strong>Customer:</strong> ${orderData.customerName}<br>
            <strong>Phone:</strong> ${orderData.customerPhone}
          </div>
          
          <hr style="margin: 10px 0;">
          
          ${orderData.items.map(item => `
            <div class="item">
              <span>${item.quantity}x ${item.name}</span>
              <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
            ${item.service ? `<div style="font-size: 10px; color: #666; margin-left: 10px;">${item.service.name}</div>` : ''}
          `).join('')}
          
          <div class="total">
            <div class="item">
              <span>Subtotal:</span>
              <span>${formatCurrency(orderData.subtotal)}</span>
            </div>
            <div class="item">
              <span>Tax:</span>
              <span>${formatCurrency(orderData.tax)}</span>
            </div>
            <div class="item">
              <span>TOTAL:</span>
              <span>${formatCurrency(orderData.total)}</span>
            </div>
          </div>
          
          <div class="footer">
            <div>Thank you for your business!</div>
            <div>Please keep this receipt</div>
          </div>
        </body>
      </html>
    `;
  }

  static generateWhatsAppMessage(
    orderData: ReceiptData,
    tenantName: string,
    formatCurrency: (amount: number) => string
  ): string {
    return `Receipt from ${tenantName}

Order #: ${orderData.orderId}
Date: ${orderData.date.toLocaleDateString()}
Customer: ${orderData.customerName}

Items:
${orderData.items.map(item => `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`).join('\n')}

Subtotal: ${formatCurrency(orderData.subtotal)}
Tax: ${formatCurrency(orderData.tax)}
Total: ${formatCurrency(orderData.total)}

Thank you for your business!`;
  }
}
