import { createAction, createReducer } from "@reduxjs/toolkit";
import { FlexFolder } from "../definitions/flexnode";
import { StoreActionKeys } from "./constants";

const set = createAction<FlexFolder>(StoreActionKeys.folders.set);
const remove = createAction<string>(StoreActionKeys.folders.remove);
export const StoreFolderActions = {
  set,
  remove,
};

export type StoreFoldersState = Partial<Record<string, FlexFolder>>;

const initialState = {} as StoreFoldersState;
export const storeFoldersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(set, (state, action) => {
      state[action.payload.resourceId] = action.payload;
    })
    .addCase(remove, (state, action) => {
      delete state[action.payload];
    });
});

function getFolderById(state: StoreFoldersState, id: string) {
  return state[id];
}

export const StoreFolderSelectors = {
  getFolderById,
};
