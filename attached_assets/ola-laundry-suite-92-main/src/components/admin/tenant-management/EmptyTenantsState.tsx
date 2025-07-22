
import { Users } from "lucide-react";

export function EmptyTenantsState() {
  return (
    <div className="text-center py-8">
      <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No tenants found</h3>
      <p className="text-sm text-muted-foreground">
        No tenants match your search criteria.
      </p>
    </div>
  );
}
