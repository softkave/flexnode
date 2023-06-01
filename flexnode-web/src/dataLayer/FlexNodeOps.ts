import {
  FlexChangeLogItem,
  FlexChangeLogItemInput,
  FlexFolder,
  FlexFolderInput,
  FlexNode,
  FlexNodeInput,
  FlexNodeOps,
  FlexNodeOpsUndoFrom,
  FlexSection,
  FlexSectionInput,
} from "../definitions/flexnode";
import { StoreFolderActions } from "../store/folders";
import { store } from "../store/store";
import { newResource } from "../utils/resource";
import { FlexChangeLogOpsImpl } from "./FlexChangeLogOps";

export class FlexNodeOpsImpl implements FlexNodeOps {
  async createFolder(f: FlexFolderInput): Promise<FlexFolder> {
    const folder = this.newFolder(f);
    store.dispatch(StoreFolderActions.set(folder));
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
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
    const compositeLogId = FlexChangeLogOpsImpl.newLogCompositeId();
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
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
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
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
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
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
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
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
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
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
        dataType: "section",
        opType: "remove",
        newData: null,
        oldData: section,
      })
    );
  }

  async deleteNode(folderId: string, id: string): Promise<void> {
    let folder = this.getFolder(folderId);
    const node = this.getNode(folderId, id);
    folder = { ...folder, nodes: { ...folder.nodes } };
    delete folder.nodes[id];
    store.dispatch(StoreFolderActions.set(folder));

    const compositeLogId = FlexChangeLogOpsImpl.newLogCompositeId();
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
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

  async undo(
    count: number,
    from?: FlexNodeOpsUndoFrom | undefined
  ): Promise<void> {
    // one of replaceFolder or folderId + (replaceSections | replaceNodes |
    // removeSections | removeNodes)
    const replaceFolder: FlexFolder | undefined = undefined;
    let folderId: string | undefined = undefined;
    const replaceSections: FlexSection[] = [];
    const replaceNodes: FlexNode[] = [];
    const removeSections: string[] = [];
    const removeNodes: string[] = [];
    let logItems: FlexChangeLogItem[] = [];

    if (from) {
      if (from.nodeId) {
        logItems = await FlexChangeLogOpsImpl.getLast("node", from.nodeId);
      } else if (from.sectionId) {
        logItems = await FlexChangeLogOpsImpl.getLast("node", from.nodeId);
      }
    } else {
    }
  }

  async redo(
    count: number,
    from?: FlexNodeOpsUndoFrom | undefined
  ): Promise<void> {}

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
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
        dataType: "node",
        opType: "add",
        newData: node,
        oldData: null,
      })
    );

    if (node.parentNodeId) {
      const parentNode = this.getNode(node.folderId, node.parentNodeId);
      const children = [...parentNode.children, node.resourceId];
      compositeLogId =
        compositeLogId ?? FlexChangeLogOpsImpl.newLogCompositeId();
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
    await FlexChangeLogOpsImpl.appendEntry(
      this.newChangeLogItem({
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
      compositeLogId =
        compositeLogId ?? FlexChangeLogOpsImpl.newLogCompositeId();
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
