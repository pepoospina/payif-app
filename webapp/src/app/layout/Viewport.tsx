import { Anchor, Box, Grid, Text } from "grommet";
import { PropsWithChildren, ReactNode, useState } from "react";

import { AppButton, AppHeading } from "../../ui-components";
import { useThemeContext } from "../../ui-components/ThemedApp";
import { BUILD_ID } from "../config";
import { useResponsive } from "../../ui-components/ResponsiveApp";
import { Categories } from "../../categories/Categories";
import { TopBar } from "./TopBar";
import { CartItems } from "../../cart/Cart";
import { useAccountContext } from "../../user-login/contexts/AccountContext";
import { useLocation, useNavigate } from "react-router-dom";
import { RouteNames } from "../../route.names";
import { CartButton } from "../../cart/CartButton";
import { InstagramIcon } from "../icons/InstagramIcon";
import { EmailIcon } from "../icons/EmailIcon";
import { useTranslation } from "react-i18next";
import { GeneralKeys } from "../../i18n/i18n.general";
import { DraggableSideButton } from "./DraggableSideButton";

export const MAX_BUTTON_WIDTH = 800;
export const HEADING_MARGIN = { bottom: "large" };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ViewportFooter = () => {
  const { constants } = useThemeContext();

  return (
    <Box
      id="footer"
      style={{
        height: "100%",
      }}
      pad="medium"
      justify="center"
      align="center"
    >
      <Box
        direction="row"
        justify="center"
        fill
        align="center"
        gap="small"
        style={{
          position: "relative",
        }}
      >
        <Text style={{ ...constants.fontSize.xsmall }}>
          Cerversera d'Osona 2025
        </Text>
        <Anchor
          href="https://www.instagram.com/cerverseraosona/"
          target="_blank"
        >
          <InstagramIcon size={28}></InstagramIcon>
        </Anchor>
        <Anchor href="mailto:info@cerverseraosona.com" target="_blank">
          <EmailIcon size={24}></EmailIcon>
        </Anchor>
        <Box
          style={{
            position: "absolute",
            right: "0px",
            bottom: "0px",
          }}
        >
          <Text size="6px" color="white">
            Build: {BUILD_ID?.substring(0, 7)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export const ViewportContainer = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <>
      <Box
        id="viewport-container"
        style={{
          height: `calc(100dvh)`,
          width: "100vw",
          overflow: "hidden",
          margin: "0 auto",
          ...props.style,
        }}
      >
        {props.children}
      </Box>
    </>
  );
};

export const ViewportHeadingSmall = (props: { label: ReactNode }) => {
  return (
    <Box justify="center" align="center" pad="medium">
      <Text size="22px" weight="bold">
        {props.label}
      </Text>
    </Box>
  );
};

export const ViewportHeadingLarge = (props: { label: ReactNode }) => {
  return (
    <Box
      justify="center"
      align="center"
      pad="medium"
      style={{ textAlign: "center" }}
    >
      <AppHeading level="1">{props.label}</AppHeading>
    </Box>
  );
};

/**
 * fill the vertical space with a scrollable content area, and leave the bottom
 * fixed to the navigation buttons
 */
export const ViewportPage = (props: PropsWithChildren) => {
  const { mobile } = useResponsive();
  const { connectedUser } = useAccountContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { constants } = useThemeContext();

  const showCart =
    !!connectedUser && !location.pathname.includes(RouteNames.Checkout);

  const showCategories = location.pathname !== "/";

  const [showRight, setShowRight] = useState(false);

  const columns = mobile
    ? ["auto"] // Mobile: 1 column
    : ["0.8fr", "2fr"]; // Desktop: fixed 3 columns

  const rows = mobile ? ["60px", "1fr", "60px"] : ["60px", "1fr", "60px"];

  const areas = mobile
    ? [
        { name: "top", start: [0, 0], end: [0, 0] },
        { name: "content", start: [0, 1], end: [0, 1] },
        { name: "footer", start: [0, 2], end: [0, 2] },
      ]
    : [
        { name: "top", start: [0, 0], end: [1, 0] },
        { name: "left", start: [0, 1], end: [0, 1] },
        { name: "content", start: [1, 1], end: [1, 1] },
        { name: "footer", start: [0, 2], end: [1, 2] },
      ];

  const mobileBar = (
    <Box
      direction="row"
      justify="end"
      align="center"
      wrap
      pad={{ vertical: "8px", horizontal: "8px" }}
      gap="small"
      style={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        width: "fit-content",
      }}
    >
      <AppButton
        label={t(GeneralKeys.back)}
        primary
        onClick={() => navigate(-1)}
      ></AppButton>
      <Categories select></Categories>
    </Box>
  );

  return (
    <Box style={{ position: "relative", height: "100%" }}>
      <Grid
        id="viewport-page"
        style={{ height: "100%" }}
        columns={columns}
        rows={rows}
        areas={areas}
      >
        <Box
          gridArea="top"
          style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          <TopBar></TopBar>
        </Box>

        <Box
          gridArea="content"
          style={{ overflow: "auto" }}
          pad={{
            right: "medium",
            left: mobile ? "medium" : "none",
            top: "medium",
          }}
        >
          <Box
            animation={{
              type: "fadeIn",
              duration: 500,
            }}
            style={{ maxWidth: "600px", flexShrink: 0 }}
          >
            {props.children}
          </Box>

          {showCart && (
            <DraggableSideButton
              onClick={() => setShowRight(!showRight)}
              persistKey="cartButtonPosition"
              defaultPosition={mobile ? window.innerHeight - 300 : 60}
            >
              <AppButton plain>
                <CartButton expanded={showRight}></CartButton>
              </AppButton>
            </DraggableSideButton>
          )}
        </Box>

        {mobile && (
          <>
            <Box
              style={{
                position: "absolute",
                bottom: "80px",
                right: "20px",
              }}
            >
              {mobileBar}
            </Box>
          </>
        )}

        <Box
          gridArea="footer"
          style={{ backgroundColor: constants.colors.white }}
        >
          <ViewportFooter></ViewportFooter>
        </Box>

        {!mobile && (
          <>
            <Box gridArea="left">
              {showCategories && (
                <Box
                  style={{ flexGrow: 1 }}
                  pad={{ vertical: "large", horizontal: "medium" }}
                >
                  <Categories showSelected></Categories>
                </Box>
              )}
            </Box>
          </>
        )}
      </Grid>

      {showCart && (
        <Box
          style={{
            position: "absolute",
            top: "60px",
            right: "0",
            height: "calc(100% - 60px)",
            width: mobile ? "calc(100% - 40px)" : "calc(0.4 * 100%)",
            minWidth: mobile ? "none" : "400px",
            transform: `translateX(${showRight ? "0" : "100%"})`,
            transition: "transform 300ms ease-in-out",
            backgroundColor: "white", // Adjust to match your theme
            overflowY: "auto",
            zIndex: 5,
            boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
            borderLeft: "1px solid rgba(0, 0, 0, 0.05)",
            borderTopLeftRadius: "8px",
          }}
          pad={{ horizontal: "medium", vertical: "medium" }}
        >
          <CartItems direction="column" showGoToCheckout></CartItems>
        </Box>
      )}
    </Box>
  );
};
