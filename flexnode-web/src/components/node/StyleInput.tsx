import { ColorPicker, Form, Input, InputNumber, Select } from "antd";
import { isBoolean, isFunction } from "lodash";
import React from "react";
import { StyleInputController, StyleInputType } from "./types";

export interface IStyleInputProps {
  input: StyleInputType;
  controller: StyleInputController;
}

const StyleInput: React.FC<IStyleInputProps> = (props) => {
  const { input, controller } = props;

  if (
    input.hidden &&
    (isBoolean(input.hidden) || input.hidden(input, controller))
  ) {
    return null;
  }

  let inputNode: React.ReactNode = null;
  const placeholder = isFunction(input.placeholder)
    ? input.placeholder(input, controller)
    : input.placeholder;

  if (input.type === "color") {
    const value = controller.getValue(input.key);
    inputNode = (
      <ColorPicker
        value={value}
        onChange={(color) =>
          input.setValue
            ? input.setValue(input, controller, color.toHexString())
            : controller.setValue(input.key, color.toHexString())
        }
      />
    );
  } else if (input.type === "number") {
    const value = controller.getValue(input.key);
    inputNode = (
      <InputNumber
        value={value}
        onChange={(num) =>
          input.setValue
            ? input.setValue(input, controller, num)
            : controller.setValue(input.key, num)
        }
        placeholder={placeholder}
      />
    );
  } else if (input.type === "select") {
    const value = controller.getValue(input.key);
    inputNode = (
      <Select
        value={value}
        onChange={(option) =>
          input.setValue
            ? input.setValue(input, controller, option)
            : controller.setValue(input.key, option)
        }
        options={input.options}
        placeholder={placeholder}
      />
    );
  } else if (input.type === "managed") {
    inputNode = input.render(input, controller);
  } else if (input.type === "replace") {
    // return `null`, `replace` is handled outside of `StyleInput`.
    return null;
  } else if (input.type === "text") {
    const value = controller.getValue(input.key);
    inputNode = (
      <Input
        value={value}
        onChange={(text) =>
          input.setValue
            ? input.setValue(input, controller, text)
            : controller.setValue(input.key, text)
        }
      />
    );
  } else if (input.type === "textarea") {
    const value = controller.getValue(input.key);
    inputNode = (
      <Input.TextArea
        value={value}
        onChange={(text) =>
          input.setValue
            ? input.setValue(input, controller, text)
            : controller.setValue(input.key, text)
        }
      />
    );
  }

  const label = isFunction(input.label)
    ? input.label(input, controller)
    : input.label;
  const labelCol = isFunction(input.labelCol)
    ? input.labelCol(input, controller)
    : input.labelCol;
  const wrapperCol = isFunction(input.wrapperCol)
    ? input.wrapperCol(input, controller)
    : input.wrapperCol;

  return (
    <Form.Item label={label} labelCol={labelCol} wrapperCol={wrapperCol}>
      {inputNode}
    </Form.Item>
  );
};

export default StyleInput;
