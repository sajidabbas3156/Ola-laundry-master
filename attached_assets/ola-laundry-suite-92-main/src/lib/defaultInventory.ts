
import { LaundryService } from "@/components/pos/ServiceSelector";

export type ServiceCategory = "wash-fold" | "dry-cleaning" | "wash-iron" | "iron-only";

export const defaultServiceCategories = [
  { 
    id: "wash-fold", 
    name: "Wash & Fold", 
    priceMultiplier: 1,
    description: "Complete wash and fold service"
  },
  { 
    id: "dry-cleaning", 
    name: "Dry Cleaning", 
    priceMultiplier: 1.5,
    description: "Professional dry cleaning service"
  },
  { 
    id: "wash-iron", 
    name: "Wash & Iron", 
    priceMultiplier: 1.2,
    description: "Wash with professional ironing"
  },
  { 
    id: "iron-only", 
    name: "Iron Only", 
    priceMultiplier: 0.8,
    description: "Professional ironing service only"
  },
];

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  enabledForServices: Record<ServiceCategory, boolean>;
  tenantId?: string;
  image?: string;
}

// Function to update item availability
export const updateItemAvailability = (
  inventory: InventoryItem[],
  itemId: string,
  isAvailable: boolean
): InventoryItem[] => {
  return inventory.map(item =>
    item.id === itemId ? { ...item, isAvailable } : item
  );
};

// Function to update item service availability
export const updateItemServiceAvailability = (
  inventory: InventoryItem[],
  itemId: string,
  service: ServiceCategory,
  enabled: boolean
): InventoryItem[] => {
  return inventory.map(item =>
    item.id === itemId
      ? {
          ...item,
          enabledForServices: {
            ...item.enabledForServices,
            [service]: enabled,
          },
        }
      : item
  );
};

// Function to update item price
export const updateItemPrice = (
  inventory: InventoryItem[],
  itemId: string,
  newPrice: number
): InventoryItem[] => {
  return inventory.map(item =>
    item.id === itemId ? { ...item, price: newPrice } : item
  );
};

// Fresh, comprehensive inventory for laundry services
export const defaultInventoryItems: InventoryItem[] = [
  // Shirts & Tops
  {
    id: "shirt-dress",
    name: "Dress Shirt",
    description: "Formal business dress shirt",
    price: 3.50,
    category: "shirts",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": true,
      "wash-iron": true,
      "iron-only": true
    }
  },
  {
    id: "shirt-casual",
    name: "Casual Shirt",
    description: "Cotton casual shirt",
    price: 2.75,
    category: "shirts",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": true,
      "iron-only": true
    }
  },
  {
    id: "tshirt",
    name: "T-Shirt",
    description: "Cotton t-shirt",
    price: 2.00,
    category: "shirts",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": true,
      "iron-only": false
    }
  },
  {
    id: "blouse",
    name: "Blouse",
    description: "Ladies blouse",
    price: 3.25,
    category: "shirts",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": true,
      "wash-iron": true,
      "iron-only": true
    }
  },

  // Pants & Bottoms
  {
    id: "pants-dress",
    name: "Dress Pants",
    description: "Formal dress pants",
    price: 4.50,
    category: "pants",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": true,
      "wash-iron": true,
      "iron-only": true
    }
  },
  {
    id: "jeans",
    name: "Jeans",
    description: "Denim jeans",
    price: 3.75,
    category: "pants",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": true,
      "iron-only": true
    }
  },
  {
    id: "shorts",
    name: "Shorts",
    description: "Casual shorts",
    price: 2.50,
    category: "pants",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": true,
      "iron-only": true
    }
  },
  {
    id: "skirt",
    name: "Skirt",
    description: "Ladies skirt",
    price: 3.50,
    category: "pants",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": true,
      "wash-iron": true,
      "iron-only": true
    }
  },

  // Dresses
  {
    id: "dress-casual",
    name: "Casual Dress",
    description: "Everyday dress",
    price: 5.50,
    category: "dresses",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": true,
      "wash-iron": true,
      "iron-only": true
    }
  },
  {
    id: "dress-formal",
    name: "Formal Dress",
    description: "Evening or cocktail dress",
    price: 8.50,
    category: "dresses",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": false,
      "dry-cleaning": true,
      "wash-iron": false,
      "iron-only": true
    }
  },
  {
    id: "dress-wedding",
    name: "Wedding Dress",
    description: "Bridal gown",
    price: 35.00,
    category: "dresses",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": false,
      "dry-cleaning": true,
      "wash-iron": false,
      "iron-only": false
    }
  },

  // Suits & Jackets
  {
    id: "suit-2piece",
    name: "2-Piece Suit",
    description: "Business suit (jacket + pants)",
    price: 12.50,
    category: "suits",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": false,
      "dry-cleaning": true,
      "wash-iron": false,
      "iron-only": true
    }
  },
  {
    id: "suit-3piece",
    name: "3-Piece Suit",
    description: "Formal suit (jacket + vest + pants)",
    price: 16.50,
    category: "suits",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": false,
      "dry-cleaning": true,
      "wash-iron": false,
      "iron-only": true
    }
  },
  {
    id: "blazer",
    name: "Blazer",
    description: "Sport coat or blazer",
    price: 6.50,
    category: "suits",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": false,
      "dry-cleaning": true,
      "wash-iron": false,
      "iron-only": true
    }
  },
  {
    id: "coat-winter",
    name: "Winter Coat",
    description: "Heavy winter coat",
    price: 15.00,
    category: "suits",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": false,
      "dry-cleaning": true,
      "wash-iron": false,
      "iron-only": false
    }
  },

  // Bedding & Household
  {
    id: "bedsheet-set",
    name: "Bed Sheet Set",
    description: "Complete sheet set (fitted, flat, pillowcases)",
    price: 8.00,
    category: "bedding",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": true,
      "iron-only": false
    }
  },
  {
    id: "comforter",
    name: "Comforter",
    description: "Bed comforter or duvet",
    price: 12.00,
    category: "bedding",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": true,
      "wash-iron": false,
      "iron-only": false
    }
  },
  {
    id: "pillows",
    name: "Pillows",
    description: "Bed pillows (per piece)",
    price: 4.50,
    category: "bedding",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": true,
      "wash-iron": false,
      "iron-only": false
    }
  },
  {
    id: "curtains",
    name: "Curtains",
    description: "Window curtains or drapes",
    price: 10.00,
    category: "bedding",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": true,
      "wash-iron": true,
      "iron-only": true
    }
  },
  {
    id: "tablecloth",
    name: "Tablecloth",
    description: "Dining table cloth",
    price: 6.00,
    category: "bedding",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": true,
      "iron-only": true
    }
  },

  // Undergarments
  {
    id: "underwear",
    name: "Underwear",
    description: "Undergarments (per piece)",
    price: 1.50,
    category: "underwear",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": false,
      "iron-only": false
    }
  },
  {
    id: "bras",
    name: "Bras",
    description: "Ladies bras (per piece)",
    price: 2.00,
    category: "underwear",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": false,
      "iron-only": false
    }
  },
  {
    id: "socks",
    name: "Socks",
    description: "Socks (per pair)",
    price: 1.25,
    category: "underwear",
    isAvailable: true,
    enabledForServices: {
      "wash-fold": true,
      "dry-cleaning": false,
      "wash-iron": false,
      "iron-only": false
    }
  }
];
