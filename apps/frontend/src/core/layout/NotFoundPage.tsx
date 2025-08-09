import { Link } from 'react-router-dom';
import { useTranslation, useLocalizedRoutes } from '@/core/i18n';

/**
 * 404 Not Found Page Component with i18n support
 * Displayed when user navigates to a route that doesn't exist
 */
const NotFoundPage = () => {
  const { t } = useTranslation('common');
  const { routes } = useLocalizedRoutes();
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-2xl bg-white/10 p-12 rounded-xl backdrop-blur-md mx-4 md:p-8 md:mx-4">
        <div className="text-7xl mb-4 opacity-80 md:text-6xl">🔍</div>
        <h1 className="text-4xl mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent font-bold md:text-3xl">
          {t('notFoundPage.title')}
        </h1>
        <p className="text-lg mb-10 text-gray-300 leading-relaxed">
          {t('notFoundPage.message')}
        </p>
        
        <div className="flex gap-4 justify-center mb-8 flex-wrap md:flex-col md:items-center">
          <Link 
            to={routes.lessons} 
            className="px-6 py-3 bg-cyan-400 text-slate-800 rounded-lg font-medium no-underline transition-all duration-300 inline-flex items-center gap-2 hover:bg-cyan-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 md:w-full md:max-w-xs md:justify-center"
          >
            📚 {t('navigation:lessons', { ns: 'navigation' })}
          </Link>
          <Link 
            to={routes.profile} 
            className="px-6 py-3 bg-transparent text-cyan-400 border-2 border-cyan-400 rounded-lg font-medium no-underline transition-all duration-300 inline-flex items-center gap-2 hover:bg-cyan-400 hover:text-slate-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 md:w-full md:max-w-xs md:justify-center"
          >
            👤 {t('navigation:profile', { ns: 'navigation' })}
          </Link>
        </div>

        <div className="border-t border-cyan-400/20 pt-8 mt-8">
          <h3 className="text-cyan-400 mb-4 text-xl font-medium">
            {t('notFoundPage.popularPages')}
          </h3>
          <ul className="list-none p-0 m-0 flex justify-center gap-8 md:flex-col md:gap-4">
            <li className="m-0">
              <Link 
                to={routes.lessons}
                className="text-gray-300 no-underline py-2 px-4 rounded-md transition-all duration-300 hover:text-cyan-400 hover:bg-cyan-400/10"
              >
                {t('navigation:lessons', { ns: 'navigation' })}
              </Link>
            </li>
            <li className="m-0">
              <Link 
                to={routes.profile}
                className="text-gray-300 no-underline py-2 px-4 rounded-md transition-all duration-300 hover:text-cyan-400 hover:bg-cyan-400/10"
              >
                {t('navigation:profile', { ns: 'navigation' })}
              </Link>
            </li>
            <li className="m-0">
              <Link 
                to={routes.results}
                className="text-gray-300 no-underline py-2 px-4 rounded-md transition-all duration-300 hover:text-cyan-400 hover:bg-cyan-400/10"
              >
                {t('navigation:results', { ns: 'navigation' })}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
