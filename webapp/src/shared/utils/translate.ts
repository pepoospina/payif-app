import { Language, Translations } from "../types/types.payments";

export const tName = (name: Translations, selected: Language) => {
  let value = name[selected];

  if (!value) {
    value = name[Language.SPA];
  }

  if (!value) {
    value = name[Language.CAT];
  }

  if (value === undefined) {
    throw Error("No translation found");
  }

  return value;
};

export const defaultTrans = (name: string) => {
  return {
    cat: name,
  };
};
