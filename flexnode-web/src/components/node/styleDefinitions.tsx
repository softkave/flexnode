import { merge } from "lodash";
import {
  StyleInputController,
  StyleInputType,
  kNodeAlignContentOptions,
  kNodeAlignItemsOptions,
  kNodeAlignSelfOptions,
  kNodeBorderStyleOptions,
  kNodeBoxSizingOptions,
  kNodeDisplayOptions,
  kNodeFlexDirectionOptions,
  kNodeFlexWrapOptions,
  kNodeFourSidedOptions,
  kNodeJustifyContentOptions,
  kNodeOverflowOptions,
  kNodePositionOptions,
  kNodeStyleKeys,
  kNodeTextAlignOptions,
  kNodeTextDecorationOptions,
  kNodeVerticalAlignOptions,
  kNodeWhitespaceOptions,
} from "./types";

const display: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.display,
  label: "Display",
  options: [
    { value: kNodeDisplayOptions.grid, label: "Grid" },
    { value: kNodeDisplayOptions.block, label: "Block" },
    { value: kNodeDisplayOptions.inlineBlock, label: "Inline block" },
    { value: kNodeDisplayOptions.flex, label: "Flex" },
    { value: kNodeDisplayOptions.inlineFlex, label: "Inline flex" },
  ],
};

const marginType: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.marginType,
  label: "Margin type",
  options: [
    { value: kNodeFourSidedOptions.one, label: "Singular" },
    { value: kNodeFourSidedOptions.two, label: "Two sides" },
    { value: kNodeFourSidedOptions.four, label: "Four sides" },
  ],
  col(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.one
    ) {
      return { span: 18 };
    } else {
      return { span: 24 };
    }
  },
};

const marginTop: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.marginTop,
  col(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.two
    ) {
      return { span: 12 };
    } else {
      return { span: 6 };
    }
  },
  placeholder(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.four
    ) {
      return "margin";
    } else if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.two
    ) {
      return "margin vertical";
    } else {
      return "top";
    }
  },
  setValue(input, controller, value) {
    if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.four
    ) {
      controller.setValues({
        [kNodeStyleKeys.marginTop]: value,
        [kNodeStyleKeys.marginRight]: value,
        [kNodeStyleKeys.marginBottom]: value,
        [kNodeStyleKeys.marginLeft]: value,
      });
    } else if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.two
    ) {
      controller.setValues({
        [kNodeStyleKeys.marginTop]: value,
        [kNodeStyleKeys.marginBottom]: value,
      });
    } else if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.four
    ) {
      controller.setValues({
        [kNodeStyleKeys.marginTop]: value,
      });
    }
  },
  hidden(input, controller) {
    if (controller.getValue(kNodeStyleKeys.marginType) === undefined) {
      return true;
    } else {
      return false;
    }
  },
};

const marginRight: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.marginTop,
  col(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.two
    ) {
      return { span: 12 };
    } else {
      return { span: 6 };
    }
  },
  placeholder(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.two
    ) {
      return "margin horizontal";
    } else {
      return "right";
    }
  },
  setValue(input, controller, value) {
    if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.two
    ) {
      controller.setValues({
        [kNodeStyleKeys.marginRight]: value,
        [kNodeStyleKeys.marginLeft]: value,
      });
    } else if (
      controller.getValue(kNodeStyleKeys.marginType) ===
      kNodeFourSidedOptions.four
    ) {
      controller.setValues({
        [kNodeStyleKeys.marginRight]: value,
      });
    }
  },
  hidden(input, controller) {
    if (controller.getValue(kNodeStyleKeys.marginType) === undefined) {
      return true;
    } else {
      return false;
    }
  },
};

const marginBottom: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.marginBottom,
  col: { span: 6 },
  placeholder: "bottom",
  hidden(input, controller) {
    if (controller.getValue(kNodeStyleKeys.marginType) === undefined) {
      return true;
    } else {
      return false;
    }
  },
};

