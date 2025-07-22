
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { PosMainInterface } from "./PosMainInterface";
import { ReceiptsManager } from "./ReceiptsManager";
import { InventoryManager } from "./InventoryManager";
import { PosSettingsTab } from "./PosSettingsTab";

interface PosTabsContentProps {
  availableItems: any[];
  categories: string[];
  cart: any[];
  inventory: any[];
  updateInventory: (inventory: any[]) => void;
  onAddToCart: (item: any) => void;
  onUpdateCart: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

export function PosTabsContent({
  availableItems,
  categories,
  cart,
  inventory,
  updateInventory,
  onAddToCart,
  onUpdateCart,
  onRemoveFromCart,
  formatCurrency
}: PosTabsContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const handleCheckout = async (): Promise<void> => {
    console.log("Processing checkout...");
    // Add checkout logic here
  };

  const addItemQuantity = (index: number) => {
    if (cart[index]) {
      onUpdateCart(cart[index].id, cart[index].quantity + 1);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      <TabsContent value="pos" className="flex-1 p-0">
        <PosMainInterface
          availableItems={availableItems}
          categories={categories}
          cart={cart}
          addToCart={onAddToCart}
          formatCurrency={formatCurrency}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          removeFromCart={onRemoveFromCart}
          addItemQuantity={addItemQuantity}
          deleteFromCart={onRemoveFromCart}
          cartTotal={cartTotal}
          notes={notes}
          setNotes={setNotes}
          handleCheckout={handleCheckout}
          isProcessing={false}
          selectedCustomer={selectedCustomer}
          tenantCustomers={[]}
          setSelectedCustomer={setSelectedCustomer}
        />
      </TabsContent>

      <TabsContent value="receipts" className="flex-1 p-6">
        <ReceiptsManager />
      </TabsContent>

      <TabsContent value="delivery" className="flex-1 p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Delivery Management</h3>
          <p className="text-muted-foreground">Track and manage delivery orders</p>
        </div>
      </TabsContent>

      <TabsContent value="inventory" className="flex-1 p-0">
        <InventoryManager 
          inventory={inventory}
          updateInventory={updateInventory}
        />
      </TabsContent>

      <TabsContent value="pos-settings" className="flex-1 p-0">
        <PosSettingsTab />
      </TabsContent>

      <TabsContent value="settings" className="flex-1 p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">General Settings</h3>
          <p className="text-muted-foreground">Configure your POS system settings</p>
        </div>
      </TabsContent>

      <TabsContent value="reports" className="flex-1 p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Reports & Analytics</h3>
          <p className="text-muted-foreground">View sales reports and analytics</p>
        </div>
      </TabsContent>
    </>
  );
}
