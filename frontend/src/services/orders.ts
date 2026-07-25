import axios from "@/app/Axios/Axios";

export interface PaymentDetails {
  method: string;
  credit_card_company: string;
  installments: number;
}

export interface Product {
  id: number;
  product_id: number;
  variant_id: number;
  name: string;
  quantity: number;
  price: string;
  barcode: string | null;
}

export interface Order {
  id: number;
  number: number;
  customer: {
    name: string;
  };
  total: string;
  created_at: string;
  owner_note: string | null;

  payment_details: PaymentDetails;

  products: Product[];
}

export async function getOrders(): Promise<Order[]> {
  const response = await axios.get("/orders");
  return response.data;
}