const marginLeft: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.marginLeft,
  col: { span: 6 },
  placeholder: "left",
  hidden(input, controller) {
    if (controller.getValue(kNodeStyleKeys.marginType) === undefined) {
      return true;
    } else {
      return false;
    }
  },
};

const paddingType: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.paddingType,
  label: "Margin type",
  options: [
    { value: kNodeFourSidedOptions.one, label: "Singular" },
    { value: kNodeFourSidedOptions.two, label: "Two sides" },
    { value: kNodeFourSidedOptions.four, label: "Four sides" },
  ],
  col(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.one
    ) {
      return { span: 18 };
    } else {
      return { span: 24 };
    }
  },
};

const paddingTop: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.paddingTop,
  col(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.two
    ) {
      return { span: 12 };
    } else {
      return { span: 6 };
    }
  },
  placeholder(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.four
    ) {
      return "padding";
    } else if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.two
    ) {
      return "padding vertical";
    } else {
      return "top";
    }
  },
  setValue(input, controller, value) {
    if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.four
    ) {
      controller.setValues({
        [kNodeStyleKeys.paddingTop]: value,
        [kNodeStyleKeys.paddingRight]: value,
        [kNodeStyleKeys.paddingBottom]: value,
        [kNodeStyleKeys.paddingLeft]: value,
      });
    } else if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.two
    ) {
      controller.setValues({
        [kNodeStyleKeys.paddingTop]: value,
        [kNodeStyleKeys.paddingBottom]: value,
      });
    } else if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.four
    ) {
      controller.setValues({
        [kNodeStyleKeys.paddingTop]: value,
      });
    }
  },
  hidden(input, controller) {
    if (controller.getValue(kNodeStyleKeys.paddingType) === undefined) {
      return true;
    } else {
      return false;
    }
  },
};

const paddingRight: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.paddingTop,
  col(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.two
    ) {
      return { span: 12 };
    } else {
      return { span: 6 };
    }
  },
  placeholder(input, controller) {
    if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.two
    ) {
      return "padding horizontal";
    } else {
      return "right";
    }
  },
  setValue(input, controller, value) {
    if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.two
    ) {
      controller.setValues({
        [kNodeStyleKeys.paddingRight]: value,
        [kNodeStyleKeys.paddingLeft]: value,
      });
    } else if (
      controller.getValue(kNodeStyleKeys.paddingType) ===
      kNodeFourSidedOptions.four
    ) {
      controller.setValues({
        [kNodeStyleKeys.paddingRight]: value,
      });
    }
  },
  hidden(input, controller) {
    if (controller.getValue(kNodeStyleKeys.paddingType) === undefined) {
      return true;
    } else {
      return false;
    }
  },
};

const paddingBottom: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.paddingBottom,
  col: { span: 6 },
  placeholder: "bottom",
  hidden(input, controller) {
    if (controller.getValue(kNodeStyleKeys.paddingType) === undefined) {
      return true;
    } else {
      return false;
    }
  },
};

const paddingLeft: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.paddingLeft,
  col: { span: 6 },
  placeholder: "left",
  hidden(input, controller) {
    if (controller.getValue(kNodeStyleKeys.paddingType) === undefined) {
      return true;
    } else {
      return false;
    }
  },
};

const borderType: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.borderType,
  label: "Margin type",
  options: [
    { value: kNodeFourSidedOptions.one, label: "Singular" },
    { value: kNodeFourSidedOptions.two, label: "Two sides" },
    { value: kNodeFourSidedOptions.four, label: "Four sides" },
  ],
};

