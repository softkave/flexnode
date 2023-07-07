import {
  ColProps,
  ColorPickerProps,
  DividerProps,
  InputNumberProps,
  InputProps,
} from "antd";
import { TextAreaProps } from "antd/es/input";
import { DefaultOptionType, SelectProps } from "antd/es/select";
import { TitleProps } from "antd/es/typography/Title";
import React from "react";

export interface StyleInputController {
  setValue(key: StyleInputTypeBase["key"], value: any): void;
  setValues(values: Record<string, any>): void;
  getValue(key: StyleInputTypeBase["key"]): any;
}

type StyleInputTypeBase = {
  key?:
    | string
    | ((input: StyleInputType, controller: StyleInputController) => string);
  col?:
    | ColProps
    | ((input: StyleInputType, controller: StyleInputController) => ColProps);
  labelCol?:
    | ColProps
    | ((input: StyleInputType, controller: StyleInputController) => ColProps);
  wrapperCol?:
    | ColProps
    | ((input: StyleInputType, controller: StyleInputController) => ColProps);
  label?:
    | React.ReactNode
    | ((
        input: StyleInputType,
        controller: StyleInputController
      ) => React.ReactNode);
  hidden?:
    | boolean
    | ((input: StyleInputType, controller: StyleInputController) => boolean);
  setValue?: (
    input: StyleInputType,
    controller: StyleInputController,
    value: any
  ) => void;
  placeholder?:
    | string
    | ((input: StyleInputType, controller: StyleInputController) => string);
};

export type StyleInputType = StyleInputTypeBase &
  (
    | { type: "divider"; dividerProps?: DividerProps }
    | { type: "title"; titleProps?: TitleProps }
    | {
        type: "select";
        options: DefaultOptionType[];
        selectProps?: SelectProps;
      }
    | { type: "number"; numProps?: InputNumberProps }
    | { type: "color"; colorProps?: ColorPickerProps }
    | { type: "text"; textProps?: InputProps }
    | { type: "textarea"; textareaProps?: TextAreaProps }
    | {
        type: "managed";
        key?: string;
        render: (
          input: StyleInputType,
          controller: StyleInputController
        ) => React.ReactNode;
      }
    | {
        type: "replace";
        generate: (
          input: StyleInputType,
          controller: StyleInputController
        ) => StyleInputType[];
      }
  );

export const kNodeStyleKeys = {
  display: "display",
  width: "width",
  height: "height",

  marginType: "marginType",
  marginTop: "marginTop",
  marginRight: "marginRight",
  marginBottom: "marginBottom",
  marginLeft: "marginLeft",

  paddingType: "paddingType",
  paddingTop: "paddingTop",
  paddingRight: "paddingRight",
  paddingBottom: "paddingBottom",
  paddingLeft: "paddingLeft",

  borderType: "borderType",
  borderTopWidth: "borderTopWidth",
  borderRightWidth: "borderRightWidth",
  borderBottomWidth: "borderBottomWidth",
  borderLeftWidth: "borderLeftWidth",
  borderTopColor: "borderTopColor",
  borderRightColor: "borderRightColor",
  borderBottomColor: "borderBottomColor",
  borderLeftColor: "borderLeftColor",
  borderTopStyle: "borderTopStyle",
  borderRightStyle: "borderRightStyle",
  borderBottomStyle: "borderBottomStyle",
  borderLeftStyle: "borderLeftStyle",
  borderTopRadius: "borderTopRadius",
  borderRightRadius: "borderRightRadius",
  borderBottomRadius: "borderBottomRadius",
  borderLeftRadius: "borderLeftRadius",

  position: "position",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",

  overflow: "overflow",
  whitespace: "whitespace",
  zIndex: "zIndex",
  color: "color",
  backgroundColor: "backgroundColor",
  boxSizing: "boxSizing",

  fontFamily: "fontFamily",
  fontSize: "fontSize",
  fontWeight: "fontWeight",

  columnGap: "columnGap",
  rowGap: "rowGap",
  verticalAlign: "verticalAlign",
  textAlign: "textAlign",

  /**
    text-decoration-color
    text-decoration-line
    text-decoration-style
    text-decoration-thickness
   */
  textDecoration: "textDecoration",
  // textOverflow: "textOverflow",

  flexDirection: "flexDirection",
  flexGrow: "flexGrow",
  flexWrap: "flexWrap",
  flexShrink: "flexShrink",
  justifyContent: "justifyContent",
  alignSelf: "alignSelf",
  alignItems: "alignItems",
  alignContent: "alignContent",
} as const;

export const kNodeDisplayOptions = {
  grid: "grid",
  block: "block",
  inlineBlock: "inline-block",
  flex: "flex",
  inlineFlex: "inline-flex",
} as const;

export const kNodeFourSidedOptions = {
  one: "one",
  two: "two",
  four: "four",
} as const;

export const kNodeBorderStyleOptions = {
  solid: "solid",
  dashed: "dashed",
} as const;

export const kNodePositionOptions = {
  static: "static",
  relative: "relative",
  absolute: "absolute",
  fixed: "fixed",
  sticky: "sticky",
} as const;

export const kNodeOverflowOptions = {
  auto: "auto",
  visible: "visible",
  hidden: "hidden",
  clip: "clip",
  scroll: "scroll",
} as const;

export const kNodeWhitespaceOptions = {
  normal: "normal",
  noWrap: "no-wrap",
  pre: "pre",
  preWrap: "pre-wrap",
  preLine: "pre-line",
  breakSpaces: "break-spaces",
} as const;

export const kNodeBoxSizingOptions = {
  borderBox: "border-box",
  contentBox: "content-box",
} as const;

export const kNodeVerticalAlignOptions = {
  baseline: "baseline",
  top: "top",
  middle: "middle",
  bottom: "bottom",
  sub: "sub",
  textTop: "text-top",
} as const;

export const kNodeTextAlignOptions = {
  start: "start",
  end: "end",
  center: "center",
  justify: "justify",
} as const;

export const kNodeTextDecorationOptions = {
  underline: "underline",
  overline: "overline",
  none: "none",
} as const;

export const kNodeFlexDirectionOptions = {
  row: "row",
  column: "column",
} as const;

export const kNodeFlexWrapOptions = {
  nowrap: "nowrap",
  wrap: "wrap",
  wrapReverse: "wrap-reverse",
} as const;

export const kNodeJustifyContentOptions = {
  start: "start",
  center: "center",
  end: "end",
  spaceBetween: "space-between",
  spaceAround: "space-around",
  spaceEvenly: "space-evenly",
  stretch: "stretch",
} as const;

export const kNodeAlignSelfOptions = {
  auto: "auto",
  flexStart: "flex-start",
  flexEnd: "flex-end",
  center: "center",
  baseline: "baseline",
  stretch: "stretch",
} as const;

export const kNodeAlignItemsOptions = {
  stretch: "stretch",
  center: "center",
  baseline: "baseline",
  firstBaseline: "first-baseline",
  lastBaseline: "last-baseline",
  start: "start",
  end: "end",
} as const;

export const kNodeAlignContentOptions = {
  center: "center",
  spaceBetween: "space-between",
  spaceAround: "space-around",
  spaceEvenly: "space-evenly",
  stretch: "stretch",
  start: "start",
  end: "end",
  baseline: "baseline",
  firstBaseline: "first-baseline",
  lastBaseline: "last-baseline",
} as const;
