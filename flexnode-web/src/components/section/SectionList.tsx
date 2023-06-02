import { TreeProps } from "antd";
import { FlexFolder } from "../../definitions/flexnode";
import IconButton from "../buttons/IconButton";

export interface ISectionListProps {
  folder: FlexFolder;
}

const SectionList: React.FC<ISectionListProps> = (props) => {
  const { folder } = props;
  const treeData: TreeProps["treeData"] = folder.children.map((sectionId) => {
    const section = folder.sections[sectionId];
  });

  return (
    <div>
      <Typography.Title level={5}>{folder.name}</Typography.Title>
      <IconButton icon={} onClick={onCreateSection} />
    </div>
  );
};

function sectionsToTree(
  sectionIdList: string[],
  folder: FlexFolder
): TreeProps["treeData"] {
  return sectionIdList.map((sectionId) => {
    const section = folder.sections[sectionId];
    return {
      key: section.resourceId,
      title: section.name,
      children: section.children.length
        ? sectionsToTree(section.children, folder)
        : undefined,
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
      title: node.name,
      children: node.children.length
        ? nodesToTree(node.children, folder)
        : undefined,
    };
  });
}

export default SectionList;
