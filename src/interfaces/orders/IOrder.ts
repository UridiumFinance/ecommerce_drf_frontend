import { IAddress } from "../addresses/IAddress";
import IProduct from "../products/IProduct";

export interface OrderItem {
  id: string;
  content_type: string;
  object_id: string;
  item_name: string;
  item: IProduct;
  unit_price: string;
  quantity: string;
  item_discount: string;
  total_price: string;
  size_title: string;
  weight_title: string;
  material_title: string;
  color_title: string;
  flavor_title: string;
}

export interface Order {
  id: string;
  user: string;
  shipping_address: IAddress;
  shipping_method: any;
  shipping_cost: string;
  coupon: any;
  subtotal: string;
  items_discount: string;
  global_discount: string;
  tax_amount: string;
  total: string;
  status: string;
  payment_reference: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}
