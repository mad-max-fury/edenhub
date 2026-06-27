import { combineReducers } from "@reduxjs/toolkit";

import guestCartReducer from "./api/cart/guestCart.slice";
import { baseApi } from "./baseApi";

const reducers = {
  guestCart: guestCartReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};

export const whitelist = [
  "guestCart",
];
export const combineReducer = combineReducers<typeof reducers>(reducers);
