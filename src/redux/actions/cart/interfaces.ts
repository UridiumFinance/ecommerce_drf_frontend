import IColor from "@/interfaces/products/IColor";
import IFlavor from "@/interfaces/products/IFlavor";
import IMaterial from "@/interfaces/products/IMaterial";
import ISize from "@/interfaces/products/ISize";
import IWeight from "@/interfaces/products/IWeight";

// -----------------------------------------------------------------------------
// Interfaces para Tipos del Carrito
// -----------------------------------------------------------------------------

/**
 * Variante de producto (size, color, etc.)
 */
export interface VariantOption {
  id: string;
  name: string;
}

/**
 * Ítem dentro del carrito
 */
export interface CartItem {
  id: string;
  content_type: "product" | "course";
  object_id: string;
  count: number;

  size?: VariantOption;
  weight?: VariantOption;
  material?: VariantOption;
  color?: VariantOption;
  flavor?: VariantOption;

  unit_price: string; // Precio unitario formateado ("0.00")
  discount_amount: string; // Descuento aplicado al ítem
  total_price: string; // Precio total tras descuento
}

/**
 * Dirección de envío asociada al usuario
 */
export interface ShippingAddress {
  id: string;
  street?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country: string; // ISO2 ("PE", "US", ...)
}

/**
 * Método de envío disponible
 */
export interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  base_rate: string;
  per_kg_rate: string;
  min_delivery_days: number;
  max_delivery_days: number;
}

/**
 * Respuesta completa del carrito
 */
export interface CartResponse {
  id: string;
  user: string;

  items: CartItem[];
  total_items: number;

  subtotal: string;
  items_discount: string;
  cart_discount: string;
  discount_amount: string;
  tax_amount: string;
  delivery_fee: string;
  total: string;

  shipping_address: ShippingAddress | null;
  shipping_method: ShippingMethod | null;
  shipping_cost: string;
  coupon: string | null;
}
