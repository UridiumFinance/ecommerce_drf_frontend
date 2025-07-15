import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "@/redux/reducers";

import {
  ADD_WISHLIST_ITEM_SUCCESS,
  EMPTY_WISHLIST_SUCCESS,
  REMOVE_WISHLIST_ITEM_SUCCESS,
  UPDATE_WISHLIST_ITEM_SUCCESS,
  LIST_WISHLIST_ITEMS_SUCCESS,
  LIST_WISHLIST_ITEMS_FAIL,
  REMOVE_WISHLIST_ITEM_FAIL,
  ADD_WISHLIST_ITEM_FAIL,
  UPDATE_WISHLIST_ITEM_FAIL,
  EMPTY_WISHLIST_FAIL,
  SYNC_WISHLIST_SUCCESS,
  SYNC_WISHLIST_FAIL,
} from "./types";
import {
  AddToWishlistAnonymousProps,
  AddToWishlistProps,
  MoveToCartProps,
  RemoveFromWishlistAnonymousProps,
  SyncWishlistPayload,
  UpdateWishlistItemAnonymousProps,
  UpdateWishlistItemProps,
  WishlistItem,
} from "./interfaces";
import { addToCartAnonymous } from "../cart/actions";
import { ToastError } from "@/components/toast/alerts";
import { LIST_ITEMS_FAIL, LIST_ITEMS_SUCCESS } from "../cart/types";

type Attribution = Pick<
  WishlistItem,
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

export const listWishlist =
  () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/wishlist/list", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      dispatch({
        type: LIST_WISHLIST_ITEMS_SUCCESS,
        payload: { wishlist: data?.results.items, totalItems: data?.results.items.length },
      });
    } catch (e) {
      dispatch({
        type: LIST_WISHLIST_ITEMS_FAIL,
        error: e.message || "Error al enlistasr wishlist",
      });
      ToastError(`Error enlistando items del wishlist: ${e.message || e}`);
    }
  };

