import { flexNodeOps } from "@/dataLayer/FlexNodeOps";
import { FlexFolder } from "@/definitions/flexnode";
import { StoreKvActions, StoreKvKeys } from "@/store/kv";
import { Form, Input } from "antd";
import { useFormik } from "formik";
import { useAppDispatch } from "../../hooks/store";

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

  const nameNode = (
    <Form.Item
      required
      label="Name"
      help={formik.touched?.name && formik.errors?.name}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        name="name"
        value={formik.values.name}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter section name"
        autoComplete="off"
      />
    </Form.Item>
  );

  const descriptionNode = (
    <Form.Item
      label="Description"
      help={formik.touched?.description && formik.errors?.description}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea
        name="description"
        value={formik.values.description}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter section description"
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  return (
    <div>
      {nameNode}
      {descriptionNode}
    </div>
  );
};

export default SectionForm;
