import { Box, BoxExtendedProps } from "grommet";
import { useThemeContext } from "./ThemedApp";

export const AppCard = (props: BoxExtendedProps): JSX.Element => {
  const { constants } = useThemeContext();
  return (
    <Box
      style={{ backgroundColor: constants.colors.white, borderRadius: "6px" }}
      pad={{ vertical: "small", horizontal: "medium" }}
      elevation="small"
      {...props}
    ></Box>
  );
};
