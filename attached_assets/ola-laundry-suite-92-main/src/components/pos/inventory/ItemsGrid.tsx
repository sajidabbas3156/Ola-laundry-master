
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemCard } from "@/components/pos/inventory/ItemCard";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { InventoryItem } from "@/lib/defaultInventory";

interface ItemsGridProps {
  inventory: InventoryItem[];
  serviceCategories: any[];
  onAvailabilityToggle: (itemId: string, isAvailable: boolean) => void;
  onServiceToggle: (itemId: string, service: any, enabled: boolean) => void;
  onPriceUpdate: (itemId: string, newPrice: number) => void;
}

export function ItemsGrid({
  inventory,
  serviceCategories,
  onAvailabilityToggle,
  onServiceToggle,
  onPriceUpdate
}: ItemsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(new Set(inventory.map(item => item.category)));
  
  const filteredItems = inventory.filter(
    item => (activeCategory === "all" || item.category === activeCategory) &&
    (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="relative">
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
      
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <div className="overflow-x-auto">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All Items</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <ResponsiveGrid minItemWidth="280px">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              serviceCategories={serviceCategories}
              onAvailabilityToggle={onAvailabilityToggle}
              onServiceToggle={onServiceToggle}
              onPriceUpdate={onPriceUpdate}
            />
          ))}
        </ResponsiveGrid>
        
        {filteredItems.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No items found matching your search.
          </div>
        )}
      </Tabs>
    </div>
  );
}
