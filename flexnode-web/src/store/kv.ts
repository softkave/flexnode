import { AnyObject } from "@/utils/types";
import { createAction, createReducer } from "@reduxjs/toolkit";
import { StoreActionKeys } from "./constants";

const set = createAction<[string, any]>(StoreActionKeys.kv.set);
const remove = createAction<string>(StoreActionKeys.kv.remove);
export const StoreKvActions = {
  set,
  remove,
};

export const StoreKvKeys = {
  selectedResource: "selectedResource",
};

const initialState = {} as AnyObject;
export const storeKvReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(set, (state, action) => {
      const [k, v] = action.payload;
      state[k] = v;
    })
    .addCase(remove, (state, action) => {
      delete state[action.payload];
    });
});