function constructBorderStyle(
  side: "top" | "right" | "bottom" | "left",
  other: Partial<StyleInputType> = {}
): StyleInputType {
  const borderStyle: StyleInputType = {
    type: "select",
    col: { span: 12 },
    options: [
      { value: kNodeBorderStyleOptions.solid, label: "Solid" },
      { value: kNodeBorderStyleOptions.dashed, label: "Dashed" },
    ],
    key() {
      if (side === "top") {
        return kNodeStyleKeys.borderTopStyle;
      } else if (side === "right") {
        return kNodeStyleKeys.borderRightStyle;
      } else if (side === "bottom") {
        return kNodeStyleKeys.borderBottomStyle;
      } else {
        return kNodeStyleKeys.borderLeftStyle;
      }
    },
    placeholder(input, controller) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          return "border style";
        } else if (borderType === kNodeFourSidedOptions.two) {
          return "style vertical";
        } else {
          return "top style";
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.two) {
          return "style horizontal";
        } else {
          return "right style";
        }
      } else if (side === "bottom") {
        return "bottom style";
      } else {
        return "left style";
      }
    },
    setValue(input, controller, value) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          controller.setValues({
            [kNodeStyleKeys.borderTopStyle]: value,
            [kNodeStyleKeys.borderRightStyle]: value,
            [kNodeStyleKeys.borderBottomStyle]: value,
            [kNodeStyleKeys.borderLeftStyle]: value,
          });
        } else if (borderType === kNodeFourSidedOptions.two) {
          controller.setValues({
            [kNodeStyleKeys.borderTopStyle]: value,
            [kNodeStyleKeys.borderBottomStyle]: value,
          });
        } else {
          controller.setValues({
            [kNodeStyleKeys.borderTopStyle]: value,
          });
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.two) {
          controller.setValues({
            [kNodeStyleKeys.borderRightStyle]: value,
            [kNodeStyleKeys.borderLeftStyle]: value,
          });
        } else {
          controller.setValues({
            [kNodeStyleKeys.borderRightStyle]: value,
          });
        }
      } else if (side === "bottom") {
        controller.setValues({
          [kNodeStyleKeys.borderBottomStyle]: value,
        });
      } else {
        controller.setValues({
          [kNodeStyleKeys.borderLeftStyle]: value,
        });
      }
    },
    hidden(input, controller) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.two) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.four) {
          return false;
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.one) {
        } else if (borderType === kNodeFourSidedOptions.two) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.four) {
          return false;
        }
      } else if (
        side === "bottom" &&
        borderType === kNodeFourSidedOptions.four
      ) {
        return false;
      } else if (side === "left" && borderType === kNodeFourSidedOptions.four) {
        return false;
      }

      return true;
    },
  };
  return merge(borderStyle, other);
}

const borderTopStyle = constructBorderStyle("top");
const borderRightStyle = constructBorderStyle("right");
const borderBottomStyle = constructBorderStyle("bottom");
const borderLeftStyle = constructBorderStyle("left");

function constructBorderWidth(
  side: "top" | "right" | "bottom" | "left",
  other: Partial<StyleInputType> = {}
): StyleInputType {
  const borderWidth: StyleInputType = {
    type: "number",
    col: { span: 6 },
    key() {
      if (side === "top") {
        return kNodeStyleKeys.borderTopWidth;
      } else if (side === "right") {
        return kNodeStyleKeys.borderRightWidth;
      } else if (side === "bottom") {
        return kNodeStyleKeys.borderBottomWidth;
      } else {
        return kNodeStyleKeys.borderLeftWidth;
      }
    },
    placeholder(input, controller) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          return "width";
        } else if (borderType === kNodeFourSidedOptions.two) {
          return "vertical";
        } else {
          return "top";
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.two) {
          return "horizontal";
        } else {
          return "right";
        }
      } else if (side === "bottom") {
        return "bottom";
      } else {
        return "left";
      }
    },
    setValue(input, controller, value) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          controller.setValues({
            [kNodeStyleKeys.borderTopWidth]: value,
            [kNodeStyleKeys.borderRightWidth]: value,
            [kNodeStyleKeys.borderBottomWidth]: value,
            [kNodeStyleKeys.borderLeftWidth]: value,
          });
        } else if (borderType === kNodeFourSidedOptions.two) {
          controller.setValues({
            [kNodeStyleKeys.borderTopWidth]: value,
            [kNodeStyleKeys.borderBottomWidth]: value,
          });
        } else {
          controller.setValues({
            [kNodeStyleKeys.borderTopWidth]: value,
          });
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.two) {
          controller.setValues({
            [kNodeStyleKeys.borderRightWidth]: value,
            [kNodeStyleKeys.borderLeftWidth]: value,
          });
        } else {
          controller.setValues({
            [kNodeStyleKeys.borderRightWidth]: value,
          });
        }
      } else if (side === "bottom") {
        controller.setValues({
          [kNodeStyleKeys.borderBottomWidth]: value,
        });
      } else {
        controller.setValues({
          [kNodeStyleKeys.borderLeftWidth]: value,
        });
      }
    },
    hidden(input, controller) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.two) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.four) {
          return false;
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.one) {
        } else if (borderType === kNodeFourSidedOptions.two) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.four) {
          return false;
        }
      } else if (
        side === "bottom" &&
        borderType === kNodeFourSidedOptions.four
      ) {
        return false;
      } else if (side === "left" && borderType === kNodeFourSidedOptions.four) {
        return false;
      }

      return true;
    },
  };
  return merge(borderWidth, other);
}

