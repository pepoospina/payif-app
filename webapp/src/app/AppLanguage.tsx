import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Language, Translations } from "../shared/types/types.payments";
import { tName } from "../shared/utils/translate";

export type AppLanguageType = {
  change: (key: Language) => void;
  tName: (name?: Translations) => string;
  selected: Language;
  hasChosen: boolean;
};

const ThemeContextValue = createContext<AppLanguageType | undefined>(undefined);

/** check language */
export const AppLanguage = (props: PropsWithChildren): JSX.Element => {
  const { i18n } = useTranslation();
  const selected = i18n.language as Language;

  const [hasChosen, setHasChosen] = useState<boolean>(false);

  useEffect(() => {
    const preferred = localStorage.getItem("language");

    if (preferred && preferred !== null) {
      console.log("Setting preferred language", preferred);
      setHasChosen(true);
      i18n.changeLanguage(preferred).catch(console.error);
    } else {
      i18n.changeLanguage(Language.SPA).catch(console.error);
    }
  }, [i18n]);

  const change = (key: Language) => {
    i18n.changeLanguage(key).catch(console.error);
    localStorage.setItem("language", key);
  };

  const _tName = useCallback(
    (name?: Translations) => {
      return name ? tName(name, selected) : "";
    },
    [selected]
  );

  return (
    <ThemeContextValue.Provider
      value={{ change, selected, hasChosen, tName: _tName }}
    >
      {props.children}
    </ThemeContextValue.Provider>
  );
};

export const useAppLanguage = (): AppLanguageType => {
  const context = useContext(ThemeContextValue);
  if (!context)
    throw Error(
      "useAppLanguage can only be used within the AppLanguage component"
    );
  return context;
};
