import assert from "assert";
import { last } from "lodash";
import {
  FlexChangeLogItem,
  FlexChangeLogItemInput,
  FlexFolder,
  FlexFolderInput,
  FlexNode,
  FlexNodeInput,
  FlexNodeOps,
  FlexSection,
  FlexSectionInput,
} from "../definitions/flexnode";
import { StoreFolderActions } from "../store/folders";
import { store } from "../store/store";
import { newResource } from "../utils/resource";
import { flexChangeLogOps } from "./FlexChangeLogOps";
import { flexLogEntryCursorsOps } from "./FlexLogEntryCursorsOps";

export class FlexNodeOpsImpl implements FlexNodeOps {
  async createFolder(f: FlexFolderInput): Promise<FlexFolder> {
    const folder = this.newFolder(f);
    store.dispatch(StoreFolderActions.set(folder));
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: folder.resourceId,
        dataType: "folder",
        opType: "add",
        newData: folder,
        oldData: null,
      })
    );
    return folder;
  }

  async createSection(f: FlexSectionInput): Promise<FlexSection> {
    const section = this.newSection(f, "");
    const compositeLogId = flexChangeLogOps.newLogCompositeId();
    const headNode = await this.internal_createNode(
      {
        folderId: section.folderId,
        name: "",
        parentNodeId: undefined,
        sectionId: section.resourceId,
        type: "div",
      },
      compositeLogId
    );

    // TODO: this may not work when coupled with server. find another solution.
    section.headNodeId = headNode.resourceId;
    let folder = this.getFolder(f.folderId);
    folder = { ...folder, sections: { ...folder.sections } };
    folder.sections[section.resourceId] = section;
    store.dispatch(StoreFolderActions.set(folder));
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: folder.resourceId,
        compositeId: compositeLogId,
        dataType: "section",
        opType: "add",
        newData: section,
        oldData: null,
      })
    );
    return section;
  }

  async createNode(f: FlexNodeInput): Promise<FlexNode> {
    return this.internal_createNode(f);
  }

  async updateFolder(id: string, f: Partial<FlexFolder>): Promise<FlexFolder> {
    const oldF = this.getFolder(id);
    const newF = { ...oldF, ...f };
    store.dispatch(StoreFolderActions.set(newF));
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: id,
        dataType: "folder",
        opType: "update",
        newData: newF,
        oldData: oldF,
      })
    );
    return newF;
  }

  async updateSection(
    folderId: string,
    id: string,
    f: Partial<FlexSection>
  ): Promise<FlexSection> {
    let folder = this.getFolder(folderId);
    const oldS = this.getSection(folderId, id);
    const newS = { ...oldS, ...f };
    folder = {
      ...folder,
      sections: { ...folder.sections, [id]: newS },
    };
    store.dispatch(StoreFolderActions.set(folder));
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: folder.resourceId,
        dataType: "section",
        opType: "update",
        newData: newS,
        oldData: oldS,
      })
    );
    return newS;
  }

  async updateNode(
    folderId: string,
    id: string,
    f: Partial<FlexNode>
  ): Promise<FlexNode> {
    return this.internal_updateNode(folderId, id, f);
  }

  async deleteFolder(id: string): Promise<void> {
    const folder = this.getFolder(id);
    store.dispatch(StoreFolderActions.remove(id));
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: folder.resourceId,
        dataType: "folder",
        opType: "remove",
        newData: null,
        oldData: folder,
      })
    );
  }

  async deleteSection(folderId: string, id: string): Promise<void> {
    let folder = this.getFolder(folderId);
    const section = this.getSection(folderId, id);
    folder = { ...folder, sections: { ...folder.sections } };
    delete folder.sections[id];
    store.dispatch(StoreFolderActions.set(folder));
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: folder.resourceId,
        dataType: "section",
        opType: "remove",
        newData: null,
        oldData: section,
      })
    );
  }

  async deleteNode(folderId: string, id: string): Promise<void> {
    const node = this.getNode(folderId, id);
    if (!node.parentNodeId)
      throw new Error("Cannot delete a section's head node.");

    let folder = this.getFolder(folderId);
    folder = { ...folder, nodes: { ...folder.nodes } };
    delete folder.nodes[id];
    store.dispatch(StoreFolderActions.set(folder));

    const compositeLogId = flexChangeLogOps.newLogCompositeId();
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: folder.resourceId,
        compositeId: compositeLogId,
        dataType: "node",
        opType: "remove",
        newData: null,
        oldData: node,
      })
    );

    if (node.parentNodeId) {
      const parentNode = this.getNode(folderId, node.parentNodeId);
      const parentNodeChildren = parentNode.children.filter(
        (id) => id !== node.resourceId
      );
      await this.internal_updateNode(
        folderId,
        node.parentNodeId,
        { children: parentNodeChildren },
        compositeLogId
      );
    }
  }

  async undo(folderId: string): Promise<void> {
    const logItems = await flexChangeLogOps.getLast(folderId);
    if (logItems.length === 0) return;

    let folder = this.getFolder(folderId);
    folder = {
      ...folder,
      nodes: { ...folder.nodes },
      sections: { ...folder.sections },
    };

    const isAddFolderLogItem = logItems.some((log) => {
      if (log.dataType === "folder" && log.opType === "add") {
        // cannot undo add folder, user can just delete the folder.
        return true;
      }

      if (log.dataType === "folder") {
        // should be "update" or "remove", so oldData should be present
        assert(log.oldData);
        folder = log.oldData as FlexFolder;
      } else if (log.dataType === "section") {
        if (log.opType === "update" || log.opType === "remove") {
          assert(log.oldData);
          folder.sections[log.oldData.resourceId] = log.oldData as FlexSection;
        } else if (log.opType === "add") {
          assert(log.newData);
          delete folder.sections[log.newData.resourceId];
        }
      } else if (log.dataType === "node") {
        if (log.opType === "update" || log.opType === "remove") {
          assert(log.oldData);
          folder.nodes[log.oldData.resourceId] = log.oldData as FlexNode;
        } else if (log.opType === "add") {
          assert(log.newData);
          delete folder.nodes[log.newData.resourceId];
        }
      }
    });

    if (isAddFolderLogItem) {
      // nothing left to undo
      return;
    }

    store.dispatch(StoreFolderActions.set(folder));
    const earliestLogItemId = last(logItems)?.resourceId;
    assert(earliestLogItemId);
    flexLogEntryCursorsOps.appendCursor(folderId, earliestLogItemId);
  }

  async redo(folderId: string): Promise<void> {
    const earliestLogItemId = await flexLogEntryCursorsOps.getCursor(folderId);
    if (!earliestLogItemId) return;

    const nextLogItems = await flexChangeLogOps.getNext(
      folderId,
      earliestLogItemId
    );
    let folder = this.getFolder(folderId);
    folder = {
      ...folder,
      nodes: { ...folder.nodes },
      sections: { ...folder.sections },
    };

    const isRemoveFolder = nextLogItems.some((log) => {
      if (log.dataType === "folder") {
        if (log.opType === "remove") return true;

        // should be "update" so newData should be present, seeing we cannot
        // undo add folder
        assert(log.newData);
        folder = log.newData as FlexFolder;
      } else if (log.dataType === "section") {
        if (log.opType === "update" || log.opType === "add") {
          assert(log.newData);
          folder.sections[log.newData.resourceId] = log.newData as FlexSection;
        } else if (log.opType === "remove") {
          assert(log.newData);
          delete folder.sections[log.newData.resourceId];
        }
      } else if (log.dataType === "node") {
        if (log.opType === "update" || log.opType === "add") {
          assert(log.newData);
          folder.nodes[log.newData.resourceId] = log.newData as FlexNode;
        } else if (log.opType === "remove") {
          assert(log.newData);
          delete folder.nodes[log.newData.resourceId];
        }
      }
    });

    if (isRemoveFolder) {
      store.dispatch(StoreFolderActions.remove(folderId));
      return;
    }

    store.dispatch(StoreFolderActions.set(folder));
    flexLogEntryCursorsOps.consumeCursor(folderId);
  }

  protected getFolder(id: string) {
    const folder = store.getState().folders[id];
    if (!folder) throw new Error("Folder not found.");
    return folder;
  }

  protected getSection(folderId: string, sectionId: string) {
    const folder = this.getFolder(folderId);
    const section = folder.sections[sectionId];
    if (!section) throw new Error("Section not found.");
    return section;
  }

  protected getNode(folderId: string, nodeId: string) {
    const folder = this.getFolder(folderId);
    const node = folder.nodes[nodeId];
    if (!node) throw new Error("Node not found.");
    return node;
  }

  protected newFolder(input: FlexFolderInput): FlexFolder {
    return newResource<FlexFolder>("folder", {
      ...input,
      nodes: {},
      sections: {},
    });
  }

  protected newSection(
    input: FlexSectionInput,
    headNodeId: string
  ): FlexSection {
    return newResource<FlexSection>("section", {
      ...input,
      headNodeId,
    });
  }

  protected newNode(input: FlexNodeInput): FlexNode {
    return newResource<FlexNode>("node", {
      ...input,
      children: [],
      styles: {},
    });
  }

  protected newChangeLogItem(input: FlexChangeLogItemInput): FlexChangeLogItem {
    return newResource<FlexChangeLogItem>("changeLogItem", {
      ...input,
    });
  }

  protected async internal_createNode(
    f: FlexNodeInput,
    compositeLogId?: string
  ): Promise<FlexNode> {
    const node = this.newNode(f);
    let folder = this.getFolder(f.folderId);
    folder = { ...folder, nodes: { ...folder.nodes } };
    folder.nodes[node.resourceId] = node;
    store.dispatch(StoreFolderActions.set(folder));
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: folder.resourceId,
        dataType: "node",
        opType: "add",
        newData: node,
        oldData: null,
      })
    );

    if (node.parentNodeId) {
      const parentNode = this.getNode(node.folderId, node.parentNodeId);
      const children = [...parentNode.children, node.resourceId];
      compositeLogId = compositeLogId ?? flexChangeLogOps.newLogCompositeId();
      await this.internal_updateNode(
        node.folderId,
        node.parentNodeId,
        { children },
        compositeLogId
      );
    }

    return node;
  }

  protected async internal_updateNode(
    folderId: string,
    id: string,
    f: Partial<FlexNode>,
    compositeLogId?: string
  ): Promise<FlexNode> {
    let folder = this.getFolder(folderId);
    const oldN = this.getNode(folderId, id);
    const newN = { ...oldN, ...f };
    folder = {
      ...folder,
      nodes: { ...folder.nodes, [id]: newN },
    };
    store.dispatch(StoreFolderActions.set(folder));
    await flexChangeLogOps.appendEntry(
      this.newChangeLogItem({
        folderId: folder.resourceId,
        compositeId: compositeLogId,
        dataType: "node",
        opType: "update",
        newData: newN,
        oldData: oldN,
      })
    );

    if (
      f.parentNodeId &&
      oldN.parentNodeId &&
      oldN.parentNodeId !== f.parentNodeId
    ) {
      const oldParentNode = this.getNode(folderId, oldN.parentNodeId);
      const newParentNode = this.getNode(folderId, f.parentNodeId);
      const oldParentNodeChildren = oldParentNode.children.filter(
        (id) => id !== oldN.resourceId
      );
      const newParentNodeChildren = [
        ...newParentNode.children,
        oldN.resourceId,
      ];
      compositeLogId = compositeLogId ?? flexChangeLogOps.newLogCompositeId();
      await Promise.all([
        this.internal_updateNode(
          folderId,
          oldN.parentNodeId,
          { children: oldParentNodeChildren },
          compositeLogId
        ),
        this.internal_updateNode(
          folderId,
          f.parentNodeId,
          { children: newParentNodeChildren },
          compositeLogId
        ),
      ]);
    }

    return newN;
  }
}

export const flexNodeOps = new FlexNodeOpsImpl();