const borderTopWidth = constructBorderWidth("top");
const borderRightWidth = constructBorderWidth("right");
const borderBottomWidth = constructBorderWidth("bottom");
const borderLeftWidth = constructBorderWidth("left");

function constructBorderColor(
  side: "top" | "right" | "bottom" | "left",
  other: Partial<StyleInputType> = {}
): StyleInputType {
  const borderColor: StyleInputType = {
    type: "color",
    col: { span: 6 },
    key() {
      if (side === "top") {
        return kNodeStyleKeys.borderTopColor;
      } else if (side === "right") {
        return kNodeStyleKeys.borderRightColor;
      } else if (side === "bottom") {
        return kNodeStyleKeys.borderBottomColor;
      } else {
        return kNodeStyleKeys.borderLeftColor;
      }
    },
    setValue(input, controller, value) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          controller.setValues({
            [kNodeStyleKeys.borderTopColor]: value,
            [kNodeStyleKeys.borderRightColor]: value,
            [kNodeStyleKeys.borderBottomColor]: value,
            [kNodeStyleKeys.borderLeftColor]: value,
          });
        } else if (borderType === kNodeFourSidedOptions.two) {
          controller.setValues({
            [kNodeStyleKeys.borderTopColor]: value,
            [kNodeStyleKeys.borderBottomColor]: value,
          });
        } else {
          controller.setValues({
            [kNodeStyleKeys.borderTopColor]: value,
          });
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.two) {
          controller.setValues({
            [kNodeStyleKeys.borderRightColor]: value,
            [kNodeStyleKeys.borderLeftColor]: value,
          });
        } else {
          controller.setValues({
            [kNodeStyleKeys.borderRightColor]: value,
          });
        }
      } else if (side === "bottom") {
        controller.setValues({
          [kNodeStyleKeys.borderBottomColor]: value,
        });
      } else {
        controller.setValues({
          [kNodeStyleKeys.borderLeftColor]: value,
        });
      }
    },
    hidden(input, controller) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.two) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.four) {
          return false;
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.one) {
        } else if (borderType === kNodeFourSidedOptions.two) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.four) {
          return false;
        }
      } else if (
        side === "bottom" &&
        borderType === kNodeFourSidedOptions.four
      ) {
        return false;
      } else if (side === "left" && borderType === kNodeFourSidedOptions.four) {
        return false;
      }

      return true;
    },
  };
  return merge(borderColor, other);
}

const borderTopColor = constructBorderColor("top");
const borderRightColor = constructBorderColor("right");
const borderBottomColor = constructBorderColor("bottom");
const borderLeftColor = constructBorderColor("left");

