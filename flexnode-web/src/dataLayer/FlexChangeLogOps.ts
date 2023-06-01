import assert from "assert";
import { nanoid } from "nanoid";
import {
  FlexChangeLogItem,
  FlexChangeLogOps,
  FlexResourceType,
} from "../definitions/flexnode";
import { StoreChangeLogsActions } from "../store/changelogs";
import { store } from "../store/store";
import { makeKey } from "../utils/fns";

const kCompositeIdPrefix = "flexnode_composite_id";

export const FlexChangeLogOpsImpl: FlexChangeLogOps = {
  async appendEntry(e: FlexChangeLogItem): Promise<void> {
    store.dispatch(StoreChangeLogsActions.append(e));
  },

  async getLast(
    dataType: FlexResourceType,
    resourceId: string
  ): Promise<FlexChangeLogItem[]> {
    const entries = store.getState().changelogs.entries;
    const matched: FlexChangeLogItem[] = [];
    let compositeId: string | undefined = undefined;
    let compositeLogsStartTimestamp: number | undefined = undefined;
    let compositeEndIndex: number | undefined = undefined;

    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (
        e.dataType === dataType &&
        (e.newData?.resourceId === resourceId ||
          e.oldData?.resourceId === resourceId)
      ) {
        matched.push(e);

        if (e.compositeId) {
          compositeId = e.compositeId;
          compositeLogsStartTimestamp = getCompositeLogStartTime(compositeId);
          compositeEndIndex = i;
          break;
        } else {
          return matched;
        }
      }
    }

    if (compositeEndIndex && compositeId && compositeLogsStartTimestamp) {
      for (let i = entries.length - 1; i >= 0; i--) {
        const e = entries[i];
        if (e.compositeId === compositeId) {
          matched.push(e);
        }
        if (e.createdAt < compositeLogsStartTimestamp) {
          break;
        }
      }
    }

    return matched;
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

  newLogCompositeId() {
    return makeKey([kCompositeIdPrefix, Date.now(), nanoid()]);
  },
};

function getCompositeLogStartTime(id: string) {
  const [prefix, timestampStr] = id.split("_");
  assert(timestampStr);
  const timestamp = parseInt(timestampStr);
  assert(!Number.isNaN(timestamp), "Invalid composite log ID.");
  return timestamp;
}
