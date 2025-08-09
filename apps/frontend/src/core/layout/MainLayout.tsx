import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, Calculator, Target } from 'lucide-react';
import { NetworkStatus } from '@/core/pwa';
import { useTranslation, useLocalizedRoutes, LanguageSwitcher } from '@/core/i18n';
import { SkipToContent, AccessibilityAnnouncer } from '@/core/seo';

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
    { path: routes.lessons, label: t('lessons', { defaultValue: 'Lessons' }), icon: BookOpen },
    { path: routes.recommendations, label: t('recommendations', { defaultValue: 'Recommendations' }), icon: Target },
    { path: routes.profile, label: t('profile', { defaultValue: 'Profile' }), icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Accessibility Features */}
      <SkipToContent />
      <AccessibilityAnnouncer />

      {/* Header with Navigation */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50 w-full" role="banner">
        <div className="w-full max-w-full mx-0 px-3 sm:px-4 lg:px-6 flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <Link to={routes.lessons} className="text-white no-underline">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold m-0 whitespace-nowrap flex items-center gap-2">
                <Calculator className="w-6 h-6 sm:w-7 sm:h-7" />
                MathQuest
              </h1>
            </Link>
          </div>
          
          <nav className="flex-1 flex justify-center min-w-0" role="navigation" aria-label={t('navigation', { defaultValue: 'Main navigation' })}>
            <ul className="flex list-none m-0 p-0 gap-0 sm:gap-1 flex-nowrap justify-center" role="menubar">
              {navigationItems.map((item) => (
                <li key={item.path} role="none">
                  <Link
                    to={item.path}
                    role="menuitem"
                    aria-current={
                      location.pathname === item.path || 
                      location.pathname.endsWith(item.path)
                        ? 'page'
                        : undefined
                    }
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-md text-sm no-underline font-medium transition-all duration-200 relative whitespace-nowrap min-w-0 ${
                      location.pathname === item.path || 
                      location.pathname.endsWith(item.path)
                        ? 'bg-white/20 text-white font-semibold'
                        : 'text-white/90 hover:bg-white/15 hover:text-white hover:-translate-y-0.5'
                    }`}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm min-w-0 overflow-hidden text-ellipsis hidden xs:inline">{item.label}</span>
                    {(location.pathname === item.path || location.pathname.endsWith(item.path)) && (
                      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-yellow-400 rounded-sm"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <LanguageSwitcher variant="minimal" className="text-xs sm:text-sm" />
            <NetworkStatus />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full p-0 bg-gray-50" role="main" aria-label={t('mainContent', { defaultValue: 'Main content' })}>
        <div className="w-full max-w-full mx-0 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 min-h-[calc(100vh-3.5rem-5rem)] sm:min-h-[calc(100vh-4rem-5rem)]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-4 sm:py-6 mt-auto w-full" role="contentinfo">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex flex-col sm:flex-row justify-between items-center flex-wrap gap-2 sm:gap-4">
          <p className="text-sm text-center sm:text-left">{t('footer.copyright')}</p>
          <div className="flex gap-3 sm:gap-6 justify-center">
            <a 
              href="http://localhost:3001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 no-underline text-sm transition-colors duration-200 hover:text-gray-100"
            >
              Backend API
            </a>
            <a 
              href="http://localhost:3001/api/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 no-underline text-sm transition-colors duration-200 hover:text-gray-100"
            >
              Health Check
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
