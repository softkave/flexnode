import assert from "assert";
import { nanoid } from "nanoid";
import { FlexChangeLogItem, FlexChangeLogOps } from "../definitions/flexnode";
import { StoreChangeLogsActions } from "../store/changelogs";
import { store } from "../store/store";
import { makeKey } from "../utils/fns";

const kCompositeIdPrefix = "flexnode_composite_id";

export class FlexChangeLogOpsImpl implements FlexChangeLogOps {
  async appendEntry(e: FlexChangeLogItem): Promise<void> {
    store.dispatch(StoreChangeLogsActions.append(e));
  }

  async getLast(
    folderId: string,
    fromLogId?: string
  ): Promise<FlexChangeLogItem[]> {
    const entries = store.getState().changelogs.entries;
    let lastItem: FlexChangeLogItem | undefined = undefined;
    let foundFromLog = fromLogId ? false : true;

    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (!foundFromLog) {
        if (e.resourceId === fromLogId) foundFromLog = true;
        else continue;
      }
      if (e.folderId === folderId) lastItem = e;
    }

    if (!lastItem) return [];
    return this.getEntryAndComposites(lastItem);
  }

  async getNext(
    folderId: string,
    fromLogId: string
  ): Promise<FlexChangeLogItem[]> {
    const entries = store.getState().changelogs.entries;
    let nextEntry: FlexChangeLogItem | undefined = undefined;
    let fromCompositeId: string | undefined = undefined;
    let matchStartIndex: number | undefined = undefined;

    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (e.folderId === folderId && e.resourceId === fromLogId) {
        matchStartIndex = i;
        fromCompositeId = e.compositeId;
        break;
      }
    }

    if (matchStartIndex) {
      for (let i = matchStartIndex; i < entries.length; i++) {
        const e = entries[i];
        if (e.compositeId !== fromCompositeId && e.folderId === folderId) {
          nextEntry = e;
          break;
        }
      }
    }

    if (nextEntry) return this.getEntryAndComposites(nextEntry);
    else return [];
  }

  async clearFrom(entryId: string): Promise<void> {
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
      for (let i = entryIndex + 1; i < entries.length; i++) {
        entryIds.push(entries[i].resourceId);
      }
    }

    if (entryIds.length) {
      store.dispatch(StoreChangeLogsActions.remove(entryIds));
    }
  }

  newLogCompositeId() {
    return makeKey([kCompositeIdPrefix, Date.now(), nanoid()]);
  }

  protected async getEntryAndComposites(
    entry: FlexChangeLogItem
  ): Promise<FlexChangeLogItem[]> {
    const entries = store.getState().changelogs.entries;
    const matched: FlexChangeLogItem[] = [];
    let compositeId: string | undefined = undefined;
    let compositeLogsStartTimestamp: number | undefined = undefined;

    matched.push(entry);
    if (entry.compositeId) {
      compositeId = entry.compositeId;
      compositeLogsStartTimestamp = this.getCompositeLogStartTime(compositeId);
    }

    if (compositeId && compositeLogsStartTimestamp) {
      // start from entries.length - 2, seeing the last item is already matched
      for (let i = entries.length - 2; i >= 0; i--) {
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
  }

  protected getCompositeLogStartTime(id: string) {
    const [prefix, timestampStr] = id.split("_");
    assert(timestampStr);
    const timestamp = parseInt(timestampStr);
    assert(!Number.isNaN(timestamp), "Invalid composite log ID.");
    return timestamp;
  }
}

export const flexChangeLogOps = new FlexChangeLogOpsImpl();
