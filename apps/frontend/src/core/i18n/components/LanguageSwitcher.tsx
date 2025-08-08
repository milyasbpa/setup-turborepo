import React, { useState } from 'react';
import { useLanguage, useTranslation } from '../hooks';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'minimal';
  showFlags?: boolean;
  showNames?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  showFlags = true,
  showNames = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const { 
    currentLanguage, 
    supportedLanguages, 
    changeLanguage, 
    availableLanguages 
  } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`
              px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${currentLanguage === lang.code
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {showFlags && <span className="mr-1">{lang.flag}</span>}
            {showNames && lang.name}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {showFlags && supportedLanguages[currentLanguage].flag}
          <span className="uppercase font-medium">{currentLanguage}</span>
          <svg 
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                  ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                `}
              >
                {showFlags && <span className="mr-2">{lang.flag}</span>}
                {showNames && lang.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {showFlags && (
          <span className="text-lg">{supportedLanguages[currentLanguage].flag}</span>
        )}
        {showNames && (
          <span>{supportedLanguages[currentLanguage].name}</span>
        )}
        <svg 
          className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t('language')}
            </div>
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3
                  ${currentLanguage === lang.code 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700'
                  }
                `}
              >
                {showFlags && (
                  <span className="text-lg">{lang.flag}</span>
                )}
                <span className="flex-1">
                  {showNames && lang.name}
                </span>
                {currentLanguage === lang.code && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
