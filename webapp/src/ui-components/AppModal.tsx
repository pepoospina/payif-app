import { Box, Layer, LayerExtendedProps } from "grommet";
import React, { useRef } from "react";
import { useOutsideClick } from "./hooks/OutsideClickHook";
import { ClearIcon } from "../app/icons/ClearIcon";
import { AppButton } from "./AppButton";
import { useResponsive } from "../ui-components/ResponsiveApp";

export interface IAppModal extends LayerExtendedProps {
  type?: "small" | "normal";
  layerProps?: LayerExtendedProps;
  windowStyle?: React.CSSProperties;
  onModalClosed?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export const AppModal = (props: IAppModal) => {
  const { mobile } = useResponsive();
  if (!props.children || Array.isArray(props.children)) {
    throw new Error("Modal must have exactly one child");
  }

  const child = React.cloneElement(props.children as React.ReactElement, {
    onSuccess: props.onSuccess,
    onModalClosed: props.onModalClosed,
    onError: props.onError,
  });

  const close = (): void => {
    if (props.onModalClosed) props.onModalClosed();
  };

  const cardRef = useRef<HTMLDivElement>(null);
  useOutsideClick(cardRef, () => close());

  const position = props.position !== undefined ? props.position : "center";
  const size = !mobile
    ? { height: "80vh", width: "90vw" }
    : { height: "100vh", width: "100vw" };

  return (
    <Layer
      {...props.layerProps}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        maxWidth: "700px",
        ...props.style,
      }}
      position={position}
      onEsc={(): void => close()}
      animate={false}
    >
      <Box
        align="center"
        justify="center"
        style={{
          width: "100%",
          flexGrow: 1,
          position: "relative",
          ...props.windowStyle,
        }}
      >
        <Box
          ref={cardRef}
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            boxShadow:
              "0px 6px 15px -2px rgba(16, 24, 40, 0.08), 0px 6px 15px -2px rgba(16, 24, 40, 0.08)",
            flexShrink: "0",
            flexGrow: "1",
            overflow: "auto",
            ...size,
          }}
        >
          <Box style={{ flexShrink: 0 }} fill>
            {child}
          </Box>
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "16px",
              backdropFilter: "blur(4px)",
              borderRadius: "50%",
              height: "32px",
              width: "32px",
            }}
          >
            <AppButton plain onClick={() => close()}>
              <ClearIcon size={28} color="#111827" circle />
            </AppButton>
          </div>
        </Box>
      </Box>
    </Layer>
  );
};
