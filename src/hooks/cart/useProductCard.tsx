import { useMemo } from "react";
import useProductPrice from "@/hooks/useProductPrice";
import { useItemActions } from "@/hooks/cart/useCartItemActions";
import IColor from "@/interfaces/products/IColor";
import IFlavor from "@/interfaces/products/IFlavor";
import IMaterial from "@/interfaces/products/IMaterial";
import ISize from "@/interfaces/products/ISize";
import IWeight from "@/interfaces/products/IWeight";
import { IProductList } from "@/interfaces/products/IProduct";

export interface UseProductCardProps {
  wishlistItemId: string | null;
  cartItemId: string | null;
  index?: number;
  product: IProductList;
  count?: number;
  size?: ISize | null;
  weight?: IWeight | null;
  material?: IMaterial | null;
  color?: IColor | null;
  flavor?: IFlavor | null;
  isWishlist?: boolean;
}

/**
 * Custom hook to encapsulate common product card logic:
 * - Title truncation (desktop & mobile)
 * - Price retrieval & discount state
 * - Maximum stock calculation
 * - Cart/Wishlist actions
 */
export default function useProductCard({
  wishlistItemId,
  cartItemId,
  index,
  product,
  count = 1,
  size = null,
  weight = null,
  material = null,
  color = null,
  flavor = null,
  isWishlist = false,
}: UseProductCardProps) {
  // Title truncation
  const title = product.title || "";
  const truncatedTitle = useMemo(
    () => (title.length > 120 ? `${title.slice(0, 120)}…` : title),
    [title],
  );
  const truncatedTitleMobile = useMemo(
    () => (title.length > 69 ? `${title.slice(0, 69)}…` : title),
    [title],
  );

  // Price & discount
  const {
    originalPrice,
    salePrice,
    isDiscountActive,
    loading: loadingPrice,
  } = useProductPrice({
    slug: product.slug,
    colorId: color?.id,
    sizeId: size?.id,
    materialId: material?.id,
    weightId: weight?.id,
    flavorId: flavor?.id,
  });

  // Calculate max selectable count based on attribute stocks
  const maxCount = useMemo(() => {
    const stocks = [size, weight, material, color, flavor]
      .map(v => v?.stock)
      .filter((s): s is number => typeof s === "number");
    return stocks.length > 0 ? Math.min(...stocks) : (product.stock ?? 1);
  }, [size?.stock, weight?.stock, material?.stock, color?.stock, flavor?.stock, product.stock]);

  // Cart / Wishlist actions
  const { loadingRemove, loadingUpdate, loadingMove, onRemove, onUpdateCount, onMove } =
    useItemActions({
      wishlistItemId,
      cartItemId,
      index,
      product,
      count,
      size,
      weight,
      material,
      color,
      flavor,
      isWishlist,
    });

  return {
    truncatedTitle,
    truncatedTitleMobile,
    originalPrice,
    salePrice,
    isDiscountActive,
    loadingPrice,
    maxCount,
    loadingRemove,
    loadingUpdate,
    loadingMove,
    onRemove,
    onUpdateCount,
    onMove,
  };
}

// Usage example:
// import useProductCard from '@/hooks/useProductCard';
//
// function ProductCartItem(props: UseProductCardProps) {
//   const {
//     truncatedTitle,
//     truncatedTitleMobile,
//     originalPrice,
//     salePrice,
//     isDiscountActive,
//     loadingPrice,
//     maxCount,
//     onRemove,
//     onUpdateCount,
//   } = useProductCard(props);
//
//   return (
//     <div>
//       <h3>{truncatedTitle}</h3>
//       {loadingPrice ? <LoadingMoon /> : (
//         isDiscountActive ? (
//           <div>
//             <span className="line-through">${originalPrice?.toFixed(2)}</span>
//             <span>${salePrice?.toFixed(2)}</span>
//           </div>
//         ) : (
//           <span>${salePrice?.toFixed(2)}</span>
//         )
//       )}
//       {/* Otros elementos usando maxCount, onRemove, onUpdateCount, etc. */}
//     </div>
//   );
// }
