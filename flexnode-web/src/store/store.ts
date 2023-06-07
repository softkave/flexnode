import { configureStore } from "@reduxjs/toolkit";
import { storeChangeCursorsReducer } from "./changecursors";
import { storeChangeLogsReducer } from "./changelogs";
import { storeFoldersReducer } from "./folders";
import { storeKvReducer } from "./kv";

const reducer = {
  folders: storeFoldersReducer,
  changelogs: storeChangeLogsReducer,
  changecursors: storeChangeCursorsReducer,
  kv: storeKvReducer,
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = ReturnType<typeof store.getState>;
export type AppStoreDispatch = typeof store.dispatch;
