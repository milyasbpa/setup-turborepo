import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, routeUtils } from '@/core/router/routes';
import { NetworkStatus } from '@/core/pwa';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that wraps all pages
 * Provides navigation, header, and common page structure
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  const navigationItems = [
    { path: ROUTES.HOME, label: 'Home', icon: '🏠' },
    { path: ROUTES.USERS, label: 'Users', icon: '👥' },
  ];

  return (
    <div className="main-layout">
      {/* Header with Navigation */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo">
            <Link to={ROUTES.HOME}>
              <h1>🚀 Turborepo</h1>
            </Link>
          </div>
          
          <nav className="main-navigation">
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      routeUtils.isCurrentRoute(location.pathname, item.path)
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

          <div className="header-status">
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
          <p>&copy; 2025 Turborepo Frontend. Built with React + TypeScript + Vite</p>
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
