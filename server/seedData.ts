import { storage } from "./storage";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  console.log("Seeding database with Bahrain demo data...");

  try {
    // Create demo users
    const hashedPassword = await bcrypt.hash("demo123", 10);
    
    // Admin user
    const adminUser = await storage.createUser({
      email: "admin@laundrypro.bh",
      firstName: "Ahmad",
      lastName: "Al-Mahmood",
      phone: "+973-3300-1234",
      role: "admin",
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

    // Driver user
    const driverUser = await storage.createUser({
      email: "driver@laundrypro.bh",
      firstName: "Ali",
      lastName: "Al-Kuwari",
      phone: "+973-3333-4567",
      role: "driver",
      password: hashedPassword,
    });

    // Create customers
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