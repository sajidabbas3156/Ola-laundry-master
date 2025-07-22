
import { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";

export function useStorefrontOrderState() {
  const { inventory } = useInventory();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    inventory,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery
  };
}
