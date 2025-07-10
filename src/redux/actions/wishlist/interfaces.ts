/** Propiedades para añadir un ítem al wishlist */
export interface AddToWishlistProps {
  item_id: string | undefined;
  item_type: string;
  count: number;
  size?: string | null;
  weight?: string | null;
  material?: string | null;
  color?: string | null;
  flavor?: string | null;
}

/** Propiedades para eliminar (o restar) una cantidad de un ítem */
export interface RemoveFromWishlistProps {
  item_id: string;
  item_type: string;
  remove_count?: number;
}

/** Un ítem ya presente en el wishlist */
export interface WishlistItem extends AddToWishlistProps {}

/** Payload para sincronizar el wishlist completo */
export interface SyncWishlistProps {
  items: WishlistItem[];
}
