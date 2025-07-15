import { ToastError } from "@/components/toast/alerts";
import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "@/redux/reducers";

import {
  LIST_ITEMS_SUCCESS,
  ADD_ITEM_SUCCESS,
  REMOVE_ITEM_SUCCESS,
  CLEAR_CART_SUCCESS,
  UPDATE_ITEM_SUCCESS,
  UPDATE_ITEM_FAIL,
  SYNC_CART_SUCCESS,
  SYNC_CART_FAIL,
  REMOVE_ITEM_FAIL,
  ADD_ITEM_FAIL,
  CLEAR_CART_FAIL,
  LIST_ITEMS_FAIL,
} from "./types";

import {
  AddToCartAnonymousProps,
  AddToCartProps,
  CartItem,
  RemoveFromCartAnonymousProps,
  SyncCartPayload,
  UpdateCartItemAnonymousProps,
  UpdateCartItemProps,
} from "./interfaces";
import { addToWishlistAnonymous } from "../wishlist/actions";
import { AddToWishlistAnonymousProps, MoveToWishlistProps } from "../wishlist/interfaces";
import { ADD_WISHLIST_ITEM_FAIL, ADD_WISHLIST_ITEM_SUCCESS } from "../wishlist/types";

type Attribution = Pick<
  CartItem,
  "content_type" | "object_id" | "size" | "weight" | "material" | "color" | "flavor"
>;

// Helper que construye una “clave” única a partir de los IDs de los atributos
const makeKey = (a: Attribution) =>
  [
    a.content_type,
    a.object_id,
    a.size?.id ?? "", // si size es null/undefined, cadena vacía
    a.weight?.id ?? "",
    a.material?.id ?? "",
    a.color?.id ?? "",
    a.flavor?.id ?? "",
  ].join("|");

export const listCart = () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
  try {
    const response = await fetch("/api/cart/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    dispatch({
      type: LIST_ITEMS_SUCCESS,
      payload: { cart: data?.results.items, totalItems: data?.results.total_items },
    });
  } catch (e) {
    dispatch({
      type: LIST_ITEMS_FAIL,
      error: e.message || "Error al enlistasr carrito",
    });
    ToastError(`Error enlistando items del carrito: ${e.message || e}`);
  }
};

export const addToCartAnonymous =
  (props: AddToCartAnonymousProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Cargo carrito
    const raw = localStorage.getItem("cart");
    const cart: CartItem[] = raw ? JSON.parse(raw) : [];

    // 2) Busco index comparando sólo keys
    const newKey = makeKey(props);
    const existingIndex = cart.findIndex(ci => makeKey(ci) === newKey);

    let updatedCart: CartItem[];
    if (existingIndex !== -1) {
      // 2a) Incremento count
      updatedCart = cart.map((ci, idx) =>
        idx === existingIndex ? { ...ci, count: ci.count + props.count } : ci,
      );
    } else {
      // 2b) Agrego nuevo
      updatedCart = [
        ...cart,
        {
          content_type: props.content_type,
          object_id: props.object_id,
          item: props.item,
          count: props.count,
          size: props.size,
          weight: props.weight,
          material: props.material,
          color: props.color,
          flavor: props.flavor,
        },
      ];
    }

    // 3) Guardo y despacho
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    const totalItems = updatedCart.reduce((s, x) => s + x.count, 0);
    dispatch({
      type: ADD_ITEM_SUCCESS,
      payload: { cart: updatedCart, totalItems },
    });

    // 5) Recalcular totales
    // dispatchCalculateTotal(dispatch, updatedCart);
  };

export const clearCartAnonymous =
  () => (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 2.1) Elimina el carrito almacenado en localStorage
    localStorage.removeItem("cart");

    // 2.2) Despacha la acción para limpiar el estado del carrito
    dispatch({ type: CLEAR_CART_SUCCESS });

    // 2.3) Recalcula totales (pasa un array vacío para que subtotal, totalItems, etc. queden en cero)
    // dispatchCalculateTotal(dispatch, []);
  };

export const removeFromCartAnonymous =
  (props: RemoveFromCartAnonymousProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Cargo carrito
    const raw = localStorage.getItem("cart");
    const cart: CartItem[] = raw ? JSON.parse(raw) : [];

    // 2) Genero key y busco índice
    const key = makeKey(props);
    let updatedCart: CartItem[];

    if (typeof props.count === "number") {
      // 2a) Solo decremento esa cantidad en el primer match
      const idx = cart.findIndex(ci => makeKey(ci) === key);
      if (idx !== -1) {
        updatedCart = cart
          .map((ci, i) => {
            if (i !== idx) return ci;
            const newCount = ci.count - props.count!;
            return newCount > 0 ? { ...ci, count: newCount } : null;
          })
          .filter((ci): ci is CartItem => ci !== null);
      } else {
        // no existe el ítem, no hago cambios
        updatedCart = cart;
      }
    } else {
      // 2b) Elimino **todos** los ítems cuya key coincide
      updatedCart = cart.filter(ci => makeKey(ci) !== key);
    }

    // 3) Guardo en localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // 4) Despacho acción con carrito y total de ítems
    const totalItems = updatedCart.reduce((sum, ci) => sum + ci.count, 0);
    dispatch({
      type: REMOVE_ITEM_SUCCESS,
      payload: { cart: updatedCart, totalItems },
    });

    // 5) (Opcional) Recalcular totales
    // dispatchCalculateTotal(dispatch, updatedCart);
  };

