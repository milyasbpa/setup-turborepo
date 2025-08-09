import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/core/i18n';
import { useLocation } from 'react-router-dom';
import { Environment } from '@/core/config/environment';

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
  siteName,
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
  const currentUrl = url || Environment.getFullUrl(location.pathname);
  const canonicalUrl = canonical || currentUrl;
  
  // Default values with i18n support
  const seoTitle = title || t('seo.defaultTitle', { defaultValue: Environment.appName });
  const seoDescription = description || t('seo.defaultDescription', { 
    defaultValue: Environment.appDescription
  });
  const seoKeywords = keywords || Environment.seoKeywords;
  const seoImage = image || Environment.getFullUrl(Environment.ogImage);
  const seoSiteName = siteName || Environment.siteName;

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
      <meta name="author" content={author || `${Environment.siteName} Team`} />
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
      <meta property="og:image:alt" content={t('seo.imageAlt', { defaultValue: `${Environment.siteName} Preview` })} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={seoSiteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={t('seo.imageAlt', { defaultValue: `${Environment.siteName} Preview` })} />
      <meta name="twitter:site" content={Environment.twitterSite} />
      <meta name="twitter:creator" content={Environment.twitterCreator} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content={Environment.pwaThemeColor} />
      <meta name="msapplication-TileColor" content={Environment.pwaThemeColor} />
      <meta name="application-name" content={seoSiteName} />
      <meta name="apple-mobile-web-app-title" content={seoSiteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color={Environment.pwaThemeColor} />

      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Analytics preconnect if enabled */}
      {Environment.shouldShowAnalytics && Environment.gaMeasurementId && (
        <>
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        </>
      )}

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": seoSiteName,
          "description": seoDescription,
          "url": currentUrl,
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web Browser",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "softwareVersion": "1.0.0",
          "author": {
            "@type": "Organization",
            "name": `${Environment.siteName} Team`
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
