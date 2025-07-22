
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";

interface TenantSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TenantSearchFilters({ searchQuery, setSearchQuery }: TenantSearchFiltersProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Tenant Management</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tenants..."
            className="pl-8 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add New Tenant
        </Button>
      </div>
    </div>
  );
}
