import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enHome from './locales/en/home.json';
import enUsers from './locales/en/users.json';

import idCommon from './locales/id/common.json';
import idNavigation from './locales/id/navigation.json';
import idHome from './locales/id/home.json';
import idUsers from './locales/id/users.json';

// Supported languages configuration
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr' as const,
  },
  id: {
    code: 'id',
    name: 'Bahasa Indonesia',
    flag: '🇮🇩',
    dir: 'ltr' as const,
  },
} as const;

export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Translation resources
const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    home: enHome,
    users: enUsers,
  },
  id: {
    common: idCommon,
    navigation: idNavigation,
    home: idHome,
    users: idUsers,
  },
};

// i18n configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: FALLBACK_LANGUAGE,
    defaultNS: 'common',
    debug: import.meta.env.DEV,

    // Language detection options
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Return key if translation is missing
    returnNull: false,
    returnEmptyString: false,

    // Namespace separation
    nsSeparator: ':',
    keySeparator: '.',

    // Save missing translations
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (lng, ns, key) => {
      if (import.meta.env.DEV) {
        console.warn(`Missing translation: ${lng}:${ns}:${key}`);
      }
    },
  });

export default i18n;
