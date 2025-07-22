
import { useState } from "react";

export function useStorefrontCustomerForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState("pickup");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setPickupDate("");
    setPickupTime("");
    setDeliveryPreference("pickup");
    setNotes("");
  };

  const validateForm = () => {
    return customerName && customerPhone && pickupDate && pickupTime;
  };

  return {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    pickupTime,
    setPickupTime,
    pickupDate,
    setPickupDate,
    deliveryPreference,
    setDeliveryPreference,
    notes,
    setNotes,
    resetForm,
    validateForm
  };
}
