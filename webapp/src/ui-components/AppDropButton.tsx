import { Box, DropButton, Text } from "grommet/components";
import { useResponsive } from "./ResponsiveApp";
import { AppButton, AppButtonClickEvent } from ".";
import { useState } from "react";
import { MoreVertical } from "grommet-icons";

export const AppDropButton = (props: {
  options: string[];
  value?: string;
  valueLabel?: (value: string) => string;
  onSelected: (value: string) => void;
  icon?: JSX.Element;
  disabled?: boolean;
}) => {
  const { mobile } = useResponsive();
  const [open, setOpen] = useState(false);

  const onSelected = (e: AppButtonClickEvent, option: string) => {
    e.stopPropagation();
    props.onSelected(option);
    setOpen(false); // Close the dropdown after selection
  };

  return (
    <Box style={{ flexShrink: 0 }}>
      <DropButton
        plain
        disabled={props.disabled}
        dropAlign={{ top: "bottom" }}
        style={{
          height: "42px",
          width: "100%",
        }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
        dropContent={
          <Box style={{ maxHeight: "none" }}>
            {props.options.map((option: string) => {
              return (
                <AppButton
                  plain
                  key={option}
                  onClick={(e) => onSelected(e, option)}
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
        icon={props.icon || <MoreVertical size="20px" />}
      ></DropButton>
    </Box>
  );
};
