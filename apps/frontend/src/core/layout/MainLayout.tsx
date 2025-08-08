import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NetworkStatus } from '@/core/pwa';
import { useTranslation, useLocalizedRoutes, LanguageSwitcher } from '@/core/i18n';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that wraps all pages with i18n support
 * Provides navigation, header, and common page structure
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { routes } = useLocalizedRoutes();

  const navigationItems = [
    { path: routes.home, label: t('home'), icon: '🏠' },
    { path: routes.users, label: t('users'), icon: '👥' },
  ];

  return (
    <div className="main-layout">
      {/* Header with Navigation */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo">
            <Link to={routes.home}>
              <h1>🚀 TurboApp</h1>
            </Link>
          </div>
          
          <nav className="main-navigation">
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      location.pathname === item.path || 
                      location.pathname.endsWith(item.path)
                        ? 'active'
                        : ''
                    }`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <LanguageSwitcher variant="minimal" className="mr-4" />
            <NetworkStatus />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <p>{t('footer.copyright')}</p>
          <div className="footer-links">
            <a 
              href="http://localhost:3001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              Backend API
            </a>
            <a 
              href="http://localhost:3001/api/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              Health Check
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
