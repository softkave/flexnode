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
  parentSectionId: string | undefined;
  childrenSections: string[];
  childrenNodes: string[];
  styles: Record<string, string | number | undefined>;
}

export interface FlexSection extends Resource {
  name: string;
  description?: string;
  folderId: string;
  parentSectionId: string | undefined;
  childrenSections: string[];
  childrenNodes: string[];
  styles: Record<string, string | number | undefined>;
}

export interface FlexFolderInput {
  name: string;
  description?: string;
}

export interface FlexFolder extends Resource {
  name: string;
  description?: string;
  children: string[];
  nodes: Record<string, FlexNode>;
  sections: Record<string, FlexSection>;
}

export type FlexChangeLogItemOpType = "add" | "update" | "remove";

export interface FlexChangeLogItemInput {
  folderId: string;
  compositeId?: string;
  dataType: FlexResourceType;
  opType: FlexChangeLogItemOpType;
  oldData: FlexNode | FlexSection | FlexFolder | null;
  newData: FlexNode | FlexSection | FlexFolder | null;
}

export interface FlexChangeLogItem extends Resource {
  folderId: string;
  dataType: FlexResourceType;
  opType: FlexChangeLogItemOpType;
  oldData: FlexNode | FlexSection | FlexFolder | null;
  newData: FlexNode | FlexSection | FlexFolder | null;

  /** for stringing together log items that happened from the same op. */
  compositeId?: string;
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
  getCursor(resourceId: string): Promise<string | null>;
}

export interface FlexChangeLogOps {
  appendEntry(e: FlexChangeLogItem): Promise<void>;
  getLast(folderId: string): Promise<FlexChangeLogItem[]>;
  getNext(folderId: string, entryId: string): Promise<FlexChangeLogItem[]>;
  clearFrom(entryId: string): Promise<void>;
  newLogCompositeId(): string;
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
  undo(folderId: string): Promise<void>;
  redo(folderId: string): Promise<void>;
}

export const FlexResourceTypesMap = {
  Folder: "folder",
  Section: "section",
  Node: "node",
  ChangeLogItem: "changeLogItem",
} as const;

export type FlexResourceType = ObjectValues<typeof FlexResourceTypesMap>;
