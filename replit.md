# OLA LAUNDRY MASTER - Complete Multi-Platform Management Solution

## Overview

OLA LAUNDRY MASTER is a comprehensive laundry management system designed to streamline operations across multiple touchpoints. The complete solution includes four specialized applications: a web admin panel, customer mobile app, vendor POS system, and delivery driver app. Built with modern React/TypeScript architecture and backed by a unified Express.js API server with PostgreSQL database.

## Recent Changes

### Enhanced Web Admin Panel Features (January 23, 2025)
- **Super Admin Dashboard**: Complete tenant analytics with subscription metrics, revenue tracking, and tenant management
- **Subscription Plans Management**: Full CRUD operations for managing subscription tiers with features and pricing
- **Employee Management Page**: Comprehensive staff management with employment types, departments, and salary tracking
- **Payroll Processing**: Advanced payroll system with:
  - Basic salary, allowances, and deductions
  - Overtime calculation with configurable rates
  - Approval workflow and payment status tracking
- **Financial Reports**: Comprehensive financial analysis including:
  - Revenue and expense trends with visual charts
  - Profit & Loss statements
  - Category-wise breakdowns with pie charts
  - Export functionality for CSV and PDF reports
- **Inventory Management**: Complete stock control system with:
  - Real-time stock level tracking
  - Automatic low stock alerts
  - Purchase order management
  - Stock adjustment tracking

### SaaS Platform Transformation (January 23, 2025)
- **Multi-Tenant SaaS Architecture**: Transformed into comprehensive SaaS platform with subscription management
- **Super Admin Platform**: New super admin interface for managing tenants, subscriptions, and platform-wide analytics
- **Enhanced Database Schema**: Added 15+ new tables for complete business management:
  - Organizations & Branches (hierarchical multi-location support)
  - Employees & Payroll Management
  - Comprehensive Accounting (expenses, revenues, assets, financial periods)
  - Subscription Plans & Tenant Subscriptions
  - Attendance Tracking System
- **Financial Management**: Complete profit/loss analysis, expense tracking, and financial period management
- **Human Resources**: Employee management, payroll processing, attendance tracking, and leave management
- **Asset Management**: Equipment tracking, maintenance scheduling, and depreciation calculation
- **Subscription Billing**: Stripe integration for subscription-based SaaS billing

### Complete System Recreation (January 2025)
- **Multi-Platform Architecture**: Rebuilt as comprehensive solution with four distinct applications
- **Customer Mobile App**: Complete mobile interface for order placement, tracking, loyalty management, and digital wallet
- **Delivery Driver App**: Professional driver interface with route optimization, GPS tracking, and delivery management
- **Vendor POS System**: Point-of-sale interface for staff with inventory management and sales tracking
- **Web Admin Panel**: Comprehensive business management dashboard with analytics and multi-tenant support
- **Enhanced Contexts**: Implemented robust state management with TenantContext, DataContext, CustomerContext, and DriversContext
- **Mobile-First Design**: Optimized touch interfaces with bottom navigation patterns for mobile applications

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX Design: Friendly, welcoming, and easy to use interface with modern design elements.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Real-time Communication**: WebSocket server for live updates
- **API Design**: RESTful API with consistent error handling

### Four Core Applications
The system provides four specialized applications covering all aspects of laundry business operations:

1. **Web Admin Panel** (`/tenant/:tenantSlug/*`) - Complete business management interface
   - Dashboard with real-time analytics and KPIs
   - Order management and status tracking
   - Customer relationship management
   - Inventory tracking and management
   - Reports and business insights
   - Multi-tenant administration
   - Settings and configuration

2. **Customer Mobile App** (`/customer-app`) - User-friendly mobile experience
   - Storefront with service selection and ordering
   - Order tracking with real-time status updates
   - Loyalty points management and rewards
   - Digital wallet with balance management
   - Account management and preferences
   - Mobile-optimized design with bottom navigation

3. **Vendor POS System** (`/vendor-pos`) - Point of sale for staff operations
   - Service selection with pricing and categories
   - Shopping cart with quantity management
   - Customer search and selection
   - Order processing and receipt generation
   - Real-time sales statistics
   - Mobile-friendly interface for tablets

4. **Delivery Driver App** (`/delivery-app`) - Professional driver interface
   - Driver dashboard with earnings and performance stats
   - Assigned deliveries with customer details
   - Route optimization and GPS navigation
   - Online/offline status management
   - Real-time location tracking simulation
   - Order completion and status updates

## Key Components

