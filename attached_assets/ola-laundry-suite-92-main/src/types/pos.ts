
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  service?: {
    id: string;
    name: string;
  };
}
