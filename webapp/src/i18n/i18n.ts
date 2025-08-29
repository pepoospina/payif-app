import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  GeneralKeys,
  generalValuesCAT,
  generalValuesENG,
  generalValuesSPA,
} from "./i18n.general";
import {
  PayFormKeys,
  payFormValuesENG,
  payFormValuesSPA,
  payFormValuesCAT,
} from "./i18n.pay.form";
import {
  CreatorKeys,
  creatorValuesENG,
  creatorValuesSPA,
  creatorValuesCAT,
} from "./i18n.creator";

export type I18Keys = GeneralKeys | PayFormKeys | CreatorKeys;

export const translationENG: Record<I18Keys, string> = {
  ...generalValuesENG,
  ...payFormValuesENG,
  ...creatorValuesENG,
};

export const translationSPA: Record<I18Keys, string> = {
  ...generalValuesSPA,
  ...payFormValuesSPA,
  ...creatorValuesSPA,
};

export const translationCAT: Record<I18Keys, string> = {
  ...generalValuesCAT,
  ...payFormValuesCAT,
  ...creatorValuesCAT,
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      spa: {
        translation: translationSPA,
      },
      eng: {
        translation: translationENG,
      },
      cat: {
        translation: translationCAT,
      },
    },
    lng: "spa", // default language
    fallbackLng: "spa",

    interpolation: {
      escapeValue: false,
    },
  })
  .catch((e) => {
    console.error("i18n init error", e);
  });

export { i18n };