export const addToWishlistAnonymous =
  (props: AddToWishlistAnonymousProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Cargo wishlist
    const raw = localStorage.getItem("wishlist");
    const wishlist: WishlistItem[] = raw ? JSON.parse(raw) : [];

    // 2) Busco index comparando sólo keys...
    const newKey = makeKey(props);
    const existingIndex = wishlist.findIndex(wi => makeKey(wi) === newKey);

    let updatedWishlist: WishlistItem[];
    if (existingIndex !== -1) {
      // Incremento count
      updatedWishlist = wishlist.map((wi, idx) =>
        idx === existingIndex ? { ...wi, count: wi.count + props.count } : wi,
      );
    } else {
      // Agrego nuevo
      updatedWishlist = [
        ...wishlist,
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

    // 3) **Guardo en la clave correcta**: "wishlist"
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // 4) Dispatch para actualizar el estado de redux
    const totalItems = updatedWishlist.reduce((s, x) => s + x.count, 0);
    dispatch({
      type: ADD_WISHLIST_ITEM_SUCCESS,
      payload: { wishlist: updatedWishlist, totalItems },
    });
  };

export const removeFromWishlistAnonymous =
  (props: RemoveFromWishlistAnonymousProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Cargo carrito
    const raw = localStorage.getItem("wishlist");
    const wishlist: WishlistItem[] = raw ? JSON.parse(raw) : [];

    // 2) Genero key y busco índice
    const key = makeKey(props);
    let updatedWishlist: WishlistItem[];

    if (typeof props.count === "number") {
      // 2a) Solo decremento esa cantidad en el primer match
      const idx = wishlist.findIndex(wi => makeKey(wi) === key);
      if (idx !== -1) {
        updatedWishlist = wishlist
          .map((wi, i) => {
            if (i !== idx) return wi;
            const newCount = wi.count - props.count!;
            return newCount > 0 ? { ...wi, count: newCount } : null;
          })
          .filter((wi): wi is WishlistItem => wi !== null);
      } else {
        // no existe el ítem, no hago cambios
        updatedWishlist = wishlist;
      }
    } else {
      // 2b) Elimino **todos** los ítems cuya key coincide
      updatedWishlist = wishlist.filter(wi => makeKey(wi) !== key);
    }

    // 3) Guardo en localStorage
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // 4) Despacho acción con carrito y total de ítems
    const totalItems = updatedWishlist.reduce((sum, ci) => sum + ci.count, 0);
    dispatch({
      type: REMOVE_WISHLIST_ITEM_SUCCESS,
      payload: { wishlist: updatedWishlist, totalItems },
    });
  };

export const updateWishlistItemAnonymous =
  (props: UpdateWishlistItemAnonymousProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    const raw = localStorage.getItem("wishlist");
    const wishlist: WishlistItem[] = raw ? JSON.parse(raw) : [];

    const updatedWishlist = wishlist.map((wi, idx) =>
      idx !== props.index ? wi : { ...wi, ...props.updates },
    );

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    const totalItems = updatedWishlist.reduce((s, wi) => s + wi.count, 0);
    dispatch({
      type: UPDATE_WISHLIST_ITEM_SUCCESS,
      payload: { wishlist: updatedWishlist, totalItems },
    });
  };

export const moveWishlistToCartAnonymous =
  (props: AddToWishlistAnonymousProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Eliminar del wishlist
    await dispatch(removeFromWishlistAnonymous(props));

    // 2) Agregar al carrito
    dispatch(
      addToCartAnonymous({
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

export const moveWishlistToCart =
  (props: MoveToCartProps) => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/wishlist/move_to_cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      await dispatch(listWishlist());
      dispatch({
        type: LIST_ITEMS_SUCCESS,
        payload: { cart: data?.results.items, totalItems: data?.results.items.length },
      });
    } catch (e: any) {
      dispatch({
        type: LIST_ITEMS_FAIL,
        error: e.message || "Error al mover al carrito",
      });
      ToastError(`Error moviendo al carrito: ${e.message || e}`);
    }
  };

export const clearWishlistAnonymous =
  () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Elimino la clave "wishlist" de localStorage
    localStorage.removeItem("wishlist");

    // 2) Preparo el carrito vacío
    const emptyWishlist: never[] = [];
    const totalItems = 0;

    // 3) Disparo el action con carrito vacío
    dispatch({
      type: EMPTY_WISHLIST_SUCCESS,
      payload: {
        wishlist: emptyWishlist,
        totalItems,
      },
    });
  };

export const removeFromWishlist =
  ({ wishlistItemId }: { wishlistItemId: string }) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/wishlist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlistItemId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      dispatch({
        type: REMOVE_WISHLIST_ITEM_SUCCESS,
        payload: { wishlist: data?.results.items, totalItems: data?.results.items.length },
      });
    } catch (e: any) {
      dispatch({
        type: REMOVE_WISHLIST_ITEM_FAIL,
        error: e.message || "Error al remover wishlist item",
      });
      ToastError(`Error removiendo wishlist item: ${e.message || e}`);
    }
  };

export const addToWishlist =
  (props: AddToWishlistProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    const body: Record<string, unknown> = {};
    Object.entries(props).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body[key] = value;
      }
    });
    try {
      const response = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      dispatch({
        type: ADD_WISHLIST_ITEM_SUCCESS,
        payload: {
          wishlist: data?.results.items,
          totalItems: data?.results.total_items,
        },
      });
    } catch (err: any) {
      dispatch({
        type: ADD_WISHLIST_ITEM_FAIL,
        error: err.message || "Error al agregar item al wishlist",
      });
      ToastError(`Error agregando al wishlist: ${err.message || err}`);
    }
  };

export const updateWishlistItem =
  (props: UpdateWishlistItemProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/wishlist/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlistItemId: props.wishlistItemId, count: props.count }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      dispatch({
        type: UPDATE_WISHLIST_ITEM_SUCCESS,
        payload: {
          wishlist: data?.results.items,
          totalItems: data?.results.items.length,
        },
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_WISHLIST_ITEM_FAIL,
        error: err.message || "Error al actualizar item del wishlist",
      });
      ToastError(`Error updating wishlist item: ${err.message || err}`);
    }
  };

export const clearWishlist =
  () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/wishlist/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      localStorage.removeItem("wishlist");

      dispatch({ type: EMPTY_WISHLIST_SUCCESS });
    } catch (err) {
      dispatch({
        type: EMPTY_WISHLIST_FAIL,
        error: err.message || "Error al eliminar el wishlist",
      });
      ToastError(`Error eliminando el wishlist: ${err.message || err}`);
    }
  };

export const syncWishlist =
  (payload: SyncWishlistPayload) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    try {
      const response = await fetch("/api/wishlist/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      dispatch({
        type: SYNC_WISHLIST_SUCCESS,
        payload: { wishlist: data?.results.items, totalItems: data?.results.items.length },
      });
    } catch (e: any) {
      dispatch({
        type: SYNC_WISHLIST_FAIL,
        error: e.message || "Error al sincronizar el wishlist",
      });
      ToastError(`Error sincronizando wishlist: ${e.message || e}`);
    }
  };
