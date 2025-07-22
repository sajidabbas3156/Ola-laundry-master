
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface InventorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function InventorySearch({ searchTerm, onSearchChange }: InventorySearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search inventory..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
