import { Link } from 'react-router-dom';
import { useQuery } from '@/core/query';
import { apiClient, API_ENDPOINTS } from '@/core/api/client';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useTranslation, useLocalizedRoutes } from '@/core/i18n';
import { 
  SEOHead, 
  StructuredData, 
  createWebSiteSchema, 
  createOrganizationSchema,
  usePageTracking,
  usePageSEO
} from '@/core/seo';

interface BackendStatus {
  status: string;
  timestamp: string;
  uptime: number;
}

/**
 * Home Page Component with i18n support
 * Main landing page with app overview and backend status
 * Demonstrates React Query usage and internationalization
 */
const HomePage = () => {
  const { t } = useTranslation('home');
  const { routes } = useLocalizedRoutes();

  // SEO optimization
  const { seoData } = usePageSEO({
    title: t('seo.title', { defaultValue: 'TurboApp - Modern React Application' }),
    description: t('seo.description', { defaultValue: 'Welcome to TurboApp, a modern React application with TypeScript, Vite, and i18n support.' }),
    keywords: t('seo.keywords', { defaultValue: 'React, TypeScript, Vite, modern web app, TurboApp' })
  });
  
  // Track page views
  usePageTracking();

  // Get base URL for structured data
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5175';

  // React Query for backend health check
  const { 
    data: backendData, 
    isLoading: isLoadingHealth,
    error: healthError 
  } = useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<BackendStatus> => {
      const response = await apiClient.get<BackendStatus>(API_ENDPOINTS.HEALTH);
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // React Query for users count (demonstrates reusing existing hooks)
  const { 
    data: users = [], 
    isLoading: isLoadingUsers 
  } = useUsers({
    filters: { limit: 5 }, // Just get first 5 users for count
  });

  const getBackendStatus = () => {
    if (isLoadingHealth) return '⏳ ' + t('loading', { ns: 'common' });
    if (healthError) return '❌ Backend unavailable';
    if (backendData) return `✅ ${backendData.status}`;
    return '❓ Unknown';
  };

  const getUsersStatus = () => {
    if (isLoadingUsers) return '⏳ ' + t('loading', { ns: 'common' });
    return `👥 ${users.length} users loaded`;
  };

  const features = [
    {
      icon: '🏗️',
      title: 'Scalable Architecture',
      description: 'Clean folder structure with core and features separation',
    },
    {
      icon: '🚀',
      title: 'Modern Tech Stack',
      description: 'React 18, TypeScript, Vite, React Router DOM, React Query',
    },
    {
      icon: '🔄',
      title: 'API Integration',
      description: 'Connected to Express.js backend with caching and error handling',
    },
    {
      icon: '🎨',
      title: t('features.responsive.title'),
      description: t('features.responsive.description'),
    },
    {
      icon: '📱',
      title: t('features.pwa.title'),
      description: t('features.pwa.description'),
    },
    {
      icon: '⚡',
      title: t('features.performance.title'),
      description: t('features.performance.description'),
    },
  ];

  return (
    <>
      {/* SEO Head */}
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        type="website"
      />

      {/* Structured Data */}
      <StructuredData {...createOrganizationSchema(baseUrl)} />
      <StructuredData {...createWebSiteSchema(baseUrl)} />

      <div className="home-page" id="main-content" tabIndex={-1}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {t('title')} <span className="gradient-text">TurboApp</span>
          </h1>
          <p className="hero-description">
            {t('description')}
          </p>
          
          <div className="hero-actions">
            <Link to={routes.users} className="cta-button primary">
              👥 {t('cta.viewUsers')}
            </Link>
            <a 
              href="http://localhost:3001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button secondary"
            >
              🔗 Backend API
            </a>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="status-section">
        <h2>System Status</h2>
        <div className="status-cards">
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">🖥️</span>
              <h3>Frontend</h3>
            </div>
            <p className="status-value">✅ Online</p>
            <small>React Development Server</small>
          </div>
          
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">⚡</span>
              <h3>Backend API</h3>
            </div>
            <p className="status-value">{getBackendStatus()}</p>
            {backendData && (
              <small>Uptime: {Math.round(backendData.uptime)}s</small>
            )}
          </div>

          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">📊</span>
              <h3>Data Cache</h3>
            </div>
            <p className="status-value">{getUsersStatus()}</p>
            <small>React Query Cache</small>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>{t('features.title')}</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links-section">
        <h2>Quick Links</h2>
        <div className="links-grid">
          <Link to={routes.users} className="link-card">
            <span className="link-icon">👥</span>
            <div className="link-content">
              <h3>{t('navigation:users')}</h3>
              <p>Browse and manage user accounts</p>
            </div>
          </Link>
          
          <a 
            href="http://localhost:3001/api/health" 
            target="_blank" 
            rel="noopener noreferrer"
            className="link-card"
          >
            <span className="link-icon">🏥</span>
            <div className="link-content">
              <h3>Health Check</h3>
              <p>Monitor backend API status</p>
            </div>
          </a>
          
          <a 
            href="http://localhost:3001/api/users" 
            target="_blank" 
            rel="noopener noreferrer"
            className="link-card"
          >
            <span className="link-icon">📊</span>
            <div className="link-content">
              <h3>Raw API Data</h3>
              <p>View JSON response directly</p>
            </div>
          </a>
        </div>
      </section>

      <style>{`
        .home-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Hero Section */
        .hero-section {
          text-align: center;
          padding: 3rem 0;
          margin-bottom: 3rem;
        }

        .hero-title {
          font-size: 3rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .gradient-text {
          background: linear-gradient(45deg, #61dafb, #98d8c8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.2rem;
          color: #ccc;
          margin-bottom: 2rem;
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cta-button.primary {
          background: #61dafb;
          color: #282c34;
        }

        .cta-button.primary:hover {
          background: #21a1c4;
          transform: translateY(-2px);
        }

        .cta-button.secondary {
          background: transparent;
          color: #61dafb;
          border: 2px solid #61dafb;
        }

        .cta-button.secondary:hover {
          background: #61dafb;
          color: #282c34;
          transform: translateY(-2px);
        }

        /* Status Section */
        .status-section {
          margin-bottom: 3rem;
        }

        .status-section h2 {
          text-align: center;
          color: #61dafb;
          margin-bottom: 2rem;
        }

        .status-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .status-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(97, 218, 251, 0.2);
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .status-icon {
          font-size: 1.5rem;
        }

        .status-header h3 {
          margin: 0;
          color: #61dafb;
        }

        .status-value {
          font-size: 1.1rem;
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }

        .status-card small {
          color: #ccc;
          font-size: 0.9rem;
        }

        /* Features Section */
        .features-section {
          margin-bottom: 3rem;
        }

        .features-section h2 {
          text-align: center;
          color: #61dafb;
          margin-bottom: 2rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(97, 218, 251, 0.2);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          color: #61dafb;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #ccc;
          line-height: 1.6;
        }

        /* Quick Links Section */
        .quick-links-section h2 {
          text-align: center;
          color: #61dafb;
          margin-bottom: 2rem;
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .link-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(97, 218, 251, 0.2);
          transition: all 0.3s ease;
        }

        .link-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(97, 218, 251, 0.4);
        }

        .link-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .link-content h3 {
          margin: 0 0 0.5rem 0;
          color: #61dafb;
        }

        .link-content p {
          margin: 0;
          color: #ccc;
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }

          .status-cards,
          .features-grid,
          .links-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      </div>
    </>
  );
};

export default HomePage;
