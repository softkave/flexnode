import { configureStore } from "@reduxjs/toolkit";
import { storeChangeCursorsReducer } from "./changecursors";
import { storeChangeLogsReducer } from "./changelogs";
import { storeFoldersReducer } from "./folders";

const reducer = {
  folders: storeFoldersReducer,
  changelogs: storeChangeLogsReducer,
  changecursors: storeChangeCursorsReducer,
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== "production",
});
