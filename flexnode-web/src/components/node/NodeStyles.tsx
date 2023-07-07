import { Typography } from "antd";
import { merge } from "lodash";
import React from "react";
import { kNodeStyleDefinitions } from "./styleDefinitions";
import { StyleInputController, StyleInputType } from "./types";

export interface INodeStylesProps {
  styles: Record<string, any>;
  onChange: (styles: Record<string, any>) => void;
}

/**
 * display - block, inline-block, flex, inline-flex, grid
 * margin, padding, border, position, vertical-align, top, right, bottom, left,
 * overflow, whitespace, width, height, z-index, word-break, direction, cursor,
 * outline, color, background, text-align, text-decoration, text-indent,
 * text-overflow, text-shadow, text-transform, box-sizing, box-shadow,
 * font-family, font-size, font-weight
 *
 * transform, animation, scroll, mask, media queries
 * [MDN styles reference](https://developer.mozilla.org/en-US/docs/Web/CSS/mask)
 */

const inputs: StyleInputType[] = [
  kNodeStyleDefinitions.display,
  kNodeStyleDefinitions.marginType,
  kNodeStyleDefinitions.marginTop,
  kNodeStyleDefinitions.marginRight,
  kNodeStyleDefinitions.marginBottom,
  kNodeStyleDefinitions.marginLeft,
  kNodeStyleDefinitions.paddingType,
  kNodeStyleDefinitions.paddingTop,
  kNodeStyleDefinitions.paddingRight,
  kNodeStyleDefinitions.paddingBottom,
  kNodeStyleDefinitions.paddingLeft,
  kNodeStyleDefinitions.borderType,
  kNodeStyleDefinitions.borderTopStyle,
  kNodeStyleDefinitions.borderRightStyle,
  kNodeStyleDefinitions.borderBottomStyle,
  kNodeStyleDefinitions.borderLeftStyle,
  kNodeStyleDefinitions.borderTopWidth,
  kNodeStyleDefinitions.borderRightWidth,
  kNodeStyleDefinitions.borderBottomWidth,
  kNodeStyleDefinitions.borderLeftWidth,
  kNodeStyleDefinitions.borderTopColor,
  kNodeStyleDefinitions.borderRightColor,
  kNodeStyleDefinitions.borderBottomColor,
  kNodeStyleDefinitions.borderLeftColor,
  kNodeStyleDefinitions.position,
  kNodeStyleDefinitions.top,
  kNodeStyleDefinitions.right,
  kNodeStyleDefinitions.bottom,
  kNodeStyleDefinitions.left,
  kNodeStyleDefinitions.overflow,
  kNodeStyleDefinitions.whitespace,
  kNodeStyleDefinitions.zIndex,
  kNodeStyleDefinitions.color,
  kNodeStyleDefinitions.backgroundColor,
  kNodeStyleDefinitions.boxSizing,
  kNodeStyleDefinitions.fontFamily,
  kNodeStyleDefinitions.fontSize,
  kNodeStyleDefinitions.fontWeight,
  kNodeStyleDefinitions.borderTopRadius,
  kNodeStyleDefinitions.borderRightRadius,
  kNodeStyleDefinitions.borderBottomRadius,
  kNodeStyleDefinitions.borderLeftRadius,
  kNodeStyleDefinitions.width,
  kNodeStyleDefinitions.height,
  kNodeStyleDefinitions.columnGap,
  kNodeStyleDefinitions.rowGap,
  kNodeStyleDefinitions.verticalAlign,
  kNodeStyleDefinitions.textAlign,
  kNodeStyleDefinitions.textDecoration,
  kNodeStyleDefinitions.flexDirection,
  kNodeStyleDefinitions.flexGrow,
  kNodeStyleDefinitions.flexWrap,
  kNodeStyleDefinitions.flexShrink,
  kNodeStyleDefinitions.justifyContent,
  kNodeStyleDefinitions.alignSelf,
  kNodeStyleDefinitions.alignItems,
  kNodeStyleDefinitions.alignContent,
];

const NodeStyles: React.FC<INodeStylesProps> = (props) => {
  const { styles, onChange } = props;
  const controller: StyleInputController = {
    getValue(key) {
      return styles[key];
    },
    setValues(values) {
      onChange(merge({}, styles, values));
    },
    setValue(key, value) {
      this.setValues({ [key]: value });
    },
  };

  <Typography.Title />;
};

export default NodeStyles;
