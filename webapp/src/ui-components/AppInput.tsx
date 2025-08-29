import {
  Box,
  Text,
  TextArea,
  TextAreaExtendedProps,
  TextInput,
  TextInputProps,
} from "grommet";
import React from "react";
import { useThemeContext } from "./ThemedApp";
import { CSSProperties } from "styled-components";
import { constants } from "./themes";

export const FORM_STYLE: CSSProperties = {
  border: "1px solid",
  borderColor: constants.colors.grayIcon,
  borderRadius: "8px",
  boxShadow:
    "0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04)",
  paddingLeft: "16px",
  fontWeight: "normal",
};

export const AppInput = React.forwardRef<
  HTMLInputElement,
  TextInputProps & { textarea?: boolean }
>((props, ref): JSX.Element => {
  const style: CSSProperties = { ...FORM_STYLE };

  if (props.textarea) {
    return (
      <TextArea
        {...(props as TextAreaExtendedProps)}
        style={{ ...style, ...props.style }}
        rows={3}
        resize="vertical"
      ></TextArea>
    );
  }

  return (
    <TextInput
      {...props}
      ref={ref}
      style={{
        ...style,
        height: "40px",
        ...props.style,
      }}
    ></TextInput>
  );
});

export const FormInput = (props: {
  label: string;
  inputProps: TextInputProps;
  textarea?: boolean;
  error?: string;
}) => {
  const { constants } = useThemeContext();
  return (
    <Box margin={{ bottom: "xsmall" }}>
      <Text style={{ ...constants.fontSize.small }}>{props.label}</Text>
      <>
        <AppInput {...props.inputProps} textarea={props.textarea}></AppInput>

        {props.error && (
          <Text
            margin={{ top: "xxsmall", left: "xsmall" }}
            color="status-critical"
            style={{ ...constants.fontSize.xsmall }}
          >
            {props.error}
          </Text>
        )}
      </>
    </Box>
  );
};
