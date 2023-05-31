import {
  FlexChangeLogItem,
  FlexChangeLogItemDataType,
  FlexChangeLogOps,
} from "../definitions/flexnode";
import { StoreChangeLogsActions } from "../store/changelogs";
import { store } from "../store/store";

export const FlexChangeLogOpsImpl: FlexChangeLogOps = {
  async appendEntry(e: FlexChangeLogItem): Promise<void> {
    store.dispatch(StoreChangeLogsActions.append(e));
  },

  async getLast(
    dataType: FlexChangeLogItemDataType,
    resourceId: string
  ): Promise<FlexChangeLogItem | null> {
    const entries = store.getState().changelogs.entries;

    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (
        e.dataType === dataType &&
        (e.newData?.resourceId === resourceId ||
          e.oldData?.resourceId === resourceId)
      ) {
        return e;
      }
    }

    return null;
  },

  async clearFrom(
    resourceId: string | undefined,
    entryId: string
  ): Promise<void> {
    let entryIndex: number | undefined = undefined;
    const entryIds: string[] = [];
    const entries = store.getState().changelogs.entries;

    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (e.resourceId === entryId) {
        entryIndex = i;
        break;
      }
    }

    if (entryIndex) {
      if (resourceId) {
        for (let i = entryIndex + 1; i < entries.length; i++) {
          const e = entries[i];
          if (e.resourceId === resourceId) entryIds.push(e.resourceId);
        }
      } else {
        for (let i = entryIndex + 1; i < entries.length; i++) {
          entryIds.push(entries[i].resourceId);
        }
      }
    }

    if (entryIds.length) {
      store.dispatch(StoreChangeLogsActions.remove(entryIds));
    }
  },
};
