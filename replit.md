# OLA LAUNDRY MASTER - Compressed replit.md

## Overview
OLA LAUNDRY MASTER is a comprehensive multi-platform laundry management system. It aims to streamline operations through four specialized applications: a web admin panel, customer mobile app, vendor POS system, and delivery driver app. The system is designed as a multi-tenant SaaS platform, offering a complete business management suite including notifications, promotions, reviews, workflow automation, and advanced analytics. Its market potential lies in providing an all-in-one solution for laundry businesses, enabling efficient management, enhanced customer engagement, and data-driven decision-making.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX Design: Friendly, welcoming, and easy to use interface with modern design elements.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Framework**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with CSS variables
- **Build Tool**: Vite
- **Mobile App Development**: Capacitor for Android APK, PWA for cross-platform compatibility.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: JWT-based with bcrypt hashing
- **Real-time Communication**: WebSocket server
- **API Design**: RESTful API

### Core Applications
1.  **Web Admin Panel** (`/tenant/:tenantSlug/*`): Comprehensive business management, including analytics, order management, CRM, inventory, reports, multi-tenant administration, and a complete business management suite (notifications, promotions, reviews, workflow automation, advanced analytics).
2.  **Customer Mobile App** (`/customer-app`): User-friendly interface for order placement, tracking, loyalty management, digital wallet, and account management. Optimized as a Progressive Web App (PWA).
    - **Services**: ONLY Wash Only, Iron Only, Wash & Iron allowed. Dry Cleaning hidden/blocked at API.
    - **Start Order**: Must always open service selection page, never Dashboard.
    - **Loyalty**: Track points per completed order with redeem/earn endpoints.
    - **Map Integration**: Support current location, address search, and pin drop. Lat/lng required for delivery.
3.  **Vendor POS System** (`/vendor-pos`): Point-of-sale for staff operations including service selection, shopping cart, customer search, order processing, and sales statistics.
    - **Customer Records**: Persist customers, appear in "Select Existing" dropdown.
    - **Orders**: Store header + order_items. Clicking order shows full details (items, prices, totals).
    - **Payments**: Support BenefitPay, Cash on Delivery, Debit Card, Credit Card. Support split payments.
4.  **Delivery Driver App** (`/delivery-app`): Professional interface for drivers with dashboard, assigned deliveries, route optimization, GPS navigation, and status updates.
    - **Profile**: Photo, name, phone, status.
    - **Stats**: Total deliveries, this week/month, on-time %, avg delivery time.
    - **Earnings**: Tips earned, customer ratings, recent 3 reviews.
    - **Navigate**: Open Google Maps/Apple Maps/Waze with lat/lng deep link.
5.  **Super Admin Panel** (`/superadmin`): Accessible only to MASTER_ADMIN role.
    - **Dashboard**: KPIs, audit logs, version management.
    - **Animation Manager**: Create/edit/schedule animations with preview.
    - **Landing Page CMS**: Manage sections, reorder, edit content.
    - **Branding**: Logo, favicon, colors, theme tokens.
    - **Custom Sections**: JSON/block-based content management.
    - **Publish Workflow**: Draft → Stage → Prod with rollback capability.
    - Android/Web apps fetch `/public/config?env=prod` for live branding + sections + animations.

### Key Features and Design Decisions
-   **Multi-Tenant SaaS Architecture**: Core design principle, enabling a Super Admin platform for managing tenants and subscriptions.
-   **Database Schema**: Enhanced to support multi-location organizations, employees, payroll, comprehensive accounting, subscription plans, attendance, inventory, promotions, reviews, addresses (with lat/lng), drivers, branding, animations, lp_sections, releases, and audit_logs.
-   **Authentication & Authorization**: JWT-based authentication with role-based access control (MASTER_ADMIN, superadmin, org_owner, branch_manager, etc.). `/super-admin/**` routes guarded by MASTER_ADMIN role.
-   **Real-time Features**: WebSocket for live order updates, delivery tracking, inventory updates, and push notifications.
-   **Financial Management**: Complete profit/loss analysis, expense tracking, and financial period management.
-   **Human Resources**: Employee management, payroll processing, attendance tracking, and leave management.
-   **Inventory Management**: Real-time stock tracking, low stock alerts, purchase order management.
-   **UI/UX**: Focus on a friendly, welcoming, and easy-to-use interface with modern design elements, including laundry-themed loading animations and PWA install prompts.

### Business Rules (Non-negotiables)
-   **Service Types**: Only Wash, Iron, Wash+Iron visible in Customer App; Dry Cleaning hidden/blocked at API level.
-   **Dashboard Access**: Cannot be entered by anonymous users or those not onboarded.
-   **Navigation**: Requires proper lat/lng; block Navigate button if missing.
-   **Super Admin Edits**: Override live site/app branding after publish workflow.
-   **Interactive UI**: Every button must have a bound handler, no dead UI elements.
-   **Get Started Button**: Only in Laundry Master, routes to Create Account.
-   **Onboarding**: Start wizard never redirects to Dashboard until login + onboarding complete.

### Required APIs
-   `/orders`: CRUD with service_type validator (Wash, Iron, Wash+Iron only).
-   `/payments`: Create, update, webhook for BenefitPay.
-   `/drivers/:id/profile`: Stats, reviews, tips.
-   `/addresses`: Create/update with lat/lng validation.
-   `/super-admin/*`: Branding, animations, sections, publish, audit (MASTER_ADMIN only).
-   `/public/config?env=prod`: Read-only config snapshot for apps.

## External Dependencies

-   **@neondatabase/serverless**: Serverless PostgreSQL database connection.
-   **drizzle-orm**: Type-safe ORM for database operations.
-   **@tanstack/react-query**: Server state management.
-   **@radix-ui/**\*: Accessible UI component primitives.
-   **@stripe/stripe-js & @stripe/react-stripe-js**: Payment processing integration.
-   **bcryptjs**: Password hashing.
-   **jsonwebtoken**: JWT token management.
-   **ws**: WebSocket server implementation.
-   **Vite**: Build tool and development server.
-   **TypeScript**: Language.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **drizzle-kit**: Database schema management and migrations.