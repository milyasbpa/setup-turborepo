import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/core/i18n';

/**
 * Accessibility announcer for screen readers
 * Announces page changes and important updates
 */
export const AccessibilityAnnouncer = () => {
  const location = useLocation();
  const { t } = useTranslation('navigation');

  useEffect(() => {
    // Announce route changes to screen readers
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const pageName = pathSegments[pathSegments.length - 1] || 'home';
    const pageTitle = t(pageName, { defaultValue: pageName });
    
    // Create announcement
    const announcement = t('pageChanged', { 
      page: pageTitle,
      defaultValue: `Navigated to ${pageTitle} page`
    });

    // Announce after a short delay to ensure content is loaded
    const timer = setTimeout(() => {
      announceToScreenReader(announcement);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, t]);

  return null;
};

/**
 * Announce text to screen readers
 */
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Skip to main content link for keyboard navigation
 */
export const SkipToContent = () => {
  const { t } = useTranslation('common');

  const handleSkipToContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <button
      className="skip-to-content"
      onClick={handleSkipToContent}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSkipToContent();
        }
      }}
    >
      {t('accessibility.skipToContent', { defaultValue: 'Skip to main content' })}
      
      <style>{`
        .skip-to-content {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          z-index: 1000;
          transition: top 0.3s ease;
        }

        .skip-to-content:focus {
          top: 6px;
        }

        .skip-to-content:hover {
          background: #333;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </button>
  );
};

/**
 * Focus management utilities
 */
export const useFocusManagement = () => {
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  const restoreFocus = (element: HTMLElement | null) => {
    return () => {
      if (element && document.contains(element)) {
        element.focus();
      }
    };
  };

  return { trapFocus, restoreFocus };
};

/**
 * Accessible loading indicator
 */
export const AccessibleLoader = ({ message }: { message?: string }) => {
  const { t } = useTranslation('common');
  const loadingText = message || t('loading', { defaultValue: 'Loading...' });

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-label={loadingText}
      className="accessible-loader"
    >
      <div className="loader-spinner" aria-hidden="true" />
      <span className="sr-only">{loadingText}</span>
      
      <style>{`
        .accessible-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
        }

        .loader-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(97, 218, 251, 0.3);
          border-top: 3px solid #61dafb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
