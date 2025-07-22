
import { useState } from "react";
import { CartItem } from "@/types/pos";
import { defaultServiceCategories, ServiceCategory } from "@/lib/defaultInventory";
import { toast } from "@/components/ui/sonner";

export function useStorefrontCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeService, setActiveService] = useState<ServiceCategory>("wash-fold");

  // Add item to cart
  const addToCart = (item: any) => {
    const service = defaultServiceCategories.find(s => s.id === activeService);
    
    if (!service) return;
    
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.id === item.id && cartItem.service?.id === service.id
    );
    
    if (existingItemIndex !== -1) {
      // Update existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add as new item
      setCart([
        ...cart, 
        { 
          id: item.id, 
          name: item.name, 
          price: item.price, 
          quantity: 1,
          service
        }
      ]);
    }
    
    toast.success(`Added ${item.name} with ${service.name} service`);
  };

  // Remove item from cart
  const removeFromCart = (index: number) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    } else {
      setCart(cart.filter((_, i) => i !== index));
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  return {
    cart,
    setCart,
    activeService,
    setActiveService,
    addToCart,
    removeFromCart,
    cartTotal
  };
}
