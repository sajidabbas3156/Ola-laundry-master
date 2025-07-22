
import { useState } from 'react';
import { CartItem } from '@/types/pos';
import { useLocalization } from '@/contexts/LocalizationContext';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const { formatCurrency } = useLocalization();

  const showServiceSelection = (item: any) => {
    setSelectedItem(item);
    setSelectedServiceId('');
    setShowServiceDialog(true);
  };

  const addToCartWithService = () => {
    if (!selectedItem || !selectedServiceId) return;
    
    const service = { id: selectedServiceId, name: selectedServiceId };
    const cartItem: CartItem = {
      ...selectedItem,
      quantity: 1,
      service
    };
    
    setCart(prev => [...prev, cartItem]);
    setShowServiceDialog(false);
    setSelectedItem(null);
    setSelectedServiceId('');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const itemIndex = prev.findIndex(item => item.id === itemId);
      if (itemIndex > -1) {
        const newCart = [...prev];
        if (newCart[itemIndex].quantity > 1) {
          newCart[itemIndex].quantity -= 1;
        } else {
          newCart.splice(itemIndex, 1);
        }
        return newCart;
      }
      return prev;
    });
  };

  const addItemQuantity = (index: number) => {
    setCart(prev => {
      const newCart = [...prev];
      if (newCart[index]) {
        newCart[index].quantity += 1;
      }
      return newCart;
    });
  };

  const deleteFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return {
    cart,
    setCart,
    selectedItem,
    selectedServiceId,
    setSelectedServiceId,
    showServiceDialog,
    setShowServiceDialog,
    formatCurrency,
    showServiceSelection,
    addToCartWithService,
    removeFromCart,
    addItemQuantity,
    deleteFromCart,
    clearCart,
    cartTotal
  };
}
