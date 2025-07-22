
import { Button } from "@/components/ui/button";

interface ContactSupportSectionProps {
  onNavigate: (section: string) => void;
}

export function ContactSupportSection({ onNavigate }: ContactSupportSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-ola-600 to-ola-700 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
        <p className="text-xl mb-8 opacity-90">
          Our support team is available 24/7 to help you with any questions or issues.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-ola-600 hover:bg-gray-100" onClick={() => onNavigate("contact-support")}>
            Contact Support
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ola-600">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
