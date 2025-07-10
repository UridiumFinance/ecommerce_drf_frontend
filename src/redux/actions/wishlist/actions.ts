import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "@/redux/reducers";

import {
  ADD_WISHLIST_ITEM_SUCCESS,
  EMPTY_WISHLIST_SUCCESS,
  REMOVE_WISHLIST_ITEM_SUCCESS,
} from "./types";
import { AddToWishlistProps, RemoveFromWishlistProps } from "./interfaces";
import { addToCartAnonymous, calculateCartTotal } from "../cart/actions";

const dispatchCalculateTotal = (
  dispatch: ThunkDispatch<RootState, void, UnknownAction>,
  items: CartItem[],
): void => {
  dispatch(calculateCartTotal(items));
};

export const addToWishlist =
  (props: AddToWishlistProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const addToWishlistAnonymous =
  (props: AddToWishlistProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Cargo el carrito desde localStorage
    const raw = localStorage.getItem("wishlist");
    const wishlist: AddToWishlistProps[] = raw ? JSON.parse(raw) : [];

    // 2) Encuentro índice del ítem “identico”
    const index = wishlist.findIndex(wi => {
      // comparo id y type
      if (wi.item_id !== props.item_id || wi.item_type !== props.item_type) {
        return false;
      }
      // comparo cada campo opcional
      const optionalFields: (keyof Omit<AddToWishlistProps, "item_id" | "item_type" | "count">)[] =
        ["size", "weight", "material", "color", "flavor"];
      return optionalFields.every(f => wi[f] === props[f]);
    });

    // 3) Si no existe, agregar; si existe, sumar count
    let updatedWishlist: AddToWishlistProps[];
    if (index === -1) {
      updatedWishlist = [...wishlist, props];
    } else {
      updatedWishlist = wishlist.map((wi, i) =>
        i === index ? { ...wi, count: (wi.count || 0) + props.count } : wi,
      );
    }

    // 4) Guardar en localStorage
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // 5) Calcular totales y dispatch
    const results = {
      wishlist: updatedWishlist,
      totalItems: updatedWishlist.length,
    };

    dispatch({
      type: ADD_WISHLIST_ITEM_SUCCESS,
      payload: results,
    });
  };

export const removeFromWishlist =
  (props: RemoveFromWishlistProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

export const removeFromWishlistAnonymous =
  (props: RemoveFromWishlistProps) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    // 1) Cargo el carrito desde localStorage
    const raw = localStorage.getItem("wishlist");
    const wishlist: AddToWishlistProps[] = raw ? JSON.parse(raw) : [];

    let updatedWishlist: AddToWishlistProps[];

    if (typeof props.remove_count === "number") {
      // 2a) Decremento el count del ítem, o lo elimino si count ≤ 0
      updatedWishlist = wishlist
        .map(wi => {
          if (wi.item_id === props.item_id && wi.item_type === props.item_type) {
            const newCount = (wi.count || 0) - props.remove_count!;
            return newCount > 0 ? { ...wi, count: newCount } : null; // marcar para eliminar
          }
          return wi;
        })
        .filter((wi): wi is AddToWishlistProps => wi !== null);
    } else {
      // 2b) Elimino por completo todos los ítems que coincidan
      updatedWishlist = wishlist.filter(
        wi => !(wi.item_id === props.item_id && wi.item_type === props.item_type),
      );
    }

    // 3) Guardo en localStorage
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // 4) Disparo el action con el carrito y totalItems actualizado
    dispatch({
      type: REMOVE_WISHLIST_ITEM_SUCCESS,
      payload: {
        wishlist: updatedWishlist,
        totalItems: updatedWishlist.length,
      },
    });
  };

export const clearWishlist =
  () => async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {};

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

// 2) Mueve de wishlist → carrito
export const moveWishlistToCartAnonymous =
  (props: {
    item_id: string;
    item_type: string;
    /** Campos opcionales para la variante exacta */
    size?: string | null;
    weight?: string | null;
    material?: string | null;
    color?: string | null;
    flavor?: string | null;
    /** Si se quiere mover solo parte del count */
    remove_count?: number;
    /** count a añadir en carrito (por defecto remove_count o 1) */
    count?: number;
  }) =>
  async (dispatch: ThunkDispatch<RootState, void, UnknownAction>) => {
    const moveCount = props.count ?? props.remove_count ?? 1;

    // 2.a) Añadir al carrito con los mismos atributos
    await dispatch(
      addToCartAnonymous({
        item_id: props.item_id,
        item_type: props.item_type,
        size: props.size ?? null,
        weight: props.weight ?? null,
        material: props.material ?? null,
        color: props.color ?? null,
        flavor: props.flavor ?? null,
        count: moveCount,
      }),
    );

    // 2.b) Eliminar de la wishlist (parcial o completo), también por variante
    await dispatch(
      removeFromWishlistAnonymous({
        item_id: props.item_id,
        item_type: props.item_type,
        size: props.size ?? null,
        weight: props.weight ?? null,
        material: props.material ?? null,
        color: props.color ?? null,
        flavor: props.flavor ?? null,
        remove_count: props.remove_count,
      }),
    );

    // 2.c) Recalcular totales del carrito anónimo
    const raw = localStorage.getItem("cart");
    const updatedCart: CartItem[] = raw ? JSON.parse(raw) : [];
    dispatchCalculateTotal(dispatch, updatedCart);
  };
