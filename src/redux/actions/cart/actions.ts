import { ToastError, ToastSuccess } from "@/components/toast/alerts";
import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "@/redux/reducers";

import {
  ADD_ITEM_SUCCESS,
  REMOVE_ITEM_SUCCESS,
  CLEAR_CART_SUCCESS,
  UPDATE_ITEM_SUCCESS,
  UPDATE_ITEM_FAIL,
  GET_TOTAL_SUCCESS,
  GET_TOTAL_FAIL,
  SYNC_CART_SUCCESS,
  SYNC_CART_FAIL,
  REMOVE_ITEM_FAIL,
  ADD_ITEM_FAIL,
  CLEAR_CART_FAIL,
} from "./types";
import {
  AddToCartProps,
  CartItem,
  RemoveFromCartProps,
  SyncCartProps,
  UpdateCartItemProps,
} from "./interfaces";
import { addToWishlistAnonymous } from "../wishlist/actions";

export const calculateCartTotal =
  (items: CartItem[]) => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

const dispatchCalculateTotal = (
  dispatch: ThunkDispatch<RootState, void, UnknownAction>,
  items: CartItem[],
): void => {
  dispatch(calculateCartTotal(items));
};

export interface CartItemAnon {
  item_id: string;
  item_type: string;
  count: number;
  size?: string | null;
  weight?: string | null;
  material?: string | null;
  color?: string | null;
  flavor?: string | null;
}

export const syncCart = () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const addToCart =
  (props: AddToCartProps) => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const addToCartAnonymous =
  (props: AddToCartProps) => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Cargo el carrito desde localStorage
    const raw = localStorage.getItem("cart");
    const cart: AddToCartProps[] = raw ? JSON.parse(raw) : [];

    // 2) Campos opcionales que definen unicidad además de item_id y item_type
    const optionalFields: Array<keyof Omit<AddToCartProps, "item_id" | "item_type" | "count">> = [
      "size",
      "weight",
      "material",
      "color",
      "flavor",
    ];

    // 3) Busco un ítem idéntico
    const index = cart.findIndex(ci => {
      if (ci.item_id !== props.item_id || ci.item_type !== props.item_type) {
        return false;
      }
      return optionalFields.every(f => ci[f] === props[f]);
    });

    // 4) Si no existe, agrego; si existe, sumo la cantidad
    let updatedCart: AddToCartProps[];
    if (index === -1) {
      updatedCart = [...cart, props];
    } else {
      updatedCart = cart.map((ci, i) =>
        i === index ? { ...ci, count: (ci.count || 0) + props.count } : ci,
      );
    }

    // 5) Guardo en localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // 6) Dispatcher del éxito y recálculo de totales
    dispatch({
      type: ADD_ITEM_SUCCESS,
      payload: {
        cart: updatedCart,
        totalItems: updatedCart.length,
      },
    });
    dispatchCalculateTotal(dispatch, updatedCart);
  };

export const removeFromCart =
  (props: RemoveFromCartProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const removeFromCartAnonymous =
  (props: RemoveFromCartProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const moveCartToWishlistAnonymous =
  () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const updateCartItem =
  (props: UpdateCartItemProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const updateCartItemAnonymous =
  (props: UpdateCartItemProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const clearCartAnonymous =
  () => (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 2.1) Elimina el carrito almacenado en localStorage
    localStorage.removeItem("cart");

    // 2.2) Despacha la acción para limpiar el estado del carrito
    dispatch({ type: CLEAR_CART_SUCCESS });

    // 2.3) Recalcula totales (pasa un array vacío para que subtotal, totalItems, etc. queden en cero)
    dispatchCalculateTotal(dispatch, []);
  };

export const clearCart =
  () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};
