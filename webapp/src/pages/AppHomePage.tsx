import { Categories } from "../categories/Categories";
import { ViewportPage } from "../app/layout/Viewport";
import { Box } from "grommet";

export const AppHomePage = () => {
  return (
    <ViewportPage>
      <Box pad={{ vertical: "large", horizontal: "medium" }}>
        <Categories></Categories>
      </Box>
    </ViewportPage>
  );
};
