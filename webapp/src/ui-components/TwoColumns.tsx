import { Box, BoxExtendedProps, ResponsiveContext } from "grommet";
import { DirectionType } from "grommet/utils";
import React, { ReactNode } from "react";

import { parseCssUnits } from "./utils";

interface ITwoColumns extends BoxExtendedProps {
  widths?: string[];
  gap?: string;
  align?: string;
  force?: boolean;
}

export const TwoColumns = (props: ITwoColumns): JSX.Element => {
  const { force } = props;
  const size = React.useContext(ResponsiveContext);

  const _force = force !== undefined ? force : false;

  const config = ((
    size: string
  ): { direction: string; widths: string[]; pad: string } => {
    const twoColumns = {
      direction: "column",
      widths: ["100%", "100%"],
      pad: "0px",
    };

    let pad = "0px";
    if (props.gap) {
      const gap = parseCssUnits(props.gap);
      pad = `${gap[0] / 2}${gap[1]}`;
    }

    const oneColumn = {
      direction: "row",
      widths: props.widths ? props.widths : ["50%", "50%"],
      pad,
    };
    if (_force) {
      return twoColumns;
    }

    switch (size) {
      case "xsmall":
      case "small":
        return twoColumns;
      case "medium":
      case "large":
        return oneColumn;
      default:
        return twoColumns;
    }
  })(size);

  const children = props.children as ReactNode[];

  return (
    <Box
      fill
      justify="center"
      align={props.align || "start"}
      gap={props.gap}
      style={{
        ...props.style,
      }}
      direction={config.direction as DirectionType}
    >
      {/* Hero Message and subparagraph */}
      <Box style={{ width: config.widths[0], paddingRight: config.pad }}>
        {children[0]}
      </Box>
      <Box style={{ width: config.widths[1], paddingLeft: config.pad }}>
        {children[1]}
      </Box>
    </Box>
  );
};
