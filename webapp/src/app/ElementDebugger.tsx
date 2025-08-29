import React from "react";
import { Box, Text } from "grommet";

interface ElementCardProps<T extends { id: string }> {
  element?: T;
  title?: string;
}

/**
 * A sample element card component that can be used with ElementsFetcher
 * This component will receive the element data via cloneElement
 */
export const ElementDebugger = <T extends { id: string }>(
  props: ElementCardProps<T>
) => {
  const { element, title = "Element" } = props;

  // When first rendered without an element (as a template), show placeholder
  if (!element) {
    return (
      <Box
        pad="medium"
        background="light-2"
        round="small"
        border={{ color: "light-4", size: "small" }}
      >
        <Text>Loading element...</Text>
      </Box>
    );
  }

  return (
    <Box
      pad="medium"
      background="light-1"
      round="small"
      border={{ color: "brand", size: "small" }}
    >
      <Text weight="bold">{title}</Text>
      <Text margin={{ top: "small" }}>ID: {element.id}</Text>
      <Box margin={{ top: "small" }}>
        {Object.entries(element)
          .filter(([key]) => key !== "id")
          .map(([key, value]) => (
            <Box
              key={key}
              direction="row"
              gap="small"
              margin={{ vertical: "xsmall" }}
            >
              <Text size="small" weight="bold">
                {key}:
              </Text>
              <Text size="small">
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </Text>
            </Box>
          ))}
      </Box>
    </Box>
  );
};
