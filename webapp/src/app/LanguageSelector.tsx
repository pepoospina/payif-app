import { Box, DropButton, Image } from "grommet";
import { useState } from "react";

import { useAppLanguage } from "./AppLanguage";
import { BoxCentered } from "../ui-components/BoxCentered";
import { Language } from "../shared/types/types.payments";

export const LanguageValue = (props: {
  lang: Language;
  hideName?: boolean;
}) => {
  const flag = (() => {
    return (
      <Image style={{ width: "24px" }} src={`/icons/${props.lang}.svg`}></Image>
    );
  })();

  return (
    <Box direction="row" align="center" gap="4px">
      <Box>{props.lang.toUpperCase()}</Box>
      {!props.hideName && <Box margin={{ left: "small" }}>{flag}</Box>}
    </Box>
  );
};

export const LanguageSelector = () => {
  const { selected, change } = useAppLanguage();
  const [open, setOpen] = useState(false);

  const changeLanguage = (key: Language) => {
    change(key);
    setOpen(false); // Close the dropdown after selecting a language
  };

  return (
    <DropButton
      plain
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      dropAlign={{ top: "bottom" }}
      dropContent={
        <Box>
          <Box direction="column">
            {Object.values(Language).map((key: Language) => {
              return (
                <Box
                  key={key}
                  onClick={() => changeLanguage(key)}
                  pad={{ vertical: "small", horizontal: "small" }}
                  hoverIndicator
                >
                  <LanguageValue lang={key} />
                </Box>
              );
            })}
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
          <LanguageValue lang={selected} hideName />
        </BoxCentered>
      </Box>
    </DropButton>
  );
};
