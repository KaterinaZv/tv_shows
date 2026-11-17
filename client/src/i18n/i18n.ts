import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from './constants';
import en from './locales/en.json';
import ru from './locales/ru.json';

// en.json is the source of truth for keys; ru must contain all of them (plus extra Russian plural forms)
export const resources = {
  en: { translation: en },
  ru: { translation: ru satisfies typeof en },
} as const;

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
});

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'ru',
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    interpolation: {
      // React already escapes rendered values
      escapeValue: false,
    },
  });

export { i18n };
