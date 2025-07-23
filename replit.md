# OLA LAUNDRY MASTER - Premium Management Suite

## Overview

OLA LAUNDRY MASTER is a premium laundry management system built with a modern full-stack architecture. The application consists of multiple client interfaces (web admin dashboard, mobile POS, customer app, and delivery app) backed by a unified Express.js API server. The system is designed to handle all aspects of laundry business operations including order management, customer relations, delivery routing, and payment processing.

## Recent Changes

### Rebranding to OLA LAUNDRY MASTER (December 2024)
- **Complete visual rebrand**: Updated from "LaundryPro" to "OLA LAUNDRY MASTER" 
- **Logo integration**: Incorporated custom OLA LAUNDRY logo throughout the application
- **Premium design system**: Applied minimal, premium styling with enhanced blue color palette
- **Consistent branding**: Updated all UI components, navigation, headers, and footers
- **Enhanced user experience**: Improved spacing, typography, and visual hierarchy for premium feel

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

### Multiple Client Applications
The system provides eight comprehensive user interfaces:
1. **Web Admin Dashboard** (`/admin`) - Complete business management interface
2. **Mobile POS App** (`/pos`) - Point of sale for staff to process orders
3. **Customer App** (`/customer`) - Customer order placement and tracking
4. **Delivery App** (`/delivery`) - Driver route management and delivery tracking
5. **Inventory Management** (`/inventory`) - Stock tracking and management
6. **Promotion Management** (`/promotions`) - Marketing campaigns and discount codes
7. **Analytics Dashboard** (`/analytics`) - Business insights and performance metrics
8. **Notification Center** (`/notifications`) - System alerts and messaging

## Key Components

### Database Schema
- **Users**: Authentication and role-based access (customer, staff, admin, driver)
- **Customers**: Customer-specific data including addresses and preferences
- **Services**: Laundry services with flexible pricing models (per_lb, per_item, flat_rate)
- **Orders**: Order management with items, status tracking, and payment information
- **Machines**: Equipment status and scheduling
- **Delivery Routes**: Route optimization and delivery stop management
- **Inventory**: Stock management with automated reorder points and usage tracking
- **Promotions**: Marketing campaigns with discount codes and customer targeting
- **Reviews**: Customer feedback system with ratings and detailed comments
- **Analytics Events**: Business intelligence tracking for comprehensive reporting
- **Notifications**: System-wide messaging and alert management
- **Organizations & Branches**: Multi-tenant infrastructure with hierarchy support

### Authentication & Authorization
- JWT token-based authentication system
- Role-based access control (customer, staff, admin, driver)
- Middleware for protecting API endpoints
- Password hashing with bcrypt

### Real-time Features
- WebSocket connection for live order updates
- Real-time machine status monitoring
- Live delivery tracking
- Instant notifications across all client applications

### Payment Integration
- Stripe integration for payment processing
- Support for multiple payment methods
- Payment status tracking and refund handling

## Data Flow

1. **Order Creation**: Customers place orders through the customer app or staff creates orders via POS
2. **Order Processing**: Orders flow through status stages (pending → processing → ready → delivered)
3. **Machine Management**: Staff assigns orders to washing machines and tracks progress
4. **Delivery Coordination**: Delivery routes are created and assigned to drivers
5. **Real-time Updates**: All status changes are broadcast via WebSocket to relevant clients
6. **Payment Processing**: Payments are handled securely through Stripe integration

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