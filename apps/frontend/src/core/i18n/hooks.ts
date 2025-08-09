import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  type SupportedLanguage 
} from './config';

/**
 * Enhanced useTranslation hook with i18n routing support
 */
export function useTranslation(namespace?: string) {
  const translation = useI18nTranslation(namespace);
  
  return {
    ...translation,
    // Additional helpers
    formatMessage: (key: string, values?: Record<string, any>) => {
      return translation.t(key, values);
    },
  };
}

/**
 * Hook for managing language and i18n routing
 */
export function useLanguage() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract language from URL path
  const currentLanguage = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (firstSegment && Object.keys(SUPPORTED_LANGUAGES).includes(firstSegment)) {
      return firstSegment as SupportedLanguage;
    }
    
    return DEFAULT_LANGUAGE;
  }, [location.pathname]);

  // Get path without language prefix
  const pathWithoutLanguage = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (firstSegment && Object.keys(SUPPORTED_LANGUAGES).includes(firstSegment)) {
      return '/' + pathSegments.slice(1).join('/');
    }
    
    return location.pathname;
  }, [location.pathname]);

  // Change language and update URL
  const changeLanguage = useCallback((language: SupportedLanguage) => {
    const newPath = language === DEFAULT_LANGUAGE 
      ? pathWithoutLanguage 
      : `/${language}${pathWithoutLanguage}`;
    
    i18n.changeLanguage(language);
    navigate(newPath + location.search + location.hash, { replace: true });
  }, [i18n, navigate, pathWithoutLanguage, location.search, location.hash]);

  // Get localized path for a given route
  const getLocalizedPath = useCallback((path: string, language?: SupportedLanguage) => {
    const lang = language || currentLanguage;
    
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    if (lang === DEFAULT_LANGUAGE) {
      return cleanPath;
    }
    
    return `/${lang}${cleanPath}`;
  }, [currentLanguage]);

  // Check if current language is RTL (currently all supported languages are LTR)
  const isRTL = useMemo(() => {
    return false; // Can be updated when RTL languages are added
  }, []);

  return {
    currentLanguage,
    pathWithoutLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    defaultLanguage: DEFAULT_LANGUAGE,
    isRTL,
    changeLanguage,
    getLocalizedPath,
    availableLanguages: Object.values(SUPPORTED_LANGUAGES),
  };
}

/**
 * Hook for getting localized route utilities
 */
export function useLocalizedRoutes() {
  const { getLocalizedPath, currentLanguage } = useLanguage();
  
  const routes = useMemo(() => ({
    // Math Learning App Routes (Primary)
    lessons: getLocalizedPath('/'),
    lessonDetail: (id: string | number) => getLocalizedPath(`/lessons/${id}`),
    profile: getLocalizedPath('/profile'),
    results: getLocalizedPath('/results'),
    recommendations: getLocalizedPath('/recommendations'),
    
    // Legacy Routes
    home: getLocalizedPath('/home'),
    users: getLocalizedPath('/users'),
    userDetail: (id: string | number) => getLocalizedPath(`/users/${id}`),
    about: getLocalizedPath('/about'),
    contact: getLocalizedPath('/contact'),
  }), [getLocalizedPath]);

  return {
    routes,
    currentLanguage,
    getLocalizedPath,
  };
}

/**
 * Hook for formatting messages with interpolation
 */
export function useFormatter() {
  const { t } = useTranslation();

  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions) => {
    const { currentLanguage } = useLanguage();
    return new Intl.NumberFormat(currentLanguage, options).format(value);
  }, []);

  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const { currentLanguage } = useLanguage();
    return new Intl.DateTimeFormat(currentLanguage, options).format(new Date(date));
  }, []);

  const formatCurrency = useCallback((value: number, currency = 'USD') => {
    const { currentLanguage } = useLanguage();
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency,
    }).format(value);
  }, []);

  const formatRelativeTime = useCallback((date: Date | string) => {
    const { currentLanguage } = useLanguage();
    const rtf = new Intl.RelativeTimeFormat(currentLanguage, { numeric: 'auto' });
    const diff = new Date(date).getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (Math.abs(days) < 1) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (Math.abs(hours) < 1) {
        const minutes = Math.floor(diff / (1000 * 60));
        return rtf.format(minutes, 'minute');
      }
      return rtf.format(hours, 'hour');
    }
    
    return rtf.format(days, 'day');
  }, []);

  return {
    t,
    formatNumber,
    formatDate,
    formatCurrency,
    formatRelativeTime,
  };
}

/**
 * Get browser language preference
 */
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0];
  return Object.keys(SUPPORTED_LANGUAGES).includes(browserLang) 
    ? browserLang as SupportedLanguage 
    : DEFAULT_LANGUAGE;
}

/**
 * Storage utilities for language preference
 */
export const languageStorage = {
  get: (): SupportedLanguage => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    
    const stored = localStorage.getItem('language');
    return Object.keys(SUPPORTED_LANGUAGES).includes(stored || '') 
      ? stored as SupportedLanguage 
      : DEFAULT_LANGUAGE;
  },
  
  set: (language: SupportedLanguage): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('language', language);
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('language');
  },
};
