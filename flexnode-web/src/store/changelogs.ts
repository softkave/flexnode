import { createAction, createReducer } from "@reduxjs/toolkit";
import { FlexChangeLog, FlexChangeLogItem } from "../definitions/flexnode";
import { toArray } from "../utils/fns";
import { indexArray } from "../utils/indexArray";
import { StoreActionKeys } from "./constants";

const append = createAction<FlexChangeLogItem | FlexChangeLogItem[]>(
  StoreActionKeys.change.append
);
const remove = createAction<string | string[]>(StoreActionKeys.change.remove);
export const StoreChangeLogsActions = {
  append,
  remove,
};

const initialState: FlexChangeLog = { entries: [] };
export const storeChangeLogsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(append, (state, action) => {
      const entries = toArray(action.payload);
      state.entries = state.entries.concat(entries);
    })
    .addCase(remove, (state, action) => {
      const ids = toArray(action.payload);
      if (ids.length === 0) return;

      const idsMap = indexArray(ids);
      const idsIndex: Record<number, boolean> = {};
      let foundCount = 0;
      let lastEntryIndex: number | undefined = undefined;

      for (let i = state.entries.length - 1; i >= 0; i--) {
        const entry = state.entries[i];
        if (idsMap[entry.resourceId]) {
          idsIndex[i] = true;
          foundCount += 1;
          lastEntryIndex = i;
          if (foundCount >= ids.length) break;
        }
      }

      if (lastEntryIndex) {
        state.entries = state.entries
          .slice(0, lastEntryIndex)
          .concat(
            state.entries
              .slice(lastEntryIndex)
              .filter((entry, i) => !idsIndex[i])
          );
      }
    });
});
