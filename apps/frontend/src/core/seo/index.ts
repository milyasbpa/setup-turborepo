// SEO Components
export { SEOHead } from './components/SEOHead';
export type { SEOProps } from './components/SEOHead';

export { 
  StructuredData,
  createOrganizationSchema,
  createWebSiteSchema,
  createBreadcrumbSchema,
  createArticleSchema
} from './components/StructuredData';
export type { StructuredDataProps } from './components/StructuredData';

export {
  AccessibilityAnnouncer,
  SkipToContent,
  AccessibleLoader,
  announceToScreenReader,
  useFocusManagement
} from './components/Accessibility';

// SEO Hooks
export {
  usePageSEO,
  usePageTracking,
  useOpenGraphImages,
  useCanonicalURL,
  usePerformanceTracking
} from './hooks/useSEO';
export type { PageSEOData } from './hooks/useSEO';