function constructBorderRadius(
  side: "top" | "right" | "bottom" | "left",
  other: Partial<StyleInputType> = {}
): StyleInputType {
  const borderRadius: StyleInputType = {
    type: "number",
    col: { span: 6 },
    key() {
      if (side === "top") {
        return kNodeStyleKeys.borderTopRadius;
      } else if (side === "right") {
        return kNodeStyleKeys.borderRightRadius;
      } else if (side === "bottom") {
        return kNodeStyleKeys.borderBottomRadius;
      } else {
        return kNodeStyleKeys.borderLeftRadius;
      }
    },
    placeholder(input, controller) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          return "border radius";
        } else if (borderType === kNodeFourSidedOptions.two) {
          return "vertical";
        } else {
          return "top";
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.two) {
          return "horizontal";
        } else {
          return "right";
        }
      } else if (side === "bottom") {
        return "bottom";
      } else {
        return "left";
      }
    },
    setValue(input, controller, value) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          controller.setValues({
            [kNodeStyleKeys.borderTopRadius]: value,
            [kNodeStyleKeys.borderRightRadius]: value,
            [kNodeStyleKeys.borderBottomRadius]: value,
            [kNodeStyleKeys.borderLeftRadius]: value,
          });
        } else if (borderType === kNodeFourSidedOptions.two) {
          controller.setValues({
            [kNodeStyleKeys.borderTopRadius]: value,
            [kNodeStyleKeys.borderBottomRadius]: value,
          });
        } else {
          controller.setValues({
            [kNodeStyleKeys.borderTopRadius]: value,
          });
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.two) {
          controller.setValues({
            [kNodeStyleKeys.borderRightRadius]: value,
            [kNodeStyleKeys.borderLeftRadius]: value,
          });
        } else {
          controller.setValues({
            [kNodeStyleKeys.borderRightRadius]: value,
          });
        }
      } else if (side === "bottom") {
        controller.setValues({
          [kNodeStyleKeys.borderBottomRadius]: value,
        });
      } else {
        controller.setValues({
          [kNodeStyleKeys.borderLeftRadius]: value,
        });
      }
    },
    hidden(input, controller) {
      const borderType = controller.getValue(kNodeStyleKeys.borderType);

      if (side === "top") {
        if (borderType === kNodeFourSidedOptions.one) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.two) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.four) {
          return false;
        }
      } else if (side === "right") {
        if (borderType === kNodeFourSidedOptions.one) {
        } else if (borderType === kNodeFourSidedOptions.two) {
          return false;
        } else if (borderType === kNodeFourSidedOptions.four) {
          return false;
        }
      } else if (
        side === "bottom" &&
        borderType === kNodeFourSidedOptions.four
      ) {
        return false;
      } else if (side === "left" && borderType === kNodeFourSidedOptions.four) {
        return false;
      }

      return true;
    },
  };
  return merge(borderRadius, other);
}

const borderTopRadius = constructBorderRadius("top");
const borderRightRadius = constructBorderRadius("right");
const borderBottomRadius = constructBorderRadius("bottom");
const borderLeftRadius = constructBorderRadius("left");

const position: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.position,
  placeholder: "position",
  options: [
    { value: kNodePositionOptions.static, label: "Static" },
    { value: kNodePositionOptions.relative, label: "Relative" },
    { value: kNodePositionOptions.absolute, label: "Absolute" },
    { value: kNodePositionOptions.fixed, label: "Fixed" },
    { value: kNodePositionOptions.sticky, label: "Sticky" },
  ],
};

const top: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.top,
  placeholder: "top",
  col: { span: 6 },
};

const right: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.right,
  placeholder: "right",
  col: { span: 6 },
};

const bottom: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.bottom,
  placeholder: "bottom",
  col: { span: 6 },
};

const left: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.left,
  placeholder: "left",
  col: { span: 6 },
};

const overflow: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.overflow,
  placeholder: "overflow",
  options: [
    { value: kNodeOverflowOptions.auto, label: "Auto" },
    { value: kNodeOverflowOptions.visible, label: "Visible" },
    { value: kNodeOverflowOptions.hidden, label: "Hidden" },
    { value: kNodeOverflowOptions.clip, label: "Clip" },
    { value: kNodeOverflowOptions.scroll, label: "Scroll" },
  ],
};

