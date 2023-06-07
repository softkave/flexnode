import { flexNodeOps } from "@/dataLayer/FlexNodeOps";
import { FlexFolder } from "@/definitions/flexnode";
import { StoreKvActions, StoreKvKeys } from "@/store/kv";
import { Typography } from "antd";
import { useFormik } from "formik";
import { useAppDispatch } from "../../hooks/store";
import IconButton from "../buttons/IconButton";

export interface ISectionFormProps {
  folder: FlexFolder;
  sectionId: string;
}

const SectionForm: React.FC<ISectionFormProps> = (props) => {
  const { folder, sectionId } = props;
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: folder.sections[sectionId],
    onSubmit(values, formikHelpers) {
      // we're using real-time update to redux so we don't need this
    },
  });

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

export default SectionForm;
