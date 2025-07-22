
import { Badge } from "@/components/ui/badge";
import { HelpCenterSearch } from "./HelpCenterSearch";

interface HelpCenterHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HelpCenterHero({ searchQuery, onSearchChange }: HelpCenterHeroProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <Badge className="mb-4 bg-ola-100 text-ola-700">Help Center</Badge>
        <h1 className="text-5xl font-bold mb-6">How can we help you?</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Find answers to your questions, learn how to use Ola Laundry, and get the most out of our platform.
        </p>
        
        <HelpCenterSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
      </div>
    </section>
  );
}
