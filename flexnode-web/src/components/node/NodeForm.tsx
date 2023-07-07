import { flexNodeOps } from "@/dataLayer/FlexNodeOps";
import { FlexFolder } from "@/definitions/flexnode";
import { StoreKvActions, StoreKvKeys } from "@/store/kv";
import { Form, Input, Select } from "antd";
import { useFormik } from "formik";
import { useAppDispatch } from "../../hooks/store";

export interface INodeFormProps {
  folder: FlexFolder;
  nodeId: string;
}

const NodeForm: React.FC<INodeFormProps> = (props) => {
  const { folder, nodeId } = props;
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: folder.nodes[nodeId],
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
      label="Type"
      help={formik.touched?.type && formik.errors?.type}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Select
        value={formik.values.type}
        style={{ width: 120 }}
        onChange={(value) =>
          formik.setValues({ ...formik.values, type: value })
        }
        options={[
          { value: "div", label: "Box" },
          // { value: "img", label: "Image" },
        ]}
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

export default NodeForm;
