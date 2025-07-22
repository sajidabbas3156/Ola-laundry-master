
import { ServiceSelectionDialog } from "@/components/pos/ServiceSelectionDialog";
import { useLocalization } from "@/contexts/LocalizationContext";

interface ServiceDialogWrapperProps {
  showServiceDialog: boolean;
  setShowServiceDialog: (show: boolean) => void;
  selectedItem: any;
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  onAddToCartWithService: () => void;
}

export function ServiceDialogWrapper({
  showServiceDialog,
  setShowServiceDialog,
  selectedItem,
  selectedServiceId,
  setSelectedServiceId,
  onAddToCartWithService
}: ServiceDialogWrapperProps) {
  const { formatCurrency } = useLocalization();

  return (
    <ServiceSelectionDialog 
      showServiceDialog={showServiceDialog}
      setShowServiceDialog={setShowServiceDialog}
      selectedItem={selectedItem}
      selectedServiceId={selectedServiceId}
      setSelectedServiceId={setSelectedServiceId}
      onAddToCartWithService={onAddToCartWithService}
    />
  );
}
