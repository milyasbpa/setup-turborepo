import { Helmet } from 'react-helmet-async';

export interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'BreadcrumbList' | 'Article' | 'Person' | 'Product' | 'Service';
  data: Record<string, any>;
}

/**
 * Structured Data component for adding Schema.org markup
 * Improves search engine understanding and enables rich snippets
 */
export const StructuredData = ({ type, data }: StructuredDataProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

// Predefined structured data configurations
export const createOrganizationSchema = (baseUrl: string) => ({
  type: 'Organization' as const,
  data: {
    name: 'MathLearn',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Interactive mathematics learning platform with personalized lessons and gamified exercises',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@mathlearn.app'
    },
    sameAs: [
      'https://github.com/milyasbpa/mathlearn-platform',
      'https://twitter.com/mathlearn_app'
    ]
  }
});

export const createWebSiteSchema = (baseUrl: string, searchUrl?: string) => ({
  type: 'WebSite' as const,
  data: {
    name: 'MathLearn',
    url: baseUrl,
    description: 'Interactive math learning platform with comprehensive educational features',
    inLanguage: ['en-US', 'id-ID'],
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    })
  }
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  type: 'BreadcrumbList' as const,
  data: {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
});

export const createArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
}) => ({
  type: 'Article' as const,
  data: {
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.imageUrl,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'MathLearn',
      logo: {
        '@type': 'ImageObject',
        url: `${new URL(article.url).origin}/logo.png`
      }
    }
  }
});
