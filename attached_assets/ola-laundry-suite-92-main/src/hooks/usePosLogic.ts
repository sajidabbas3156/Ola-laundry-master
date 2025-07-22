
import { useState, useMemo } from "react";
import { InventoryItem, defaultServiceCategories } from "@/lib/defaultInventory";
import { CartItem } from "@/types/pos";
import { toast } from "@/components/ui/sonner";

export function usePosLogic(
  inventory: InventoryItem[],
  getCustomersByTenant: (tenantId: string) => any[],
  tenantId?: string
) {
  const [cart, setCart] = useState<CartItem[]>([]);

  console.log("usePosLogic - Hook initialized:");
  console.log("- Inventory items:", inventory?.length || 0);
  console.log("- Tenant ID:", tenantId);

  // Filter available items (only items that are available and have at least one enabled service)
  const availableItems = useMemo(() => {
    console.log("usePosLogic - Processing inventory items");
    
    if (!inventory || !Array.isArray(inventory)) {
      console.warn("usePosLogic - Invalid inventory data:", inventory);
      return [];
    }

    const filtered = inventory.filter(item => {
      if (!item.isAvailable) {
        console.log("usePosLogic - Item not available:", item.name);
        return false;
      }
      
      // Check if item has at least one enabled service
      const hasEnabledService = defaultServiceCategories.some(service => 
        item.enabledForServices[service.id as keyof typeof item.enabledForServices]
      );
      
      if (!hasEnabledService) {
        console.log("usePosLogic - Item has no enabled services:", item.name);
        return false;
      }
      
      return true;
    });

    console.log("usePosLogic - Available items after filtering:", filtered.length);
    return filtered;
  }, [inventory]);

  // Get unique categories from available items
  const categories = useMemo(() => {
    if (!availableItems || availableItems.length === 0) {
      console.log("usePosLogic - No available items for categories");
      return [];
    }

    const cats = Array.from(new Set(availableItems.map(item => item.category)));
    console.log("usePosLogic - Categories found:", cats);
    return cats;
  }, [availableItems]);

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleAddToCart = (item: InventoryItem, service: any) => {
    console.log("usePosLogic - Adding to cart:", { item: item.name, service: service?.name });

    if (!service) {
      console.warn("usePosLogic - No service selected for item:", item.name);
      toast.error("Please select a service");
      return;
    }

    // Check if service is enabled for this item
    if (!item.enabledForServices[service.id as keyof typeof item.enabledForServices]) {
      console.warn("usePosLogic - Service not enabled for item:", { item: item.name, service: service.name });
      toast.error(`${service.name} is not available for this item`);
      return;
    }

    const finalPrice = item.price * service.priceMultiplier;
    console.log("usePosLogic - Calculated price:", { basePrice: item.price, multiplier: service.priceMultiplier, finalPrice });
    
    // Check if item with same service already exists in cart
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.id === item.id && cartItem.service?.id === service.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
      console.log("usePosLogic - Updated existing cart item quantity");
      toast.success(`Increased quantity of ${item.name} with ${service.name}`);
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        id: item.id,
        name: item.name,
        price: finalPrice,
        quantity: 1,
        service: service
      };
      
      setCart(prevCart => {
        const newCart = [...prevCart, cartItem];
        console.log("usePosLogic - Added new item to cart. Total items:", newCart.length);
        return newCart;
      });
      toast.success(`Added ${item.name} with ${service.name} to cart`);
    }
  };

  const handleUpdateCart = (itemId: string, quantity: number) => {
    console.log("usePosLogic - Updating cart item:", { itemId, quantity });

    if (quantity <= 0) {
      setCart(prevCart => {
        const filtered = prevCart.filter(item => item.id !== itemId);
        console.log("usePosLogic - Removed item from cart. Remaining items:", filtered.length);
        return filtered;
      });
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    console.log("usePosLogic - Removing from cart:", itemId);
    setCart(prevCart => {
      const filtered = prevCart.filter(item => item.id !== itemId);
      console.log("usePosLogic - Cart after removal:", filtered.length);
      return filtered;
    });
  };

  const clearCart = () => {
    console.log("usePosLogic - Clearing cart");
    setCart([]);
  };

  return {
    cart,
    availableItems,
    categories,
    formatCurrency,
    handleAddToCart,
    handleUpdateCart,
    handleRemoveFromCart,
    clearCart
  };
}
