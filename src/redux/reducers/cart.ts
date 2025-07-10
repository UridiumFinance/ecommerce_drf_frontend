import { CartItem } from "../actions/cart/interfaces";
import {
  ADD_ITEM_SUCCESS,
  REMOVE_ITEM_SUCCESS,
  UPDATE_ITEM_SUCCESS,
  CLEAR_CART_SUCCESS,
  GET_TOTAL_SUCCESS,
  GET_TOTAL_FAIL,
} from "../actions/cart/types";

type Action = {
  type: string;
  payload?: any;
};

type State = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
};

const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
};

export default function cartReducer(state: State = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_ITEM_SUCCESS: {
      const { cart, totalItems } = payload as {
        cart: CartItem[];
        totalItems: number;
      };

      return {
        ...state,
        items: cart,
        totalItems,
      };
    }
    case REMOVE_ITEM_SUCCESS: {
      const { cart, totalItems } = payload as {
        cart: CartItem[];
        totalItems: number;
      };

      return {
        ...state,
        items: cart,
        totalItems,
      };
    }
    case CLEAR_CART_SUCCESS: {
      return {
        ...state,
        items: [],
        totalItems: 0,
        subtotal: 0,
        taxRate: 0,
        taxAmount: 0,
        total: 0,
      };
    }
    case UPDATE_ITEM_SUCCESS: {
      const { cart, totalItems } = payload as {
        cart: CartItem[];
        totalItems: number;
      };

      return {
        ...state,
        items: cart,
        totalItems,
      };
    }

    case GET_TOTAL_SUCCESS: {
      const { subtotal, taxRate, taxAmount, total } = payload as {
        subtotal: number;
        taxRate: number;
        taxAmount: number;
        total: number;
      };
      return {
        ...state,
        subtotal,
        taxRate,
        taxAmount,
        total,
        error: undefined,
      };
    }

    case GET_TOTAL_FAIL: {
      return {
        ...state,
        error: payload.error,
      };
    }

    default:
      return state;
  }
}
