import { combineReducers } from "redux";
import authReducer from "./auth";
import cartReducer from "./cart";
import wishlistReducer from "./wishlist";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
