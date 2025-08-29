import { Box, BoxExtendedProps } from "grommet";

import { useThemeContext } from "./ThemedApp";

export interface IParameter extends BoxExtendedProps {
  label: string;
  text?: string;
}

export const Parameter = (props: IParameter): JSX.Element => {
  const { constants } = useThemeContext();

  return (
    <Box style={{ ...props.style }}>
      <Box
        style={{
          color: constants.colors.text,
          marginBottom: "13px",
          textTransform: "uppercase",
          ...constants.fontSize.small,
        }}
      >
        {props.label}
      </Box>
      <Box>
        {props.text === undefined ? (
          props.children
        ) : (
          <Box
            style={{
              fontWeight: "500",
              ...constants.fontSize.medium,
            }}
          >
            {props.text}
          </Box>
        )}
      </Box>
    </Box>
  );
};
