import { flexNodeOps } from "@/dataLayer/FlexNodeOps";
import { FlexFolder } from "@/definitions/flexnode";
import { StoreKvActions, StoreKvKeys } from "@/store/kv";
import { Typography } from "antd";
import { useAppDispatch } from "../../hooks/store";
import IconButton from "../buttons/IconButton";

export interface ISectionListHeaderProps {
  folder: FlexFolder;
}

const SectionListHeader: React.FC<ISectionListHeaderProps> = (props) => {
  const { folder } = props;
  const dispatch = useAppDispatch();

  const handleAddSection = async () => {
    const newSection = await flexNodeOps.createSection({
      name: "",
      description: "",
      folderId: folder.resourceId,
      parentSectionId: undefined,
      childrenSections: [],
      childrenNodes: [],
      styles: {},
    });
    dispatch(
      StoreKvActions.set([StoreKvKeys.selectedResource, newSection.resourceId])
    );
  };

  return (
    <div>
      <Typography.Title level={5}>{folder.name}</Typography.Title>
      <IconButton icon={} onClick={handleAddSection} />
    </div>
  );
};

export default SectionListHeader;
