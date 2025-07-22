import { useQuery } from "@tanstack/react-query";
import { Customer, User } from "@shared/schema";

export function useCustomers() {
  const { data: customers = [], isLoading } = useQuery<(Customer & { user: User })[]>({
    queryKey: ["/api/customers"],
  });

  return {
    customers,
    isLoading,
  };
}