export const updateCartItemAnonymous =
  (props: UpdateCartItemAnonymousProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Cargo el carrito
    const raw = localStorage.getItem("cart");
    const cart: CartItem[] = raw ? JSON.parse(raw) : [];

    // 2) Recorro y en el índice que me piden aplico las actualizaciones
    const updatedCart = cart.map((ci, idx) => {
      if (idx !== props.index) return ci;
      // Aquí aplico sólo los campos que vengan en props.updates
      return {
        ...ci,
        count: props.updates.count !== undefined ? props.updates.count : ci.count,
        size: props.updates.size !== undefined ? props.updates.size : ci.size,
        weight: props.updates.weight !== undefined ? props.updates.weight : ci.weight,
        material: props.updates.material !== undefined ? props.updates.material : ci.material,
        color: props.updates.color !== undefined ? props.updates.color : ci.color,
        flavor: props.updates.flavor !== undefined ? props.updates.flavor : ci.flavor,
      };
    });

    // 3) Guardo en localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // 4) Despacho acción para el reducer
    const totalItems = updatedCart.reduce((sum, x) => sum + x.count, 0);
    dispatch({
      type: UPDATE_ITEM_SUCCESS,
      payload: { cart: updatedCart, totalItems },
    });

    // 5) (Opcional) Recalcular totales
    // dispatchCalculateTotal(dispatch, updatedCart);
  };

export const moveCartToWishlistAnonymous =
  (props: AddToWishlistAnonymousProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Eliminar del carrito
    await dispatch(removeFromCartAnonymous(props));

    // 2) Agregar al wishlist
    dispatch(
      addToWishlistAnonymous({
        item: props.item,
        content_type: props.content_type,
        object_id: props.object_id,
        count: props.count,
        size: props.size,
        weight: props.weight,
        material: props.material,
        color: props.color,
        flavor: props.flavor,
      }),
    );
  };

export const moveCartToWishlist =
  (props: MoveToWishlistProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/cart/move_to_wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      await dispatch(listCart());
      dispatch({
        type: ADD_WISHLIST_ITEM_SUCCESS,
        payload: { wishlist: data?.results.items, totalItems: data?.results.items.length },
      });
    } catch (e: any) {
      dispatch({
        type: ADD_WISHLIST_ITEM_FAIL,
        error: e.message || "Error al mover al wishlist",
      });
      ToastError(`Error moviendo al wishlist: ${e.message || e}`);
    }
  };

export const syncCart =
  (payload: SyncCartPayload) => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: SYNC_CART_SUCCESS,
        payload: { cart: data?.results.items, totalItems: data?.results.total_items },
      });
    } catch (e: any) {
      dispatch({
        type: SYNC_CART_FAIL,
        error: e.message || "Error al sincronizar el carrito",
      });
      ToastError(`Error sincronizando carrito: ${e.message || e}`);
    }
  };

export const removeFromCart =
  (cartItemId: string | null) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/cart/remove_item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_item_id: cartItemId }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      dispatch({
        type: REMOVE_ITEM_SUCCESS,
        payload: {
          cart: data?.results.items,
          totalItems: data?.results.total_items,
        },
      });
    } catch (err: any) {
      dispatch({
        type: REMOVE_ITEM_FAIL,
        error: err.message || "Error al eliminar item del carrito",
      });
      ToastError(`Error eliminating cart item: ${err.message || err}`);
    }
  };

export const addToCart =
  (props: AddToCartProps) => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    const body: Record<string, unknown> = {};
    Object.entries(props).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body[key] = value;
      }
    });
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      dispatch({
        type: ADD_ITEM_SUCCESS,
        payload: {
          cart: data?.results.items,
          totalItems: data?.results.total_items,
        },
      });
    } catch (err: any) {
      dispatch({
        type: ADD_ITEM_FAIL,
        error: err.message || "Error al agregar item al carrito",
      });
      ToastError(`Error agregando al carrito: ${err.message || err}`);
    }
  };

export const clearCart = () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
  try {
    const response = await fetch("/api/cart/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    localStorage.removeItem("cart");

    dispatch({ type: CLEAR_CART_SUCCESS });
  } catch (err) {
    dispatch({
      type: CLEAR_CART_FAIL,
      error: err.message || "Error al eliminar el carrito",
    });
    ToastError(`Error eliminando el carrito: ${err.message || err}`);
  }
};

export const updateCartItem =
  (props: UpdateCartItemProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_item_id: props.cart_item_id, count: props.count }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      dispatch({
        type: UPDATE_ITEM_SUCCESS,
        payload: {
          cart: data?.results.items,
          totalItems: data?.results.total_items,
        },
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_ITEM_FAIL,
        error: err.message || "Error al actualizar item del carrito",
      });
      ToastError(`Error updating cart item: ${err.message || err}`);
    }
  };
