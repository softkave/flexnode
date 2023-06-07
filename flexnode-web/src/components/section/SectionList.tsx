import { flexNodeOps } from "@/dataLayer/FlexNodeOps";
import { FlexFolder, FlexNode, FlexSection } from "@/definitions/flexnode";
import { StoreKvActions, StoreKvKeys } from "@/store/kv";
import { css } from "@emotion/css";
import { Tree, TreeProps, Typography } from "antd";
import { last } from "lodash";
import React from "react";
import { useAppDispatch } from "../../hooks/store";
import CustomIcon from "../buttons/CustomIcon";
import DropdownButton from "../buttons/DropdownButton";
import IconButton from "../buttons/IconButton";
import SectionListHeader from "./SectionListHeader";

export interface ISectionListProps {
  folder: FlexFolder;
}

const classes00 = {
  treeItemBtns: css({
    display: "none",
  }),
};

const classes = {
  treeItem: css({
    display: "flex",

    [`&:hover ${classes00.treeItemBtns}`]: {
      display: "block",
    },
  }),
  treeItemInfo: css({ flex: 1 }),
  treeItemBtns: classes00.treeItemBtns,
};

const SectionList: React.FC<ISectionListProps> = (props) => {
  const { folder } = props;
  const dispatch = useAppDispatch();

  const treeData: TreeProps["treeData"] = React.useMemo(
    () => sectionsToTree(folder.children, folder),
    [folder]
  );

  return (
    <div>
      <SectionListHeader folder={folder} />
      <Tree
        showLine
        onSelect={(keys) => {
          const resourceId = last(keys);
          dispatch(
            StoreKvActions.set([StoreKvKeys.selectedResource, resourceId])
          );
        }}
        treeData={treeData}
      />
    </div>
  );
};

function sectionsToTree(
  sectionIdList: string[],
  folder: FlexFolder
): TreeProps["treeData"] {
  return sectionIdList.map((sectionId) => {
    const section = folder.sections[sectionId];
    const childrenSections =
      sectionsToTree(section.childrenSections, folder) ?? [];
    const childrenNodes = nodesToTree(section.childrenNodes, folder) ?? [];
    const children =
      childrenSections.length || childrenNodes.length
        ? childrenSections.concat(childrenNodes)
        : undefined;

    return {
      children,
      key: section.resourceId,
      title: <SectionTreeItem section={section} />,
    };
  });
}

function nodesToTree(
  nodeIdList: string[],
  folder: FlexFolder
): TreeProps["treeData"] {
  return nodeIdList.map((nodeId) => {
    const node = folder.nodes[nodeId];
    return {
      key: node.resourceId,
      title: <NodeTreeItem node={node} />,
      children: node.children.length
        ? nodesToTree(node.children, folder)
        : undefined,
    };
  });
}

interface ISectionTreeItemProps {
  section: FlexSection;
}
interface INodeTreeItemProps {
  node: FlexNode;
}

const MenuKeys = {
  addSection: "addSection",
  addNode: "addNode",
};

function SectionTreeItem(props: ISectionTreeItemProps) {
  const { section } = props;
  const dispatch = useAppDispatch();

  const handleAddSection = async () => {
    const newSection = await flexNodeOps.createSection({
      name: "",
      description: "",
      folderId: section.folderId,
      parentSectionId: section.resourceId,
      childrenSections: [],
      childrenNodes: [],
      styles: {},
    });
    dispatch(
      StoreKvActions.set([StoreKvKeys.selectedResource, newSection.resourceId])
    );
  };
  const handleAddNode = async () => {
    const newNode = await flexNodeOps.createNode({
      name: "",
      folderId: section.folderId,
      parentNodeId: undefined,
      sectionId: section.resourceId,
      type: "div",
    });
    dispatch(
      StoreKvActions.set([StoreKvKeys.selectedResource, newNode.resourceId])
    );
  };

  return (
    <div className={classes.treeItem}>
      <Typography.Text className={classes.treeItemInfo}>
        {section.name}
      </Typography.Text>
      <DropdownButton
        className={classes.treeItemBtns}
        triggerNode={<IconButton icon={} />}
        menu={{
          items: [
            {
              key: MenuKeys.addSection,
              icon: <CustomIcon icon={} />,
              title: "Add Section",
            },
            { type: "divider" },
            {
              key: MenuKeys.addNode,
              icon: <CustomIcon icon={} />,
              title: "Add Node",
            },
          ],
          onClick: (info) => {
            if (info.key === MenuKeys.addSection) handleAddSection();
            else if (info.key === MenuKeys.addNode) handleAddNode();
          },
        }}
      />
    </div>
  );
}

function NodeTreeItem(props: INodeTreeItemProps) {
  const { node } = props;
  const dispatch = useAppDispatch();

  const handleAddNode = async () => {
    const newNode = await flexNodeOps.createNode({
      name: "",
      folderId: node.folderId,
      parentNodeId: node.resourceId,
      sectionId: node.sectionId,
      type: "div",
    });
    dispatch(
      StoreKvActions.set([StoreKvKeys.selectedResource, newNode.resourceId])
    );
  };

  return (
    <div className={classes.treeItem}>
      <Typography.Text className={classes.treeItemInfo}>
        {node.name}
      </Typography.Text>
      <IconButton
        icon={}
        onClick={handleAddNode}
        className={classes.treeItemBtns}
      />
    </div>
  );
}

export default SectionList;
