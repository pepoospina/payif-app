import { ThemeType, dark, grommet } from "grommet/themes";
import { deepMerge } from "grommet/utils";
import { css, CSSProperties } from "styled-components";

export const theme = {};

export type FontStyle = Pick<
  CSSProperties,
  "fontSize" | "lineHeight" | "fontWeight"
>;

export interface StyleConstants {
  fontSize: {
    large: FontStyle;
    medium: FontStyle;
    small: FontStyle;
    xsmall: FontStyle;
  };
  colors: {
    white: string;
    primary: string;
    textLight: string;
    textLight2: string;
    grayIcon: string;
    shade: string;
    shade2: string;
    links: string;
    text: string;
    textOnPrimary: string;
    border: string;
    checkboxes: string;
    warning: string;
    success: string;
  };
}

export interface ExtendedThemeType extends ThemeType {
  constants: StyleConstants;
}

export const constants: StyleConstants = {
  fontSize: {
    large: {
      fontSize: "18px",
      lineHeight: "24px",
    },
    medium: {
      fontSize: "16px",
      lineHeight: "24px",
    },
    small: {
      fontSize: "14px",
      lineHeight: "20px",
    },
    xsmall: {
      fontSize: "10px",
      lineHeight: "11px",
    },
  },
  colors: {
    white: "#ffffff",
    primary: "#111827",
    textLight: "#4B5563",
    textLight2: "#6B7280",
    grayIcon: "#cbd1db",
    shade: "#F9FAFB",
    shade2: "#F5F5F5",
    text: "#111827",
    links: "#3182CE",
    textOnPrimary: "#ffffff",
    border: "#D1D5DB",
    checkboxes: "#337FBD",
    warning: "#fcb603",
    success: "#10b981",
  },
};

const extension: ExtendedThemeType = {
  constants,
  global: {
    colors: {
      brand: constants.colors.primary,
      text: constants.colors.text,
    },
    font: {
      size: constants.fontSize.medium.fontSize as string,
    },
    input: {
      font: {
        size: constants.fontSize.small.fontSize as string,
      },
    },
    breakpoints: {
      xsmall: {
        value: 700,
      },
      small: {
        value: 900,
      },
      medium: {
        value: 1400,
      },
      large: {},
    },
    focus: {
      border: {
        color: "transparent", // Makes the border transparent
      },
      shadow: "none",
    },
    edgeSize: {
      large: "40px",
      medium: "16px",
      small: "12px",
      xsmall: "8px",
    },
  },
  heading: {
    level: {
      1: {
        font: {
          weight: "600",
        },
        medium: {
          size: "28px",
          height: "36px",
        },
      },
      2: {
        medium: {
          size: "22px",
          height: "28px",
        },
      },
      3: {
        medium: {
          size: "18px",
          height: "24px",
        },
      },
      4: {
        medium: {
          size: "16px",
          height: "18px",
        },
      },
    },
    responsiveBreakpoint: undefined,
    extend: css`
      font-style: normal;
      font-weight: 600;
      letter-spacing: -0.4px;
    `,
  },
  paragraph: {
    small: {
      size: "14px",
      height: "18px",
      maxWidth: "auto",
    },
    medium: {
      size: "16px",
      height: "24px",
      maxWidth: "auto",
    },
  },
  button: {
    padding: { vertical: "15px", horizontal: "30px" },
    border: {
      radius: "8px",
    },
    primary: {
      color: constants.colors.primary,
      extend: css`
        & {
          color: #ffffff;
        }
      `,
    },
    secondary: {},
    elevation: "none",
  },
  formField: {
    checkBox: {
      pad: "small",
    },
    label: {
      weight: 700,
      size: constants.fontSize.small.fontSize as string,
      margin: "0px 0px 8px 0px",
    },
    border: false,
  },
  fileInput: {
    message: {
      size: constants.fontSize.small.fontSize as string,
    },
  },
  select: {
    icons: {
      down: <></>,
    },
    control: {
      extend: css`
        & {
          border-style: none;
          font-style: normal;
          font-weight: 500;
          line-height: 16px; /* 114.286% */
        }
      `,
    },
  },
  textArea: {
    extend: () => {
      return css`
        * {
          padding: 14px 36px;
          border-width: 1px;
          border-style: solid;
          border-color: #8b7d7d;
          border-radius: 24px;
        }
      `;
    },
  },
  textInput: {
    container: {
      extend: () => {
        return css`
          * {
            padding: 14px 36px;
            border-width: 1px;
            border-style: solid;
            border-color: #8b7d7d;
            border-radius: 24px;
          }
        `;
      },
    },
  },
  checkBox: {
    color: constants.colors.textOnPrimary,
    size: "18px",
    icon: {
      size: "16px",
    },
    border: {
      width: "0px",
    },
    toggle: {
      color: constants.colors.textOnPrimary,
    },
    check: {
      extend: css`
        background-color: ${constants.colors.checkboxes};
      `,
    },
  },
  table: {
    header: {
      extend: css`
        & {
          border: none;
        }
      `,
    },
  },
  tip: {
    content: {
      background: "#FFFFFF",
    },
  },
  accordion: {
    icons: {
      color: constants.colors.primary,
    },
    border: false,
    panel: {
      border: false,
    },
  },
  anchor: {},
};

export const lightTheme = deepMerge(grommet, extension);
export const darkTheme = deepMerge(dark, extension);
