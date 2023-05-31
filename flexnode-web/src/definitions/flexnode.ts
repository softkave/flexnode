import { ObjectValues } from "../utils/types";

export interface Resource {
  resourceId: string;
  createdAt: number;
  // createdBy: string;
  lastUpdatedAt: number;
  // lastUpdatedBy: string;
}

export type FlexNodeType = "div" | "img";

export interface FlexNodeInput {
  name: string;
  type: FlexNodeType;
  parentNodeId: string | undefined;
  sectionId: string;
  folderId: string;
}

export interface FlexNode extends Resource {
  name: string;
  type: FlexNodeType;
  styles: Record<string, string | number | undefined>;
  parentNodeId: string | undefined;
  sectionId: string;
  folderId: string;
  children: string[];
}

export interface FlexSectionInput {
  name: string;
  description?: string;
  folderId: string;
}

export interface FlexSection extends Resource {
  name: string;
  description?: string;
  folderId: string;

  /* new sections will automatically have a node created in them, serving same
  purpose as <body/> in html. */
  headNodeId: string;
}

export interface FlexFolderInput {
  name: string;
  description?: string;
}

export interface FlexFolder extends Resource {
  name: string;
  description?: string;
  nodes: Record<string, FlexNode>;
  sections: Record<string, FlexSection>;
}

export type FlexChangeLogItemOpType = "add" | "update" | "remove";

export interface FlexChangeLogItemInput {
  dataType: FlexResourceType;
  opType: FlexChangeLogItemOpType;
  oldData: FlexNode | FlexSection | FlexFolder | null;
  newData: FlexNode | FlexSection | FlexFolder | null;
}

export interface FlexChangeLogItem extends Resource {
  dataType: FlexResourceType;
  opType: FlexChangeLogItemOpType;
  oldData: FlexNode | FlexSection | FlexFolder | null;
  newData: FlexNode | FlexSection | FlexFolder | null;
}

export interface FlexChangeLog {
  entries: FlexChangeLogItem[];
}

export interface FlexLogEntryCursors {
  /** map of node, section, or folder id to flex log entry item id. use empty
   * string "" for global undo cursor. */
  pendingCursors: Record<string, string>;
}

export interface FlexLogEntryCursorsOps {
  appendCursor(resourceId: string, logEntryId: string): Promise<void>;
  consumeCursor(resourceId: string): Promise<void>;
}

export interface FlexChangeLogOps {
  appendEntry(e: FlexChangeLogItem): Promise<void>;
  getLast(
    dataType: FlexResourceType,
    resourceId: string
  ): Promise<FlexChangeLogItem | null>;
  clearFrom(resourceId: string | undefined, entryId: string): Promise<void>;
}

export interface FlexNodeOpsUndoFrom {
  folderId: string;
  sectionId?: string;
  nodeId?: string;
}

export interface FlexNodeOps {
  createNode(f: FlexNodeInput): Promise<FlexNode>;
  createSection(f: FlexSectionInput): Promise<FlexSection>;
  createFolder(f: FlexFolderInput): Promise<FlexFolder>;

  updateNode(
    folderId: string,
    id: string,
    f: Partial<FlexNode>
  ): Promise<FlexNode>;
  updateSection(
    folderId: string,
    id: string,
    f: Partial<FlexSection>
  ): Promise<FlexSection>;
  updateFolder(id: string, f: Partial<FlexFolder>): Promise<FlexFolder>;

  deleteNode(folderId: string, id: string): Promise<void>;
  deleteSection(folderId: string, id: string): Promise<void>;
  deleteFolder(id: string): Promise<void>;

  /** undo/redo only applies to flexnodes and sections. when we undo, we apply
   * the data back but keep entries until change is overlaid, then we remove
   * entries upto that point. this is to allow for redo ops. if node and section
   * id are present, only node id is considered. if section or node id is not
   * provided, will do a global undo/redo. */
  undo(count: number, from?: FlexNodeOpsUndoFrom): Promise<void>;
  redo(count: number, from?: FlexNodeOpsUndoFrom): Promise<void>;
}

export const FlexResourceTypesMap = {
  Folder: "folder",
  Section: "section",
  Node: "node",
  ChangeLogItem: "changeLogItem",
} as const;

export type FlexResourceType = ObjectValues<typeof FlexResourceTypesMap>;
