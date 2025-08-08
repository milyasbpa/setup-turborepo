import React, { useEffect } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  type SupportedLanguage 
} from '../config';

interface I18nRouteWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that handles i18n routing logic
 * Extracts language from URL and sets it in i18next
 */
export const I18nRouteWrapper: React.FC<I18nRouteWrapperProps> = ({ children }) => {
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();
  const { i18n } = useTranslation();

  // Extract language from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const potentialLang = pathSegments[0] as SupportedLanguage;
  
  // Determine current language
  const currentLanguage = lang || 
    (Object.keys(SUPPORTED_LANGUAGES).includes(potentialLang) ? potentialLang : null);

  useEffect(() => {
    if (currentLanguage && Object.keys(SUPPORTED_LANGUAGES).includes(currentLanguage)) {
      // Set language in i18next
      if (i18n.language !== currentLanguage) {
        i18n.changeLanguage(currentLanguage);
      }
    } else {
      // No valid language in URL, use default
      if (i18n.language !== DEFAULT_LANGUAGE) {
        i18n.changeLanguage(DEFAULT_LANGUAGE);
      }
    }
  }, [currentLanguage, i18n]);

  // If we have an invalid language in the URL, redirect to default
  if (lang && !Object.keys(SUPPORTED_LANGUAGES).includes(lang)) {
    const pathWithoutLang = '/' + pathSegments.slice(1).join('/');
    return <Navigate to={pathWithoutLang} replace />;
  }

  return <>{children}</>;
};

interface LocalizedLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
  language?: SupportedLanguage;
}

/**
 * Link component that automatically adds language prefix
 */
export const LocalizedLink: React.FC<LocalizedLinkProps> = ({
  to,
  children,
  className,
  replace,
  language
}) => {
  const location = useLocation();
  
  // Extract current language from URL
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentLang = pathSegments[0] && Object.keys(SUPPORTED_LANGUAGES).includes(pathSegments[0])
    ? pathSegments[0] as SupportedLanguage
    : DEFAULT_LANGUAGE;
  
  const targetLanguage = language || currentLang;
  
  // Build localized URL
  const localizedTo = targetLanguage === DEFAULT_LANGUAGE 
    ? to 
    : `/${targetLanguage}${to}`;

  return (
    <a 
      href={localizedTo} 
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (replace) {
          window.history.replaceState({}, '', localizedTo);
        } else {
          window.history.pushState({}, '', localizedTo);
        }
        // Trigger a popstate event to update the router
        window.dispatchEvent(new PopStateEvent('popstate'));
      }}
    >
      {children}
    </a>
  );
};

export default I18nRouteWrapper;
