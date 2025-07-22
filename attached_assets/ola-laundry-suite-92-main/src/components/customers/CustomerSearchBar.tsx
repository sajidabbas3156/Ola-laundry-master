
import { Input } from "@/components/ui/input";

interface CustomerSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CustomerSearchBar({ searchQuery, onSearchChange }: CustomerSearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          placeholder="Search customers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
