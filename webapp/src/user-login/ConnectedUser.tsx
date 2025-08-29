import { Box, DropButton, Image, Text } from "grommet";
import { useTranslation } from "react-i18next";

import { GeneralKeys } from "../i18n/i18n.general";
import { AppButton } from "../ui-components";
import { BoxCentered } from "../ui-components/BoxCentered";
import { useResponsive } from "../ui-components/ResponsiveApp";
import { useThemeContext } from "../ui-components/ThemedApp";
import { useAccountContext } from "../user-login/contexts/AccountContext";

export const ConnectedUser = () => {
  const { t } = useTranslation();
  const { constants } = useThemeContext();

  const { mobile } = useResponsive();

  const { connectedUser, signIn, disconnect } = useAccountContext();

  if (!connectedUser) {
    return (
      <Box>
        <AppButton
          onClick={() => signIn()}
          label={t(GeneralKeys.signIn)}
          style={{
            backgroundColor: constants.colors.textOnPrimary,
            height: "28px",
          }}
        ></AppButton>
      </Box>
    );
  }

  const pad = mobile ? "medium" : "small";

  return (
    <DropButton
      plain
      dropAlign={{ top: "bottom" }}
      dropContent={
        <Box>
          <Box direction="column">
            {/* Disconnect Option */}
            <Box
              onClick={() => disconnect()}
              pad={{ vertical: pad, horizontal: pad }}
              hoverIndicator
            >
              <Text>{t(GeneralKeys.disconnect)}</Text>
            </Box>
          </Box>
        </Box>
      }
    >
      <Box direction="row" align="center" gap="small">
        <BoxCentered
          style={{
            height: "60px",
            width: "60px",
            borderRadius: "50%",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            style={{
              height: "32px",
              width: "32px",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Image
              src={
                "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png"
              }
              alt="Profile Image"
              fit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </BoxCentered>
      </Box>
    </DropButton>
  );
};
