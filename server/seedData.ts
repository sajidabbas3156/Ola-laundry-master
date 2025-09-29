import { storage } from "./storage";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  console.log("Seeding database with Bahrain demo data and role-based system...");

  try {
    // Check if users already exist
    const existingAdmin = await storage.getUserByEmail("superadmin@laundrypro.com");
    if (existingAdmin) {
      console.log("Users already exist, skipping seed...");
      return;
    }

    // Create demo users with different roles
    const hashedPassword = await bcrypt.hash("demo123", 10);
    
    // Super Admin (Platform level)
    const superAdminUser = await storage.createUser({
      email: "superadmin@laundrypro.com",
      firstName: "System",
      lastName: "Administrator",
      phone: "+973-1111-0000",
      role: "superadmin",
      password: hashedPassword,
    });

    // Organization Owner (Vendor level)
    const orgOwnerUser = await storage.createUser({
      email: "owner@laundrypro.bh",
      firstName: "Ahmad",
      lastName: "Al-Mahmood",
      phone: "+973-3300-1234",
      role: "org_owner",
      password: hashedPassword,
    });

    // Branch Manager
    const branchManagerUser = await storage.createUser({
      email: "manager@laundrypro.bh",
      firstName: "Fatima",
      lastName: "Al-Zahra",
      phone: "+973-3300-2345",
      role: "branch_manager",
      password: hashedPassword,
    });

    // Inventory Manager
    const inventoryManagerUser = await storage.createUser({
      email: "inventory@laundrypro.bh",
      firstName: "Omar",
      lastName: "Al-Rashid",
      phone: "+973-3300-3456",
      role: "inventory_manager",
      password: hashedPassword,
    });

    // Laundry Staff
    const laundryStaffUser = await storage.createUser({
      email: "staff@laundrypro.bh",
      firstName: "Mariam",
      lastName: "Al-Mansouri",
      phone: "+973-3300-4567",
      role: "laundry_staff",
      password: hashedPassword,
    });

    // Cashier
    const cashierUser = await storage.createUser({
      email: "cashier@laundrypro.bh",
      firstName: "Khalid",
      lastName: "Al-Bahrani",
      phone: "+973-3300-5678",
      role: "cashier",
      password: hashedPassword,
    });

    // Delivery Agent
    const deliveryAgentUser = await storage.createUser({
      email: "delivery@laundrypro.bh",
      firstName: "Ali",
      lastName: "Al-Kuwari",
      phone: "+973-3333-4567",
      role: "delivery_agent",
      password: hashedPassword,
    });

    // Customer users
    const customer1User = await storage.createUser({
      email: "sara.ahmed@gmail.com",
      firstName: "Sara",
      lastName: "Ahmed",
      phone: "+973-3311-5678",
      role: "customer",
      password: hashedPassword,
    });

    const customer2User = await storage.createUser({
      email: "mohammed.hassan@yahoo.com",
      firstName: "Mohammed",
      lastName: "Hassan",
      phone: "+973-3322-9012",
      role: "customer",
      password: hashedPassword,
    });

    // Create tenants
    const mainTenant = await storage.createTenant({
      name: "OLA Laundry Bahrain",
      slug: "ola-laundry-bh",
      subdomain: "ola-laundry-bh",
      email: "info@olalaundry.com",
      contactEmail: "support@olalaundry.com",
      address: "Building 456, Road 789, Block 123, Hoora",
      phone: "+973-37960004",
      isActive: true,
      customDomain: "ola-laundry-bh.replit.app",
      defaultCurrency: "BHD",
      defaultLanguage: "en",
      whatsappNumber: "+973-37960004",
      primaryColor: "#2C1A5B",
      subscriptionStatus: "active",
      subscriptionPlan: "premium",
      locationData: {
        country: "Bahrain",
        city: "Manama",
        latitude: 26.2285,
        longitude: 50.5860
      }
    });

    const demoTenant = await storage.createTenant({
      name: "Demo Laundry Service",
      slug: "demo-laundry",
      subdomain: "demo-laundry",
      email: "demo@demolaundry.com",
      contactEmail: "contact@demolaundry.com",
      address: "Demo Street 123, Riffa",
      phone: "+973-1234-5678",
      isActive: true,
      customDomain: "demo-laundry.replit.app",
      defaultCurrency: "BHD",
      defaultLanguage: "en",
      whatsappNumber: "+973-1234-5678",
      primaryColor: "#FF6B35",
      subscriptionStatus: "trial",
      subscriptionPlan: "basic",
      locationData: {
        country: "Bahrain",
        city: "Riffa",
        latitude: 26.1296,
        longitude: 50.5550
      }
    });

    // Create customers (simplified for working system)
    const customer1 = await storage.createCustomer({
      userId: customer1User.id,
      address: "Building 123, Road 456, Block 789",
      city: "Manama",
      zipCode: "12345",
      preferences: { 
        washTemperature: "warm",
        fabric_softener: true,
        delivery_time: "morning",
        notifications: { sms: true, email: true }
      },
      loyaltyPoints: 250,
    });

    const customer2 = await storage.createCustomer({
      userId: customer2User.id,
      address: "Villa 45, Diplomatic Area",
      city: "Manama",
      zipCode: "11111",
      preferences: { 
        washTemperature: "cold",
        starch: "light",
        delivery_time: "evening",
        notifications: { sms: true, email: false }
      },
      loyaltyPoints: 180,
    });

    // Create Bahrain-specific services (with BHD pricing)
    const services = [
      {
        name: "Regular Wash & Fold",
        description: "Standard washing and folding service",
        category: "wash_fold",
        priceType: "per_lb",
        basePrice: "1.500", // 1.5 BHD per lb
        estimatedTime: 1440, // 24 hours
      },
      {
        name: "Express Wash & Fold",
        description: "Same-day washing and folding",
        category: "express",
        priceType: "per_lb", 
        basePrice: "2.500", // 2.5 BHD per lb
        estimatedTime: 360, // 6 hours
      },
      {
        name: "Thobe Dry Cleaning",
        description: "Professional dry cleaning for traditional wear",
        category: "dry_clean",
        priceType: "per_item",
        basePrice: "8.000", // 8 BHD per thobe
        estimatedTime: 2880, // 48 hours
      },
      {
        name: "Suit Dry Cleaning",
        description: "Premium dry cleaning for business suits",
        category: "dry_clean",
        priceType: "per_item",
        basePrice: "12.000", // 12 BHD per suit
        estimatedTime: 2880, // 48 hours
      },
      {
        name: "Abaya Cleaning",
        description: "Specialized cleaning for abayas",
        category: "dry_clean",
        priceType: "per_item",
        basePrice: "6.000", // 6 BHD per abaya
        estimatedTime: 2880, // 48 hours
      },
      {
        name: "Comforter Cleaning",
        description: "Deep cleaning for large bedding items",
        category: "wash_fold",
        priceType: "per_item",
        basePrice: "15.000", // 15 BHD per comforter
        estimatedTime: 2880, // 48 hours
      },
    ];

    const createdServices = [];
    for (const service of services) {
      createdServices.push(await storage.createService(service));
    }

    // Create sample orders
    const order1 = await storage.createOrder({
      customerId: customer1.id,
      totalAmount: "22.500", // 22.5 BHD
      itemCount: 3,
      weight: "8.50",
      status: "processing",
      paymentStatus: "paid",
      paymentMethod: "benefit_pay",
      estimatedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      instructions: "Please handle delicate fabrics with care"
    });

    // Add items to order1
    await storage.createOrderItem({
      orderId: order1.id,
      serviceId: createdServices[1].id, // Express Wash & Fold
      quantity: 1,
      unitPrice: "21.250", // 8.5 lbs * 2.5 BHD
      totalPrice: "21.250",
    });

    await storage.createOrderItem({
      orderId: order1.id,
      serviceId: createdServices[4].id, // Abaya Cleaning
      quantity: 1,
      unitPrice: "6.000",
      totalPrice: "6.000",
    });

    const order2 = await storage.createOrder({
      customerId: customer2.id,
      totalAmount: "27.000", // 27 BHD
      itemCount: 2,
      status: "ready",
      paymentStatus: "paid",
      paymentMethod: "apple_pay",
      actualCompletion: new Date(),
      instructions: "Light starch on shirts please"
    });

    // Add items to order2
    await storage.createOrderItem({
      orderId: order2.id,
      serviceId: createdServices[3].id, // Suit Dry Cleaning
      quantity: 1,
      unitPrice: "12.000",
      totalPrice: "12.000",
    });

    await storage.createOrderItem({
      orderId: order2.id,
      serviceId: createdServices[5].id, // Comforter Cleaning
      quantity: 1,
      unitPrice: "15.000",
      totalPrice: "15.000",
    });

    // Create machines
    const machines = [
      {
        name: "Washer #1 - LG Commercial",
        type: "washer",
        status: "in_use",
        location: "Ground Floor - Zone A",
        capacity: "18.00", // 18 kg capacity
        timeRemaining: 25,
      },
      {
        name: "Washer #2 - Samsung Heavy Duty",
        type: "washer", 
        status: "available",
        location: "Ground Floor - Zone A",
        capacity: "20.00", // 20 kg capacity
      },
      {
        name: "Dryer #1 - Electrolux",
        type: "dryer",
        status: "in_use", 
        location: "Ground Floor - Zone B",
        capacity: "15.00", // 15 kg capacity
        timeRemaining: 18,
      },
      {
        name: "Dryer #2 - Whirlpool Commercial",
        type: "dryer",
        status: "available",
        location: "Ground Floor - Zone B", 
        capacity: "18.00", // 18 kg capacity
      },
    ];

    for (const machine of machines) {
      await storage.createMachine?.(machine);
    }

    console.log("✅ Database seeded successfully with Bahrain demo data!");
    console.log("Demo accounts created:");
    console.log("- Admin: admin@laundrypro.bh / demo123");
    console.log("- Customer 1: sara.ahmed@gmail.com / demo123"); 
    console.log("- Customer 2: mohammed.hassan@yahoo.com / demo123");
    console.log("- Driver: driver@laundrypro.bh / demo123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}