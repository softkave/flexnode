import { FlexFolder, FlexNode } from "../../definitions/flexnode";
import IconButton from "../buttons/IconButton";

export interface INodeListProps {
  node?: FlexNode;
  folder: FlexFolder;
}

const NodeList: React.FC<INodeListProps> = (props) => {
  const { folder, node } = props;
  return (
    <div>
      <Typography.Title level={5}>{folder.name}</Typography.Title>
      <IconButton icon={} onClick={onCreateSection} />
    </div>
  );
};

export default NodeList;
