
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
  const faqData = [
    {
      question: "How do I get started with Ola Laundry?",
      answer: "Getting started is easy! First, sign up for a free trial account. Then follow our setup wizard to configure your business details, add your services, and invite your team members. You can be up and running in under 30 minutes."
    },
    {
      question: "How do I add new customers to the system?",
      answer: "You can add customers in several ways: 1) Go to Customers > Add New Customer and fill in their details manually, 2) Import customers from a CSV file using the bulk import feature, 3) Customers can create their own accounts through your storefront, or 4) Add customers quickly during order creation in the POS system."
    },
    {
      question: "How do I create and track orders?",
      answer: "To create an order: 1) Go to Orders > New Order, 2) Select or add a customer, 3) Choose services and items, 4) Set pickup and delivery preferences, 5) Confirm the order. You can track orders in real-time through the Orders dashboard, and customers receive automatic updates via SMS and email."
    },
    {
      question: "How do I set up delivery routes and scheduling?",
      answer: "In the Scheduling section: 1) Define your delivery zones and time slots, 2) Set up recurring schedules for regular customers, 3) Use the route optimization feature to plan efficient delivery routes, 4) Assign drivers to specific routes, and 5) Track deliveries in real-time with GPS integration."
    },
    {
      question: "How do I process payments and generate invoices?",
      answer: "Payments can be processed through: 1) The POS system for in-person transactions, 2) Online payments through customer accounts, 3) Mobile payments via the driver app, or 4) Manual payment recording. Invoices are generated automatically and can be customized with your branding."
    },
    {
      question: "Can I customize the system for my business needs?",
      answer: "Yes! Ola Laundry is highly customizable: 1) Add your branding and colors, 2) Create custom service types and pricing, 3) Set up custom workflows and automation rules, 4) Configure user roles and permissions, 5) Integrate with third-party tools via our API."
    },
    {
      question: "How do I use the mobile app?",
      answer: "Download the Ola Laundry app from the App Store or Google Play. Staff can use it to: 1) View and update orders on the go, 2) Capture photos and signatures, 3) Process payments, 4) Navigate delivery routes, and 5) Communicate with customers. Customers can place orders, track deliveries, and make payments."
    },
    {
      question: "What if I need help or have technical issues?",
      answer: "We offer 24/7 support through multiple channels: 1) Live chat within the application, 2) Email support at support@olalaundry.com, 3) Phone support at +1 (555) 123-4567, 4) Comprehensive help documentation, and 5) Video tutorials. Our response time is typically under 2 hours."
    },
    {
      question: "How do I manage inventory and supplies?",
      answer: "Use the Inventory Management module to: 1) Track cleaning supplies and materials, 2) Set up low-stock alerts, 3) Manage vendor relationships, 4) Track costs and usage patterns, and 5) Generate purchase orders automatically when supplies run low."
    },
    {
      question: "Can I generate reports and analytics?",
      answer: "Yes! Access comprehensive reporting through the Reports section: 1) Revenue and profit reports, 2) Customer analytics and retention metrics, 3) Operational efficiency reports, 4) Driver performance tracking, 5) Custom reports with filters and date ranges. All reports can be exported to Excel or PDF."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find quick answers to the most common questions about using Ola Laundry.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left hover:text-ola-600 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
