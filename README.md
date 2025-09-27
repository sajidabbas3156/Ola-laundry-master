# OLA Laundry Master 🧺

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Premium Laundry Management System with AI-Powered Business Intelligence**

OLA Laundry Master is a comprehensive, full-stack laundry management solution designed for modern laundry businesses. Built with cutting-edge technology and powered by advanced AI features, it provides everything needed to run a successful laundry operation.

## 🌟 Key Features

### 🤖 AI-Powered Intelligence
- **AI Operations Center**: Real-time insights and automated decision-making
- **OLAORDERS Financial AI**: Advanced financial forecasting and optimization
- **Predictive Analytics**: Revenue, demand, and cost predictions
- **Smart Automation**: AI-driven business process optimization
- **Model Validation**: Comprehensive accuracy testing and monitoring

### 💼 Business Management
- **Multi-tenant Architecture**: Support for multiple laundry locations
- **Point of Sale (POS)**: Modern, intuitive transaction processing
- **Customer Management**: Comprehensive customer profiles and history
- **Order Tracking**: Real-time order status and lifecycle management
- **Inventory Management**: Smart stock tracking and automated reordering

### 📱 Multi-Platform Support
- **Web Admin Panel**: Full-featured business management dashboard
- **Mobile Apps**: Customer and delivery driver applications
- **PWA Support**: Offline-capable progressive web application
- **Android App**: Native mobile experience with Capacitor

### 📊 Analytics & Reporting
- **Advanced Analytics**: Comprehensive business intelligence
- **Financial Reports**: Detailed profit/loss and cash flow analysis
- **Performance Metrics**: KPI tracking and trend analysis
- **Custom Dashboards**: Role-based information displays

### 🚚 Operations Management
- **Delivery Management**: Route optimization and driver tracking
- **Service Management**: Flexible service offerings and pricing
- **Staff Management**: Employee scheduling and payroll
- **Workflow Automation**: Streamlined business processes

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for data fetching and caching
- **Wouter** for lightweight routing
- **Radix UI** + **Tailwind CSS** for modern UI components
- **Capacitor** for mobile app development

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL/SQLite
- **JWT Authentication** with Passport.js
- **WebSocket** support for real-time features
- **PM2** for production process management

### AI & Analytics
- **Custom AI Models** for business intelligence
- **Predictive Analytics** engine
- **Real-time Data Processing**
- **Model Validation** and accuracy testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+ (or SQLite for development)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ola-laundry-master.git
   cd ola-laundry-master
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**:
   ```bash
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Access the application**:
   - Web App: http://localhost:5000
   - AI Operations Center: http://localhost:5000/tenant/ola-laundry/ai-operations

## 🤖 AI Features

### AI Operations Center
The central hub for all AI-powered business intelligence:

- **Real-time Insights**: Automated analysis of business performance
- **Predictive Forecasting**: Revenue, demand, and operational predictions
- **Smart Recommendations**: AI-driven optimization suggestions
- **Automation Monitoring**: Track automated business processes

**Access**: Navigate to `/tenant/:tenantSlug/ai-operations`

### OLAORDERS Financial AI
Advanced financial analysis and forecasting:

- **Revenue Predictions**: Accurate monthly and quarterly forecasts
- **Cash Flow Analysis**: Detailed inflow/outflow projections
- **Profitability Analysis**: Service-level profit margin optimization
- **Risk Assessment**: Financial risk identification and mitigation

### AI Model Validation
Comprehensive testing and accuracy monitoring:

- **Automated Testing**: Regular model accuracy validation
- **Performance Metrics**: Detailed accuracy tracking by metric and timeframe
- **Model Health Monitoring**: Real-time model performance assessment
- **Improvement Recommendations**: AI-driven model enhancement suggestions

## 📱 Mobile Applications

### Customer App
- Order placement and tracking
- Service history and preferences
- Payment processing
- Loyalty program integration

### Delivery Driver App
- Route optimization
- Order pickup and delivery tracking
- Customer communication
- Performance analytics

### Vendor POS App
- Quick order processing
- Customer lookup
- Payment handling
- Inventory management

## 🏢 Multi-Tenant Architecture

OLA Laundry Master supports multiple laundry businesses with:

- **Isolated Data**: Complete data separation between tenants
- **Custom Branding**: Tenant-specific branding and configuration
- **Flexible Pricing**: Different pricing models per tenant
- **Role-Based Access**: Granular permission system

## 📊 Analytics & Reporting

### Business Intelligence
- Revenue and profit analysis
- Customer behavior insights
- Operational efficiency metrics
- Market trend analysis

### AI-Enhanced Analytics
- Predictive revenue forecasting
- Demand pattern recognition
- Cost optimization recommendations
- Customer lifetime value predictions

## 🔧 Configuration

### Environment Variables

```bash
# Application
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ola_laundry

# Security
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:5000

# AI Services (Optional)
AI_SERVICE_URL=https://api.your-ai-service.com
AI_API_KEY=your-ai-api-key
```

### Database Configuration

The application supports both PostgreSQL (production) and SQLite (development):

```typescript
// For PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/database

// For SQLite (development)
DATABASE_URL=sqlite:./dev.db
```

## 🚀 Production Deployment

### Using PM2

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start with PM2**:
   ```bash
   npm run start:prod
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup

For production deployment, see:
- [AI Features Documentation](./docs/AI_FEATURES.md)
- [AI Deployment Guide](./docs/AI_DEPLOYMENT_GUIDE.md)

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# AI model validation
npm run ai:validate

# Integration tests
npm run test:integration
```

### AI Model Testing
The application includes comprehensive AI model validation:

```bash
# Run AI validation tests
curl -H "Authorization: Bearer demo-token-123" \
     http://localhost:5000/api/ai/validation
```

## 📚 API Documentation

### Authentication
All API endpoints require JWT authentication:

```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     http://localhost:5000/api/endpoint
```

### Key Endpoints

#### AI Operations
- `GET /api/ai/operations` - AI insights and automation status
- `GET /api/ai/validation` - Model validation results

#### Financial AI
- `GET /api/financial/ai-analysis` - Comprehensive financial analysis

#### Business Operations
- `GET /api/dashboard/stats` - Business dashboard data
- `GET /api/orders` - Order management
- `GET /api/customers` - Customer management

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About OLA Laundry

**OLA ORDERS LAUNDRY W.L.L** is Bahrain's premier eco-friendly laundry service, committed to providing exceptional quality while maintaining environmental responsibility.

- **Location**: Hoora, Manama, Bahrain
- **Phone**: +973 37960004
- **Website**: [www.olalaundry.com](https://www.olalaundry.com)
- **Email**: info@olalaundry.com

### Our Mission
To revolutionize the laundry industry through innovative technology, sustainable practices, and exceptional customer service.

## 🆘 Support

### Documentation
- [AI Features Guide](./docs/AI_FEATURES.md)
- [Deployment Guide](./docs/AI_DEPLOYMENT_GUIDE.md)
- [API Documentation](./docs/API.md)

### Contact
- **Technical Support**: tech-support@olalaundry.com
- **Business Inquiries**: business@olalaundry.com
- **Emergency Support**: +973-XXXX-XXXX

### Community
- [GitHub Issues](https://github.com/your-username/ola-laundry-master/issues)
- [Discussions](https://github.com/your-username/ola-laundry-master/discussions)

---

**Built with ❤️ by the OLA Laundry Development Team**

*Transforming laundry management through intelligent technology*