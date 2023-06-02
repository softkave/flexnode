import { FlexFolder } from "../../definitions/flexnode";
import IconButton from "../buttons/IconButton";

export interface ISectionListHeaderProps {
  folder: FlexFolder;
  onCreateSection(): void;
}

const SectionListHeader: React.FC<ISectionListHeaderProps> = (props) => {
  const { folder, onCreateSection } = props;
  return (
    <div>
      <Typography.Title level={5}>{folder.name}</Typography.Title>
      <IconButton icon={} onClick={onCreateSection} />
    </div>
  );
};

export default SectionListHeader;
