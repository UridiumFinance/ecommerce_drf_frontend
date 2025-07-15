import IColor from "@/interfaces/products/IColor";
import IFlavor from "@/interfaces/products/IFlavor";
import IMaterial from "@/interfaces/products/IMaterial";
import IProduct from "@/interfaces/products/IProduct";
import ISize from "@/interfaces/products/ISize";
import IWeight from "@/interfaces/products/IWeight";

// -----------------------------------------------------------------------------
// Interfaces para Tipos del Wishlist
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
export interface WishlistItem {
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
 * Respuesta completa del carrito
 */
export interface WishlistResponse {
  id: string;
  user: string;
  items: WishlistItem[];
  total_items: number;
}

export interface AddToWishlistAnonymousProps {
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

export interface MoveToWishlistProps {
  cartItemId: string | null;
}

export interface MoveToCartProps {
  wishlistItemId: string | null;
}

export interface RemoveFromWishlistAnonymousProps {
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

export interface UpdateWishlistItemAnonymousProps {
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

export interface MoveWishlistToCartAnonymousProps
  extends Omit<RemoveFromWishlistAnonymousProps, "count"> {}

export interface AddToWishlistProps {
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

export interface UpdateWishlistItemProps {
  /** ID del ítem en el carrito en el backend */
  wishlistItemId: string;
  /** Nueva cantidad (opcional) */
  count?: number;
  /** Nuevos IDs de variantes (opcionales) */
  size_id?: string | null;
  weight_id?: string | null;
  material_id?: string | null;
  color_id?: string | null;
  flavor_id?: string | null;
}

export interface SyncWishlistItem {
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
export interface SyncWishlistPayload {
  items: SyncWishlistItem[];
}