### Database Schema
- **Users**: Authentication and role-based access (superadmin, org_owner, branch_manager, inventory_manager, laundry_staff, cashier, delivery_agent, customer)
- **Tenants**: Multi-tenant SaaS platform core with subscription management
- **Organizations**: Hierarchical branch/location management (headquarters, branch, franchise)
- **Employees**: Comprehensive staff management with employment details and documents
- **Payroll Records**: Complete payroll processing with allowances, deductions, and payment tracking
- **Attendance Records**: Time tracking with check-in/out, overtime calculation
- **Customers**: Customer-specific data including addresses and preferences
- **Services**: Laundry services with flexible pricing models (per_lb, per_item, flat_rate)
- **Orders**: Order management with items, status tracking, and payment information
- **Machines**: Equipment status and scheduling
- **Delivery Routes**: Route optimization and delivery stop management
- **Inventory**: Stock management with automated reorder points and usage tracking
- **Expense Categories**: Hierarchical expense categorization
- **Expenses**: Comprehensive expense tracking with recurring support
- **Assets**: Asset management with depreciation and maintenance scheduling
- **Revenues**: Income tracking by category and source
- **Financial Periods**: Accounting periods with profit/loss calculations
- **Subscription Plans**: SaaS subscription tiers with features and limits
- **Tenant Subscriptions**: Active subscription management with Stripe integration
- **Suppliers**: Vendor management for inventory procurement
- **Purchase Orders**: Automated and manual purchase order management
- **Inventory Transactions**: Complete audit trail for stock movements
- **Promotions**: Marketing campaigns with discount codes and customer targeting
- **Reviews**: Customer feedback system with ratings and detailed comments
- **Analytics Events**: Business intelligence tracking for comprehensive reporting
- **Notifications**: System-wide messaging and alert management
- **Workflows**: Automation rules and triggers
- **Business Settings**: Configurable business parameters

### Authentication & Authorization
- JWT token-based authentication system
- Role-based access control (customer, staff, admin, driver)
- Middleware for protecting API endpoints
- Password hashing with bcrypt

### Real-time Features
- WebSocket connection for live order updates across all applications
- Real-time delivery tracking with GPS simulation
- Live status updates for orders and drivers
- Instant synchronization between web admin panel and mobile apps
- Real-time inventory updates and low-stock alerts
- Push notification support for mobile applications

### Payment Integration
- Stripe integration for payment processing
- Support for multiple payment methods
- Payment status tracking and refund handling

## Application Workflows

### Customer Journey
1. **Order Placement**: Customers use mobile app to browse services and place orders
2. **Payment Processing**: Secure payment through digital wallet or payment methods
3. **Order Tracking**: Real-time status updates from pickup to delivery
4. **Loyalty Management**: Automatic points accumulation and reward redemption

### Staff Operations
1. **Order Management**: Staff uses web admin panel to view and manage all orders
2. **POS Processing**: In-store orders processed through vendor POS system
3. **Inventory Tracking**: Real-time stock management and reorder notifications
4. **Customer Service**: Complete customer history and preference management

### Delivery Operations
1. **Route Assignment**: Drivers receive assignments through delivery app
2. **Navigation**: GPS-guided route optimization for efficient deliveries
3. **Status Updates**: Real-time order status updates and customer notifications
4. **Performance Tracking**: Driver analytics and earnings management

### Business Intelligence
1. **Real-time Analytics**: Dashboard with live KPIs and performance metrics
2. **Multi-tenant Management**: Support for multiple laundry business locations
3. **Report Generation**: Comprehensive business insights and financial reports
4. **System Administration**: User management and system configuration

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **@stripe/stripe-js & @stripe/react-stripe-js**: Payment processing
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token management
- **ws**: WebSocket server implementation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` using Vite
- Backend builds to `dist` using esbuild with external packages
- Single deployment artifact containing both frontend and backend

### Environment Configuration
- `NODE_ENV` for environment detection
- `DATABASE_URL` for PostgreSQL connection
- `JWT_SECRET` for token signing
- Replit-specific configurations for development environment

### Database Management
- Drizzle migrations stored in `./migrations`
- Schema definitions in `shared/schema.ts` for type sharing
- Push-based deployment with `npm run db:push`

### Development vs Production
- Development: Hot module reloading with Vite middleware
- Production: Static file serving with Express
- WebSocket support in both environments
- Replit-specific development tools and error overlays

The architecture emphasizes type safety, real-time capabilities, and a unified codebase that serves multiple client applications while maintaining clear separation of concerns between frontend and backend logic.