import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { translation as translationCat } from './translation.cat'
import { translation as translationEng } from './translation.eng'
import { translation as translationSpa } from './translation.spa'

const preferred = localStorage.getItem('language')

i18n.use(initReactI18next).init({
  resources: {
    ENG: {
      translation: translationEng,
    },
    SPA: {
      translation: translationSpa,
    },
    CAT: {
      translation: translationCat,
    },
  },
  lng: preferred && preferred !== null ? preferred : 'ENG', // default language
  fallbackLng: 'ENG',

  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
