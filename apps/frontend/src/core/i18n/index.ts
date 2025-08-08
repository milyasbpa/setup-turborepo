// Core i18n configuration
export { default as i18n, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from './config';
export type { SupportedLanguage } from './config';

// Hooks
export {
  useTranslation,
  useLanguage,
  useLocalizedRoutes,
  useFormatter,
  getBrowserLanguage,
  languageStorage,
} from './hooks';

// Components
export { LanguageSwitcher } from './components/LanguageSwitcher';
export { I18nRouteWrapper, LocalizedLink } from './components/I18nRouteWrapper';

// Re-export react-i18next for convenience
export { Trans, Translation } from 'react-i18next';
