# 🗄️ Database Architecture - OLA Laundry Master

## ✅ Unified Database Design

**Yes, all 4 applications share the same PostgreSQL database.** This is the correct architecture for an integrated laundry management platform.

---

## 🏗️ Why One Database for All Apps?

### **Integrated Business Ecosystem**
All apps are part of the same business operation:
- Customer places order → Driver delivers → Staff processes → Admin manages
- Data flows seamlessly between all applications
- Real-time updates work across all platforms

### **Shared Business Data**
- **Orders**: Created by customers, processed by staff, delivered by drivers, managed by admin
- **Customers**: Accessible to all apps for service delivery
- **Inventory**: Updated by staff, monitored by admin, affects customer orders
- **Payments**: Processed across customer and POS apps, tracked by admin

### **Multi-Tenant SaaS Architecture**
- Multiple laundry businesses share the same database
- Each business is isolated by `tenantId` in all tables
- Efficient resource usage and management
- Centralized updates and maintenance

---

## 📊 Database Tables Overview

### **Core Business Tables**
```
├── tenants - Business accounts (Oasis Laundry, Downtown Cleaners, etc.)
├── organizations - Business locations and branches
├── users - All users (customers, staff, drivers, admins)
├── customers - Customer-specific data and preferences
├── services - Laundry services (wash, dry clean, iron, etc.)
├── orders - All orders from all apps
├── order_items - Individual items in each order
├── machines - Washing machines and equipment
├── delivery_routes - Driver routes and stops
└── payments - Payment processing records
```

### **Employee Management**
```
├── employees - Staff information
├── payroll_records - Salary and payment tracking
├── attendance_records - Time tracking
└── departments - Business departments
```

### **Inventory Management**
```
├── inventory_items - Stock items (detergent, hangers, etc.)
├── suppliers - Vendor information
├── purchase_orders - Automated ordering
└── inventory_transactions - Stock movement tracking
```

### **Financial Management**
```
├── expense_categories - Expense organization
├── expenses - Business expenses
├── revenues - Income tracking
├── assets - Equipment and property
├── financial_periods - Accounting periods
└── subscription_plans - SaaS pricing tiers
```

### **Business Intelligence**
```
├── analytics_events - Usage tracking
├── promotions - Marketing campaigns
├── reviews - Customer feedback
├── notifications - System messages
├── workflows - Automation rules
└── business_settings - Configuration
```

---

## 🔐 Data Security & Isolation

### **Multi-Tenant Isolation**
Every table includes `tenantId` to separate business data:
```sql
-- Example: Orders table
orders (
  id, 
  tenantId,        -- Isolates data by business
  customerId,
  status,
  totalAmount
)
```

### **Role-Based Access**
- **Customers**: Only see their own orders and data
- **Staff**: Access business data for their tenant
- **Drivers**: See assigned deliveries for their tenant
- **Admins**: Full access to their business tenant
- **Super Admin**: Platform-wide access

### **Data Privacy**
- JWT authentication with role-based permissions
- API endpoints filter by tenant and user role
- No cross-tenant data leakage possible

---

## 🔄 How Apps Share Data

### **Customer Mobile App**
- **Reads**: Services, own orders, loyalty points
- **Writes**: New orders, customer preferences, reviews

### **Delivery Driver App**
- **Reads**: Assigned delivery routes, customer addresses, order details
- **Writes**: Delivery status updates, GPS locations, completion confirmations

### **Vendor POS System**
- **Reads**: Services, customer data, inventory levels
- **Writes**: New orders, payment records, inventory usage

### **Admin Dashboard**
- **Reads**: All business data, analytics, reports
- **Writes**: Business settings, employee data, inventory management

---

## 📈 Real-Time Data Synchronization

### **WebSocket Updates**
When any app updates data, other apps receive real-time updates:
- Customer places order → Driver gets notification
- Driver updates delivery status → Customer sees update
- Staff processes order → Admin dashboard updates
- Admin changes pricing → All apps reflect new prices

### **Example Data Flow**
```
1. Customer places order (Customer App)
   ↓ (Database writes to orders table)
2. Order appears in dashboard (Admin App)
   ↓ (Admin assigns to driver)
3. Driver gets notification (Driver App)
   ↓ (Driver updates status)
4. Customer sees delivery progress (Customer App)
```

---

## 🌍 Multi-Business Support

### **Tenant Separation**
```
Tenant 1: "Oasis Laundry" (Bahrain)
├── 150 customers
├── 25 employees  
├── 5 drivers
└── 1,200 orders

Tenant 2: "Downtown Cleaners" (Dubai)
├── 300 customers
├── 40 employees
├── 8 drivers  
└── 2,500 orders
```

Each business operates independently but uses the same database structure.

---

## ⚡ Performance Benefits

### **Efficient Queries**
- Single database connection pool
- Optimized indexing on tenantId
- Efficient cross-table joins
- Reduced latency between apps

### **Scalability**
- Single database to maintain and backup
- Centralized performance monitoring
- Easy to add new features across all apps
- Simplified deployment and updates

---

## 🔧 Database Configuration

### **Connection Details**
```javascript
// All apps use the same database connection
const db = drizzle({ 
  client: pool, 
  schema,
  connectionString: process.env.DATABASE_URL 
});
```

### **Environment Variables**
```
DATABASE_URL=postgresql://...  // Shared by all apps
PGHOST=...                     // Same database server
PGDATABASE=...                 // Same database name
```

---

## 🎯 Summary

**Yes, all 4 apps share one database, and this is the optimal design because:**

✅ **Data Integration**: Orders flow seamlessly between customer → staff → driver → admin
✅ **Real-Time Updates**: Changes in one app instantly reflect in others
✅ **Business Logic**: All apps serve the same business operation
✅ **Multi-Tenant**: Supports multiple laundry businesses securely
✅ **Performance**: Single database is faster and more efficient
✅ **Maintenance**: Easier to manage, backup, and update

This unified database approach is what makes OLA Laundry Master a complete, integrated business management platform rather than separate applications.