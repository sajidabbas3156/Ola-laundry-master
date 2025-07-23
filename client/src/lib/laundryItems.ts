export interface LaundryItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  basePrice: number;
}

export const laundryItems: LaundryItem[] = [
  // Everyday Wear
  { id: 'shirt', name: 'Shirt', category: 'everyday', icon: '👔', basePrice: 2.0 },
  { id: 'tshirt', name: 'T-Shirt', category: 'everyday', icon: '👕', basePrice: 1.5 },
  { id: 'pants', name: 'Pants/Trousers', category: 'everyday', icon: '👖', basePrice: 2.5 },
  { id: 'jeans', name: 'Jeans', category: 'everyday', icon: '👖', basePrice: 3.0 },
  { id: 'shorts', name: 'Shorts', category: 'everyday', icon: '🩳', basePrice: 1.5 },
  { id: 'skirt', name: 'Skirt', category: 'everyday', icon: '👗', basePrice: 2.0 },
  { id: 'dress', name: 'Dress', category: 'everyday', icon: '👗', basePrice: 3.5 },
  { id: 'blouse', name: 'Blouse', category: 'everyday', icon: '👚', basePrice: 2.0 },
  
  // Undergarments
  { id: 'socks', name: 'Socks (pair)', category: 'undergarments', icon: '🧦', basePrice: 0.5 },
  { id: 'underwear', name: 'Underwear', category: 'undergarments', icon: '🩲', basePrice: 1.0 },
  { id: 'bra', name: 'Bra', category: 'undergarments', icon: '👙', basePrice: 1.5 },
  { id: 'undershirt', name: 'Undershirt/Vest', category: 'undergarments', icon: '🎽', basePrice: 1.0 },
  
  // Formal Wear
  { id: 'suit_jacket', name: 'Suit Jacket', category: 'formal', icon: '🧥', basePrice: 5.0 },
  { id: 'suit_pants', name: 'Suit Pants', category: 'formal', icon: '👔', basePrice: 3.5 },
  { id: 'tie', name: 'Tie', category: 'formal', icon: '👔', basePrice: 1.5 },
  { id: 'formal_dress', name: 'Formal Dress', category: 'formal', icon: '👗', basePrice: 6.0 },
  
  // Traditional Wear
  { id: 'abaya', name: 'Abaya', category: 'traditional', icon: '🥻', basePrice: 6.0 },
  { id: 'thobe', name: 'Thobe/Dishdasha', category: 'traditional', icon: '🥻', basePrice: 5.0 },
  { id: 'hijab', name: 'Hijab/Scarf', category: 'traditional', icon: '🧕', basePrice: 2.0 },
  { id: 'jalabiya', name: 'Jalabiya', category: 'traditional', icon: '🥻', basePrice: 4.5 },
  
  // Outerwear
  { id: 'jacket', name: 'Jacket', category: 'outerwear', icon: '🧥', basePrice: 4.0 },
  { id: 'coat', name: 'Coat', category: 'outerwear', icon: '🧥', basePrice: 6.0 },
  { id: 'sweater', name: 'Sweater', category: 'outerwear', icon: '🧥', basePrice: 3.0 },
  { id: 'hoodie', name: 'Hoodie', category: 'outerwear', icon: '🧥', basePrice: 3.5 },
  
  // Bedding
  { id: 'bedsheet', name: 'Bed Sheet', category: 'bedding', icon: '🛏️', basePrice: 4.0 },
  { id: 'pillowcase', name: 'Pillow Case', category: 'bedding', icon: '🛏️', basePrice: 1.5 },
  { id: 'blanket', name: 'Blanket', category: 'bedding', icon: '🛏️', basePrice: 8.0 },
  { id: 'comforter', name: 'Comforter', category: 'bedding', icon: '🛏️', basePrice: 15.0 },
  { id: 'duvet', name: 'Duvet', category: 'bedding', icon: '🛏️', basePrice: 12.0 },
  { id: 'mattress_cover', name: 'Mattress Cover', category: 'bedding', icon: '🛏️', basePrice: 6.0 },
  
  // Household
  { id: 'towel', name: 'Towel', category: 'household', icon: '🧺', basePrice: 2.5 },
  { id: 'bath_towel', name: 'Bath Towel', category: 'household', icon: '🧺', basePrice: 3.5 },
  { id: 'hand_towel', name: 'Hand Towel', category: 'household', icon: '🧺', basePrice: 1.5 },
  { id: 'tablecloth', name: 'Table Cloth', category: 'household', icon: '🧺', basePrice: 4.0 },
  { id: 'curtains', name: 'Curtains', category: 'household', icon: '🪟', basePrice: 8.0 },
  { id: 'carpet', name: 'Carpet/Rug', category: 'household', icon: '🧺', basePrice: 20.0 },
  
  // Accessories
  { id: 'cap', name: 'Cap/Hat', category: 'accessories', icon: '🧢', basePrice: 2.0 },
  { id: 'gloves', name: 'Gloves (pair)', category: 'accessories', icon: '🧤', basePrice: 1.5 },
  { id: 'belt', name: 'Belt', category: 'accessories', icon: '👔', basePrice: 1.0 },
  { id: 'bag', name: 'Bag/Purse', category: 'accessories', icon: '👜', basePrice: 5.0 },
];

export const laundryServices = [
  { id: 'wash', name: 'Wash Only', icon: '💧', priceMultiplier: 1.0 },
  { id: 'iron', name: 'Iron Only', icon: '♨️', priceMultiplier: 0.6 },
  { id: 'wash_iron', name: 'Wash & Iron', icon: '✨', priceMultiplier: 1.4 },
];

export const finishingOptions = [
  { id: 'fold', name: 'Folded', icon: '📦' },
  { id: 'hanger', name: 'On Hanger', icon: '🧥' },
];

export const deliveryOptions = [
  { id: 'store_pickup', name: 'Store Pickup', icon: '🏪', price: 0 },
  { id: 'home_delivery', name: 'Home Delivery', icon: '🚚', price: 2.0 },
];