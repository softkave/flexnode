import { createAction, createReducer } from "@reduxjs/toolkit";
import { FlexLogEntryCursors } from "../definitions/flexnode";
import { StoreActionKeys } from "./constants";

const set = createAction<[string, string]>(StoreActionKeys.changecursors.set);
const remove = createAction<string>(StoreActionKeys.changecursors.remove);
export const StoreChangeCursorActions = {
  set,
  remove,
};

const initialState = { pendingCursors: {} } as FlexLogEntryCursors;
export const storeChangeCursorsReducer = createReducer(
  initialState,
  (builder) => {
    builder
      .addCase(set, (state, action) => {
        const [resourceId, logEntryId] = action.payload;
        state.pendingCursors[resourceId] = logEntryId;
      })
      .addCase(remove, (state, action) => {
        delete state.pendingCursors[action.payload];
      });
  }
);
