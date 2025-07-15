import IColor from "@/interfaces/products/IColor";
import IFlavor from "@/interfaces/products/IFlavor";
import IMaterial from "@/interfaces/products/IMaterial";
import IProduct from "@/interfaces/products/IProduct";
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
  id?: string;
  item: IProduct | null;
  content_type: "product" | "course";
  object_id: string;
  count: number;
  size?: ISize | null;
  weight?: IWeight | null;
  material?: IMaterial | null;
  color?: IColor | null;
  flavor?: IFlavor | null;
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

export interface AddToCartAnonymousProps {
  item: IProduct | null;
  content_type: "product" | "course";
  object_id: string;
  count: number;
  size?: ISize | null;
  weight?: IWeight | null;
  material?: IMaterial | null;
  color?: IColor | null;
  flavor?: IFlavor | null;
}

export interface AddToCartProps {
  /** 'product' | 'course' */
  content_type: "product" | "course";
  /** ID del producto o curso */
  object_id: string;
  /** Cantidad a agregar */
  count: number;
  /** IDs de variantes (opcionales) */
  size_id?: string | null;
  weight_id?: string | null;
  material_id?: string | null;
  color_id?: string | null;
  flavor_id?: string | null;
  /** Código de cupón (opcional) */
  coupon_code?: string | null;
}

export interface RemoveFromCartAnonymousProps {
  content_type: "product" | "course";
  object_id: string;
  /** Si viene, decrementa esa cantidad; si no, elimina el ítem completo */
  count?: number;
  size?: ISize | null;
  weight?: IWeight | null;
  material?: IMaterial | null;
  color?: IColor | null;
  flavor?: IFlavor | null;
}

export interface UpdateCartItemAnonymousProps {
  index: number;
  updates: Partial<{
    count: number;
    size: ISize | null;
    weight: IWeight | null;
    material: IMaterial | null;
    color: IColor | null;
    flavor: IFlavor | null;
  }>;
}

export interface UpdateCartItemProps {
  /** ID del ítem en el carrito en el backend */
  cart_item_id: string;
  /** Nueva cantidad (opcional) */
  count?: number;
  /** Nuevos IDs de variantes (opcionales) */
  size_id?: string | null;
  weight_id?: string | null;
  material_id?: string | null;
  color_id?: string | null;
  flavor_id?: string | null;
}

export interface MoveCartToWishlistAnonymousProps
  extends Omit<RemoveFromCartAnonymousProps, "count"> {}

// 1. Define la interfaz para cada ítem del carrito
export interface CartItemProps {
  content_type: string;
  item_id: string;
  count: number;
  size_id?: string;
  weight_id?: string;
  material_id?: string;
  color_id?: string;
  flavor_id?: string;
}

// 2. Define la interfaz del request completo
export interface CartTotalRequest {
  items: CartItemProps[];
  coupon_code?: string;
  delivery_fee?: string;
}

// 3. (Opcional) Define la interfaz de la respuesta, si sabes su forma
export interface CartTotalResponse {
  subtotal_before: string;
  subtotal_after: string;
  item_discounts: string;
  global_discount: string;
  tax_amount: string;
  delivery_fee: string;
  total: string;
}

export interface SyncCartItem {
  /** 'product' | 'course' */
  content_type: "product" | "course";
  /** ID del producto o curso */
  item_id: string;
  /** Cantidad deseada */
  count: number;
  /** IDs de los atributos de variante (opcional) */
  size_id?: string | null;
  weight_id?: string | null;
  material_id?: string | null;
  color_id?: string | null;
  flavor_id?: string | null;
}

/**
 * Payload completo para la operación de sincronizar el carrito
 */
export interface SyncCartPayload {
  items: SyncCartItem[];
}
