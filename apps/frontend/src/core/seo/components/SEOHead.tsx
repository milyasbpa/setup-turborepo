import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/core/i18n';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

/**
 * SEO Head component for managing document head and meta tags
 * Provides comprehensive SEO optimization with i18n support
 */
export const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = 'TurboApp',
  locale,
  alternateLocales = [],
  author,
  publishedTime,
  modifiedTime,
  canonical,
  noIndex = false,
  noFollow = false,
}: SEOProps) => {
  const { i18n, t } = useTranslation('common');
  const location = useLocation();

  // Get current language and locale
  const currentLang = locale || i18n.language;
  const currentLocale = currentLang === 'id' ? 'id_ID' : 'en_US';

  // Build absolute URLs
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5175';
  const currentUrl = url || `${baseUrl}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;
  
  // Default values with i18n support
  const seoTitle = title || t('seo.defaultTitle', { defaultValue: 'TurboApp - Modern React Application' });
  const seoDescription = description || t('seo.defaultDescription', { 
    defaultValue: 'A modern React application built with TypeScript, Vite, and comprehensive i18n support.' 
  });
  const seoKeywords = keywords || t('seo.defaultKeywords', { 
    defaultValue: 'React, TypeScript, Vite, i18n, modern web app, TurboApp' 
  });
  const seoImage = image || `${baseUrl}/og-image.png`;

  // Create robots directive
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1'
  ].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author || 'TurboApp Team'} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Language and Locale */}
      <html lang={currentLang} />
      <meta property="og:locale" content={currentLocale} />
      {alternateLocales.map((altLocale) => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:alt" content={t('seo.imageAlt', { defaultValue: 'TurboApp Preview' })} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={t('seo.imageAlt', { defaultValue: 'TurboApp Preview' })} />
      <meta name="twitter:site" content="@turboapp" />
      <meta name="twitter:creator" content="@turboapp" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#61dafb" />
      <meta name="msapplication-TileColor" content="#61dafb" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#61dafb" />

      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": siteName,
          "description": seoDescription,
          "url": currentUrl,
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web Browser",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "softwareVersion": "1.0.0",
          "author": {
            "@type": "Organization",
            "name": "TurboApp Team"
          },
          "offers": {
            "@type": "Offer",
            "category": "Free"
          },
          "inLanguage": currentLang === 'id' ? 'id-ID' : 'en-US'
        })}
      </script>
    </Helmet>
  );
};