const whitespace: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.whitespace,
  placeholder: "whitespace",
  options: [
    { value: kNodeWhitespaceOptions.normal, label: "Normal" },
    { value: kNodeWhitespaceOptions.noWrap, label: "No wrap" },
    { value: kNodeWhitespaceOptions.pre, label: "Pre" },
    { value: kNodeWhitespaceOptions.preWrap, label: "Pre-wrap" },
    { value: kNodeWhitespaceOptions.preLine, label: "Pre-line" },
    { value: kNodeWhitespaceOptions.breakSpaces, label: "Break spaces" },
  ],
};

const zIndex: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.zIndex,
  placeholder: "z-index",
  col: { span: 6 },
};

const color: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.color,
  label: "Color",
  col: { span: 6 },
};

const backgroundColor: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.backgroundColor,
  label: "Background color",
  col: { span: 6 },
};

const boxSizing: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.boxSizing,
  placeholder: "box sizing",
  options: [
    { value: kNodeBoxSizingOptions.borderBox, label: "Border box" },
    { value: kNodeBoxSizingOptions.contentBox, label: "Content box" },
  ],
};

const fontFamily: StyleInputType = {
  type: "text",
  key: kNodeStyleKeys.fontFamily,
  placeholder: "font family",
};

const fontSize: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.fontSize,
  placeholder: "font size",
};

const fontWeight: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.fontWeight,
  placeholder: "font size",
  numProps: { step: "100" },
};

const width: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.width,
  placeholder: "width",
};

const height: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.height,
  placeholder: "height",
};

const columnGap: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.columnGap,
  placeholder: "column gap",
};

const rowGap: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.rowGap,
  placeholder: "row gap",
};

const verticalAlign: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.verticalAlign,
  placeholder: "vertical align",
  options: [
    { value: kNodeVerticalAlignOptions.baseline, label: "Baseline" },
    { value: kNodeVerticalAlignOptions.top, label: "Top" },
    { value: kNodeVerticalAlignOptions.middle, label: "Middle" },
    { value: kNodeVerticalAlignOptions.bottom, label: "Bottom" },
    { value: kNodeVerticalAlignOptions.sub, label: "Sub" },
    { value: kNodeVerticalAlignOptions.textTop, label: "Text top" },
  ],
};

const textAlign: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.textAlign,
  placeholder: "text align",
  options: [
    { value: kNodeTextAlignOptions.start, label: "Start" },
    { value: kNodeTextAlignOptions.end, label: "End" },
    { value: kNodeTextAlignOptions.center, label: "Center" },
    { value: kNodeTextAlignOptions.justify, label: "Justify" },
  ],
};

const textDecoration: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.textDecoration,
  placeholder: "text decoration",
  options: [
    { value: kNodeTextDecorationOptions.underline, label: "Underline" },
    { value: kNodeTextDecorationOptions.overline, label: "Overline" },
    { value: kNodeTextDecorationOptions.none, label: "None" },
  ],
};

const flexItemsHidden: StyleInputType["hidden"] = (
  input: StyleInputType,
  controller: StyleInputController
) => {
  const displayType = controller.getValue(kNodeStyleKeys.display);
  return displayType !== kNodeDisplayOptions.flex;
};

const flexDirection: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.flexDirection,
  placeholder: "flex direction",
  options: [
    { value: kNodeFlexDirectionOptions.row, label: "Row" },
    { value: kNodeFlexDirectionOptions.column, label: "Column" },
  ],
  hidden: flexItemsHidden,
};

const flexGrow: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.flexGrow,
  placeholder: "flex grow",
  hidden: flexItemsHidden,
};

const flexShrink: StyleInputType = {
  type: "number",
  key: kNodeStyleKeys.flexShrink,
  placeholder: "flex shrink",
  hidden: flexItemsHidden,
};

const flexWrap: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.flexWrap,
  placeholder: "flex wrap",
  options: [
    { value: kNodeFlexWrapOptions.nowrap, label: "No wrap" },
    { value: kNodeFlexWrapOptions.wrap, label: "Wrap" },
    { value: kNodeFlexWrapOptions.wrapReverse, label: "Wrap reverse" },
  ],
  hidden: flexItemsHidden,
};

