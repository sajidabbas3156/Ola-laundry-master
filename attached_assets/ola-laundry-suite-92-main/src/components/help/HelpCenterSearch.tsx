
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HelpCenterSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HelpCenterSearch({ searchQuery, onSearchChange }: HelpCenterSearchProps) {
  return (
    <div className="max-w-2xl mx-auto relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        placeholder="Search for help articles, tutorials, or FAQs..."
        className="pl-12 h-14 text-lg"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
