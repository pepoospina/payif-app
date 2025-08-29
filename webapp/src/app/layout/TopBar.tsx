import { Anchor, Box } from "grommet";
import { useNavigate } from "react-router-dom";
import { AbsoluteRoutes } from "../../route.names";
import { ConnectedUser } from "../../user-login/ConnectedUser";
import { LanguageSelector } from "../LanguageSelector";

export const TopBar = () => {
  const navigate = useNavigate();
  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 1) {
      e.preventDefault();
      navigate(AbsoluteRoutes.App);
    }
  };
  return (
    <Box
      direction="row"
      justify="between"
      align="center"
      pad={{ horizontal: "small" }}
    >
      <Box>
        <Anchor onClick={goHome} href={AbsoluteRoutes.App}>
          Cerversera d'Osona
        </Anchor>
      </Box>
      <Box direction="row" gap="small" align="center">
        <LanguageSelector></LanguageSelector>
        <Box margin={{ left: "small" }} style={{ flexShrink: 0 }}>
          <ConnectedUser></ConnectedUser>
        </Box>
      </Box>
    </Box>
  );
};
