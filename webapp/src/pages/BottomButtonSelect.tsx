import { Box, DropButton, Text } from "grommet/components";
import { useResponsive } from "../ui-components/ResponsiveApp";
import { AppButton } from "../ui-components";
import { useState } from "react";
import { useThemeContext } from "../ui-components/ThemedApp";
import { LoadingButton } from "../ui-components/LoadingDiv";

export const BottomButtonSelect = (props: {
  options: string[];
  value?: string;
  valueLabel?: (value: string) => string;
  onChange: (value: number) => void;
  type: "button" | "clean";
  disabled?: boolean;
}) => {
  const { constants } = useThemeContext();
  const { mobile } = useResponsive();
  const [open, setOpen] = useState(false);

  const onSelectChange = (option: string) => {
    props.onChange(props.options.findIndex((o) => o === option) || 0);
    setOpen(false); // Close the dropdown after selection
  };

  const isClean = props.type === "clean";

  if (props.value === undefined) {
    return (
      <Box>
        <LoadingButton height={"42px"}></LoadingButton>
      </Box>
    );
  }

  return (
    <Box style={{ flexShrink: 0 }}>
      <DropButton
        plain
        disabled={props.disabled}
        dropAlign={!isClean ? { bottom: "top" } : { top: "bottom" }}
        style={{
          height: "42px",
          width: "100%",
        }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        dropContent={
          <Box style={{ maxHeight: "none" }}>
            {props.options.map((option: string) => {
              return (
                <AppButton
                  plain
                  key={option}
                  onClick={() => onSelectChange(option)}
                >
                  <Box
                    pad={
                      mobile
                        ? { horizontal: "16px", vertical: "12px" }
                        : { horizontal: "20px", vertical: "14px" }
                    }
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: "16px",
                      }}
                    >
                      {props.valueLabel ? props.valueLabel(option) : option}
                    </Text>
                  </Box>
                </AppButton>
              );
            })}
          </Box>
        }
        primary={!isClean}
        label={
          <Box
            pad={{ horizontal: "16px", vertical: "8px" }}
            style={{ width: "100%" }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: "16px",
                textAlign: "center",
                color: isClean
                  ? constants.colors.textLight
                  : constants.colors.white,
              }}
            >
              {props.valueLabel ? props.valueLabel(props.value) : props.value}
            </Text>
          </Box>
        }
      ></DropButton>
    </Box>
  );
};
