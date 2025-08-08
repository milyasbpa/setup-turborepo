import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/core/i18n';

export interface PageSEOData {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  noIndex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * Hook for managing page-specific SEO data
 */
export const usePageSEO = (defaultData?: Partial<PageSEOData>) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [seoData, setSeoData] = useState<PageSEOData>({
    title: '',
    description: '',
    keywords: '',
    ...defaultData
  });

  // Generate default SEO data based on route
  const generateDefaultSEOData = (): PageSEOData => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentLang = i18n.language;
    
    // Remove language prefix if present
    if (pathSegments[0] === currentLang) {
      pathSegments.shift();
    }

    const pageName = pathSegments[0] || 'home';
    const pageKey = `seo.pages.${pageName}`;

    return {
      title: t(`${pageKey}.title`, { 
        defaultValue: t(`navigation:${pageName}`, { defaultValue: pageName }) 
      }),
      description: t(`${pageKey}.description`, { 
        defaultValue: t('seo.defaultDescription', { 
          defaultValue: 'Modern React application with TypeScript and i18n support' 
        })
      }),
      keywords: t(`${pageKey}.keywords`, { 
        defaultValue: t('seo.defaultKeywords', { 
          defaultValue: 'React, TypeScript, Vite, modern web app' 
        })
      }),
      canonical: `${import.meta.env.VITE_BASE_URL || 'http://localhost:5175'}${location.pathname}`,
      breadcrumbs: generateBreadcrumbs(pathSegments)
    };
  };

  // Generate breadcrumbs from path segments
  const generateBreadcrumbs = (segments: string[]) => {
    const breadcrumbs = [
      { name: t('navigation:home', { defaultValue: 'Home' }), url: '/' }
    ];

    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        name: t(`navigation:${segment}`, { defaultValue: segment }),
        url: currentPath
      });
    });

    return breadcrumbs;
  };

  useEffect(() => {
    const defaultSEO = generateDefaultSEOData();
    setSeoData(prev => ({ ...defaultSEO, ...prev }));
  }, [location.pathname, i18n.language]);

  const updateSEO = (newData: Partial<PageSEOData>) => {
    setSeoData(prev => ({ ...prev, ...newData }));
  };

  return { seoData, updateSEO };
};

/**
 * Hook for tracking page views (for analytics)
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view (integrate with your analytics)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
      });
    }

    // Track for other analytics services
    if (typeof window !== 'undefined' && 'fbq' in window) {
      (window as any).fbq('track', 'PageView');
    }

    // Custom analytics tracking
    console.log(`Page view: ${location.pathname}${location.search}`);
  }, [location]);
};

/**
 * Hook for managing Open Graph images
 */
export const useOpenGraphImages = () => {
  const generateOGImage = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5175';
    
    // You can implement dynamic OG image generation here
    // For now, return static image paths
    const images = {
      default: `${baseUrl}/og-image.png`,
      home: `${baseUrl}/og-home.png`,
      users: `${baseUrl}/og-users.png`,
      about: `${baseUrl}/og-about.png`
    };

    return images.default;
  };

  return { generateOGImage };
};

/**
 * Hook for managing canonical URLs with i18n
 */
export const useCanonicalURL = () => {
  const location = useLocation();

  const getCanonicalURL = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5175';
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
    
    // Always use the default language path for canonical
    return `${baseUrl}${pathWithoutLang || '/'}`;
  };

  const getAlternateURLs = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5175';
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
    
    return {
      'en': `${baseUrl}${pathWithoutLang || '/'}`,
      'id': `${baseUrl}/id${pathWithoutLang || '/'}`,
      'x-default': `${baseUrl}${pathWithoutLang || '/'}`
    };
  };

  return { getCanonicalURL, getAlternateURLs };
};

/**
 * Hook for performance monitoring
 */
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Track basic performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Track page load time
      const loadTime = performance.now();
      console.log(`Page load time: ${loadTime}ms`);

      // Track navigation timing
      if (performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const navigation = navigationEntries[0] as PerformanceNavigationTiming;
          console.log('Navigation timing:', {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            timeToFirstByte: navigation.responseStart - navigation.requestStart,
          });
        }
      }

      // Try to load web-vitals if available
      try {
        // @ts-ignore - Dynamic import for optional performance metrics
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log);
          getFID(console.log);
          getFCP(console.log);
          getLCP(console.log);
          getTTFB(console.log);
        }).catch(() => {
          // Silently fail if web-vitals is not available
        });
      } catch {
        // Silently fail if dynamic import is not supported
      }
    }

    // Track page load time
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart);
    });
  }, []);
};
