
import { useState } from "react";
import { ServiceCategory } from "@/lib/defaultInventory";
import { useStorefrontOrderState } from "./StorefrontOrderState";
import { useStorefrontCart } from "./StorefrontCart";

export function useStorefrontState() {
  const [activeService, setActiveService] = useState<ServiceCategory>("wash-fold");
  
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery
  } = useStorefrontOrderState();

  const {
    cart,
    setCart,
    cartTotal
  } = useStorefrontCart();

  return {
    activeService,
    setActiveService,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    cart,
    setCart,
    cartTotal
  };
}
