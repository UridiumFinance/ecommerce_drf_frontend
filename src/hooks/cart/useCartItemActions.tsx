import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "@/redux/reducers";
import { UnknownAction } from "redux";
import {
  removeFromCartAnonymous,
  updateCartItemAnonymous,
  moveCartToWishlistAnonymous,
  removeFromCart,
  updateCartItem,
  moveCartToWishlist,
} from "@/redux/actions/cart/actions";
import {
  removeFromWishlistAnonymous,
  updateWishlistItemAnonymous,
  moveWishlistToCartAnonymous,
  moveWishlistToCart,
  removeFromWishlist,
  updateWishlistItem,
} from "@/redux/actions/wishlist/actions";
import { ToastError, ToastWarning } from "@/components/toast/alerts";
import IProduct from "@/interfaces/products/IProduct";
import ISize from "@/interfaces/products/ISize";
import IWeight from "@/interfaces/products/IWeight";
import IMaterial from "@/interfaces/products/IMaterial";
import IColor from "@/interfaces/products/IColor";
import IFlavor from "@/interfaces/products/IFlavor";

export interface UseItemActionsProps {
  wishlistItemId: string | null;
  cartItemId: string | null;
  index: number;
  product: IProduct;
  count: number;
  size?: ISize | null;
  weight?: IWeight | null;
  material?: IMaterial | null;
  color?: IColor | null;
  flavor?: IFlavor | null;
  isWishlist?: boolean;
}

export function useItemActions({
  wishlistItemId,
  cartItemId,
  index,
  product,
  count,
  size = null,
  weight = null,
  material = null,
  color = null,
  flavor = null,
  isWishlist = false,
}: UseItemActionsProps) {
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [loadingRemove, setLoadingRemove] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingMove, setLoadingMove] = useState(false);

  const commonProps = {
    object_id: product.id,
    content_type: "product" as const,
    count,
    size,
    weight,
    material,
    color,
    flavor,
  };

  const onRemove = async () => {
    if (isAuthenticated) {
      try {
        setLoadingRemove(true);
        if (isWishlist) {
          await dispatch(removeFromWishlist({ wishlistItemId }));
        } else {
          await dispatch(removeFromCart(cartItemId));
        }
      } catch (e) {
        ToastError(`Error removing item: ${e}`);
      } finally {
        setLoadingRemove(false);
      }
      return;
    }
    try {
      setLoadingRemove(true);
      if (isWishlist) {
        await dispatch(removeFromWishlistAnonymous(commonProps));
      } else {
        await dispatch(removeFromCartAnonymous(commonProps));
      }
    } catch (e) {
      ToastError(`Error removing item: ${e}`);
    } finally {
      setLoadingRemove(false);
    }
  };

  const onUpdateCount = async (newCount: number) => {
    if (isAuthenticated) {
      try {
        setLoadingUpdate(true);
        if (isWishlist) {
          await dispatch(
            updateWishlistItem({
              count: newCount,
              wishlistItemId: wishlistItemId || "",
            }),
          );
        } else {
          await dispatch(
            updateCartItem({
              count: newCount,
              cart_item_id: cartItemId || "",
            }),
          );
        }
      } catch (e) {
        ToastError(`Error updating count: ${e}`);
      } finally {
        setLoadingUpdate(false);
      }
      return;
    }
    try {
      setLoadingUpdate(true);
      if (isWishlist) {
        await dispatch(updateWishlistItemAnonymous({ index, updates: { count: newCount } }));
      } else {
        await dispatch(updateCartItemAnonymous({ index, updates: { count: newCount } }));
      }
    } catch (e) {
      ToastError(`Error updating count: ${e}`);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const onMove = async () => {
    if (isAuthenticated) {
      try {
        setLoadingMove(true);
        if (isWishlist) {
          await dispatch(
            moveWishlistToCart({
              wishlistItemId,
            }),
          );
        } else {
          // move from cart to wishlist
          await dispatch(
            moveCartToWishlist({
              cartItemId,
            }),
          );
        }
      } catch (e) {
        ToastError(`Error moving item: ${e}`);
      } finally {
        setLoadingMove(false);
      }
      return;
    }
    try {
      setLoadingMove(true);
      if (isWishlist) {
        // move from wishlist to cart
        await dispatch(
          moveWishlistToCartAnonymous({
            item: product,
            content_type: "product",
            object_id: product.id,
            count,
            size,
            weight,
            material,
            color,
            flavor,
          }),
        );
      } else {
        // move from cart to wishlist
        await dispatch(
          moveCartToWishlistAnonymous({
            item: product,
            content_type: "product",
            object_id: product.id,
            count,
            size,
            weight,
            material,
            color,
            flavor,
          }),
        );
      }
    } catch (e) {
      ToastError(`Error moving item: ${e}`);
    } finally {
      setLoadingMove(false);
    }
  };

  return {
    loadingRemove,
    loadingUpdate,
    loadingMove,
    onRemove,
    onUpdateCount,
    onMove,
  };
}

// Usage in a component:
// const {
//   loadingRemove,
//   loadingUpdate,
//   loadingMove,
//   onRemove,
//   onUpdateCount,
//   onMove,
// } = useItemActions({ index, product, count, size, weight, material, color, flavor, isWishlist });
