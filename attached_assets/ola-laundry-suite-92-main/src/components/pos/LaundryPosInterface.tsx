
import { useTenant } from "@/contexts/TenantContext";
import { useCustomers } from "@/contexts/CustomerContext";
import { useInventory } from "@/contexts/InventoryContext";
import { usePosLogic } from "@/hooks/usePosLogic";
import { ModernPosInterface } from "./ModernPosInterface";

export function LaundryPosInterface() {
  const { currentTenant } = useTenant();
  const { getCustomersByTenant } = useCustomers();
  const { inventory } = useInventory();

  console.log("LaundryPosInterface - Current tenant:", currentTenant);
  console.log("LaundryPosInterface - Inventory items:", inventory?.length || 0);

  const {
    cart,
    availableItems,
    categories,
    formatCurrency,
    handleAddToCart,
    handleUpdateCart,
    handleRemoveFromCart,
    clearCart
  } = usePosLogic(
    inventory,
    getCustomersByTenant,
    currentTenant?.id
  );

  console.log("LaundryPosInterface - Available items:", availableItems?.length || 0);
  console.log("LaundryPosInterface - Categories:", categories);
  console.log("LaundryPosInterface - Cart items:", cart?.length || 0);

  // Create a wrapper function that matches the expected signature
  const handleCartUpdate = (updatedCart: any[]) => {
    console.log("LaundryPosInterface - Cart updated:", updatedCart?.length || 0);
    // This is handled internally by usePosLogic, so we don't need to do anything here
    // The cart state is managed by the hook
  };

  return (
    <ModernPosInterface
      availableItems={availableItems}
      categories={categories}
      cart={cart}
      onAddToCart={handleAddToCart}
      onUpdateCart={handleCartUpdate}
      onRemoveFromCart={handleRemoveFromCart}
      formatCurrency={formatCurrency}
    />
  );
}
