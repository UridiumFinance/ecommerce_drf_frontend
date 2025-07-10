import { WishlistItem } from "../actions/wishlist/interfaces";
import {
  ADD_WISHLIST_ITEM_SUCCESS,
  EMPTY_WISHLIST_SUCCESS,
  REMOVE_WISHLIST_ITEM_SUCCESS,
} from "../actions/wishlist/types";

type Action = {
  type: string;
  payload?: any;
};

type State = {
  items: WishlistItem[];
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

export default function wishlistReducer(state: State = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_WISHLIST_ITEM_SUCCESS: {
      const { wishlist, totalItems } = payload as {
        wishlist: WishlistItem[];
        totalItems: number;
      };

      return {
        ...state,
        items: wishlist,
        totalItems,
      };
    }
    case REMOVE_WISHLIST_ITEM_SUCCESS: {
      const { wishlist, totalItems } = payload as {
        wishlist: WishlistItem[];
        totalItems: number;
      };

      return {
        ...state,
        items: wishlist,
        totalItems,
      };
    }
    case EMPTY_WISHLIST_SUCCESS: {
      const { wishlist, totalItems } = payload as {
        wishlist: WishlistItem[];
        totalItems: number;
      };

      return {
        ...state,
        items: wishlist,
        totalItems,
      };
    }
    default:
      return state;
  }
}