const justifyContent: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.justifyContent,
  placeholder: "justify content",
  options: [
    { value: kNodeJustifyContentOptions.start, label: "Start" },
    { value: kNodeJustifyContentOptions.center, label: "Center" },
    { value: kNodeJustifyContentOptions.end, label: "End" },
    { value: kNodeJustifyContentOptions.spaceBetween, label: "Space between" },
    { value: kNodeJustifyContentOptions.spaceAround, label: "Space around" },
    { value: kNodeJustifyContentOptions.spaceEvenly, label: "Space evenly" },
    { value: kNodeJustifyContentOptions.stretch, label: "Stretch" },
  ],
  hidden: flexItemsHidden,
};

const alignSelf: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.alignSelf,
  placeholder: "align self",
  options: [
    { value: kNodeAlignSelfOptions.auto, label: "Auto" },
    { value: kNodeAlignSelfOptions.flexStart, label: "Flex start" },
    { value: kNodeAlignSelfOptions.flexEnd, label: "Flex end" },
    { value: kNodeAlignSelfOptions.center, label: "Center" },
    { value: kNodeAlignSelfOptions.baseline, label: "Baseline" },
    { value: kNodeAlignSelfOptions.stretch, label: "Stretch" },
  ],
  hidden: flexItemsHidden,
};

const alignItems: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.alignItems,
  placeholder: "align items",
  options: [
    { value: kNodeAlignItemsOptions.start, label: "Start" },
    { value: kNodeAlignItemsOptions.center, label: "Center" },
    { value: kNodeAlignItemsOptions.end, label: "End" },
    { value: kNodeAlignItemsOptions.baseline, label: "Baseline" },
    { value: kNodeAlignItemsOptions.firstBaseline, label: "First baseline" },
    { value: kNodeAlignItemsOptions.lastBaseline, label: "Last baseline" },
    { value: kNodeAlignItemsOptions.stretch, label: "Stretch" },
  ],
  hidden: flexItemsHidden,
};

const alignContent: StyleInputType = {
  type: "select",
  key: kNodeStyleKeys.alignContent,
  placeholder: "align content",
  options: [
    { value: kNodeAlignContentOptions.start, label: "Start" },
    { value: kNodeAlignContentOptions.center, label: "Center" },
    { value: kNodeAlignContentOptions.end, label: "End" },
    { value: kNodeAlignContentOptions.spaceBetween, label: "Space between" },
    { value: kNodeAlignContentOptions.spaceAround, label: "Space around" },
    { value: kNodeAlignContentOptions.spaceEvenly, label: "Space evenly" },
    { value: kNodeAlignContentOptions.stretch, label: "Stretch" },
    { value: kNodeAlignContentOptions.baseline, label: "Baseline" },
    { value: kNodeAlignContentOptions.firstBaseline, label: "First baseline" },
    { value: kNodeAlignContentOptions.lastBaseline, label: "Last baseline" },
  ],
  hidden: flexItemsHidden,
};

export const kNodeStyleDefinitions = {
  display,
  marginType,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  paddingType,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  borderType,
  borderTopStyle,
  borderRightStyle,
  borderBottomStyle,
  borderLeftStyle,
  borderTopWidth,
  borderRightWidth,
  borderBottomWidth,
  borderLeftWidth,
  borderTopColor,
  borderRightColor,
  borderBottomColor,
  borderLeftColor,
  borderTopRadius,
  borderRightRadius,
  borderBottomRadius,
  borderLeftRadius,
  position,
  top,
  right,
  bottom,
  left,
  overflow,
  whitespace,
  zIndex,
  color,
  backgroundColor,
  boxSizing,
  fontFamily,
  fontSize,
  fontWeight,
  width,
  height,
  columnGap,
  rowGap,
  verticalAlign,
  textAlign,
  textDecoration,
  flexDirection,
  flexGrow,
  flexWrap,
  flexShrink,
  justifyContent,
  alignSelf,
  alignItems,
  alignContent,
};
