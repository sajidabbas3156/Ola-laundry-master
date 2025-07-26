# 🗄️ Shared Database Architecture - All Apps Connected

## ✅ YES - All 4 Apps Share One Database

**Database**: PostgreSQL with **31 tables**
**Apps**: Customer, Driver, POS, Admin - all connected to the same data

---

## 🔄 How It Works

### **Same Data, Different Views**

**Customer Mobile App**
- Views: Their orders, services, loyalty points
- Creates: New orders, reviews, payments
- Updates: Profile, preferences

**Delivery Driver App**  
- Views: Assigned deliveries, routes, customer addresses
- Creates: Delivery confirmations, GPS updates
- Updates: Delivery status, location tracking

**Vendor POS System**
- Views: All services, customer database, inventory
- Creates: In-store orders, payments, receipts
- Updates: Order processing, stock levels

**Admin Dashboard**
- Views: All business data, analytics, reports
- Creates: Services, employees, business settings
- Updates: Everything - complete business management

---

## 📊 Database Tables (31 Total)

### **Core Business (8 tables)**
- `users` - All users (customers, staff, drivers, admins)
- `customers` - Customer profiles and preferences  
- `services` - Laundry services (wash, dry clean, etc.)
- `orders` - All orders from all apps
- `order_items` - Individual items in orders
- `machines` - Equipment status and scheduling
- `delivery_routes` - Driver routes and stops
- `payments` - Payment processing records

### **Multi-Tenant SaaS (5 tables)**
- `tenants` - Business accounts (multiple laundries)
- `organizations` - Business locations and branches
- `subscription_plans` - SaaS pricing tiers
- `tenant_subscriptions` - Active subscriptions
- `analytics_events` - Usage tracking

### **Employee Management (4 tables)**
- `employees` - Staff information and roles
- `payroll_records` - Salary and payment tracking
- `attendance_records` - Time tracking system
- `departments` - Organizational structure

### **Inventory Management (4 tables)**
- `inventory_items` - Stock items (detergent, hangers, etc.)
- `suppliers` - Vendor information
- `purchase_orders` - Automated ordering system
- `inventory_transactions` - Stock movement tracking

### **Financial Management (5 tables)**
- `expense_categories` - Expense organization
- `expenses` - Business expense tracking
- `revenues` - Income tracking by source
- `assets` - Equipment and property management
- `financial_periods` - Accounting periods

### **Business Intelligence (5 tables)**
- `promotions` - Marketing campaigns and discounts
- `reviews` - Customer feedback and ratings
- `notifications` - System messaging
- `workflows` - Process automation rules  
- `business_settings` - Configuration management

---

## 🔐 Data Security & Access Control

### **Multi-Tenant Isolation**
Each business is completely isolated:
```sql
-- Every table has tenantId for separation
SELECT * FROM orders WHERE tenantId = 'oasis-laundry';
SELECT * FROM orders WHERE tenantId = 'downtown-cleaners';
```

### **Role-Based Access**
Different apps see different data based on user role:

**Customer (Mobile App)**:
```sql
-- Only see own orders
SELECT * FROM orders WHERE customerId = currentUser.id;
```

**Driver (Delivery App)**:
```sql  
-- Only see assigned deliveries
SELECT * FROM delivery_routes WHERE driverId = currentUser.id;
```

**Staff (POS System)**:
```sql
-- See all business data for their tenant
SELECT * FROM orders WHERE tenantId = currentUser.tenantId;
```

**Admin (Dashboard)**:
```sql
-- Full access to tenant business data
SELECT * FROM * WHERE tenantId = currentUser.tenantId;
```

---

## ⚡ Real-Time Data Flow

### **Example: Order Lifecycle**

1. **Customer places order** (Customer App)
   - Writes to `orders` and `order_items` tables
   - WebSocket notifies all connected apps

2. **Order appears in admin dashboard** (Admin App)
   - Reads from same `orders` table
   - Admin assigns to staff or driver

3. **Driver gets delivery assignment** (Driver App)
   - Reads from `delivery_routes` table
   - Updates delivery status in real-time

4. **Customer sees live updates** (Customer App)
   - Reads updated order status
   - Receives push notifications

### **All Apps Stay Synchronized**
- One app updates data → All apps see changes instantly
- WebSocket connections keep everything in sync
- No data duplication or inconsistency

---

## 🎯 Why This Architecture Works

### **Business Integration**
- Order flows: Customer → Staff → Driver → Admin
- All parts of business need same data
- Real-time coordination essential

### **Data Consistency**
- Single source of truth
- No sync issues between apps
- Immediate updates across platform

### **Efficiency**
- One database to maintain
- Shared connection pooling
- Faster queries and performance

### **Scalability**
- Add new apps easily
- Shared infrastructure
- Centralized backups and security

---

## 🌍 Multi-Business Support

The same database supports multiple laundry businesses:

**Tenant A: "Oasis Laundry" (Bahrain)**
- 150 customers using Customer App
- 5 drivers using Driver App  
- 8 staff using POS System
- 2 managers using Admin Dashboard

**Tenant B: "Downtown Cleaners" (Dubai)**
- 300 customers using Customer App
- 8 drivers using Driver App
- 12 staff using POS System
- 3 managers using Admin Dashboard

Each business is completely isolated but uses the same app infrastructure.

---

## 📱 App-Specific Data Access

### **Customer Mobile App URLs**
- `GET /api/orders` - Returns only customer's orders
- `POST /api/orders` - Creates new orders
- `GET /api/services` - Views available services

### **Driver App URLs**  
- `GET /api/delivery-routes` - Returns assigned routes
- `PUT /api/deliveries/:id/status` - Updates delivery status
- `POST /api/gps-location` - Tracks driver location

### **POS System URLs**
- `GET /api/customers` - Search customer database
- `POST /api/orders` - Create in-store orders
- `GET /api/inventory` - Check stock levels

### **Admin Dashboard URLs**
- `GET /api/analytics` - Business intelligence data
- `GET /api/reports` - Financial and operational reports  
- `PUT /api/settings` - Business configuration

---

## ✅ Summary

**All 4 apps share the same database because:**

- ✅ **Integration**: They're all part of the same business operation
- ✅ **Real-time**: Changes sync instantly across all apps
- ✅ **Security**: Role-based access controls what each app sees
- ✅ **Efficiency**: Single database is faster and easier to manage
- ✅ **Multi-tenant**: Supports multiple businesses securely
- ✅ **Scalable**: Easy to add features and new apps

This shared database approach makes OLA Laundry Master a true **integrated business platform** rather than separate applications!