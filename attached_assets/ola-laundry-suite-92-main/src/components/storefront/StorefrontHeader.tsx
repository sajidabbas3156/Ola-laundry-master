
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface StorefrontHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartLength: number;
  onCartClick: () => void;
}

export function StorefrontHeader({ 
  searchQuery, 
  setSearchQuery, 
  cartLength, 
  onCartClick 
}: StorefrontHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-3xl font-bold">Laundry Services</h1>
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
            placeholder="Search items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={onCartClick}
          disabled={cartLength === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{cartLength}</span>
        </Button>
      </div>
    </div>
  );
}
