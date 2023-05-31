import { FlexLogEntryCursorsOps } from "../definitions/flexnode";
import { StoreChangeCursorActions } from "../store/changecursors";
import { store } from "../store/store";

export class FlexLogEntryCursorsOpsImpl implements FlexLogEntryCursorsOps {
  async appendCursor(resourceId: string, logEntryId: string): Promise<void> {
    store.dispatch(StoreChangeCursorActions.set([resourceId, logEntryId]));
  }

  async consumeCursor(resourceId: string): Promise<void> {
    store.dispatch(StoreChangeCursorActions.remove(resourceId));
  }
}
