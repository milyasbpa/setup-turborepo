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
      <div className={`flex gap-3 ${className}`}>
        {availableLanguages.map((lang, index) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`
              group px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 hover:shadow-xl
              ${currentLanguage === lang.code
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 border-2 border-gray-200 hover:border-indigo-300'
              }
            `}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-center gap-2">
              {showFlags && (
                <span className="text-lg group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">
                  {lang.flag}
                </span>
              )}
              {showNames && (
                <span className="tracking-wide">{lang.name}</span>
              )}
            </div>
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
          className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          {showFlags && (
            <span className="text-lg drop-shadow-sm">{supportedLanguages[currentLanguage].flag}</span>
          )}
          <span className="uppercase font-semibold text-sm tracking-wide">{currentLanguage}</span>
          <svg 
            className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            {/* Backdrop with blur */}
            <div 
              className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Stunning dropdown */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 animate-in slide-in-from-top-2 duration-300">
              {/* Header */}
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('language', { defaultValue: 'Choose Language' })}
                </h3>
              </div>
              
              {/* Language options */}
              <div className="py-1">
                {availableLanguages.map((lang, index) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`
                      group w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3
                      hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-[1.02] hover:shadow-sm
                      ${currentLanguage === lang.code 
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow-inner' 
                        : 'text-gray-700 hover:text-indigo-600'
                      }
                      ${index === 0 ? 'rounded-t-xl' : ''}
                      ${index === availableLanguages.length - 1 ? 'rounded-b-xl' : ''}
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {showFlags && (
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200 drop-shadow-sm">
                        {lang.flag}
                      </span>
                    )}
                    <div className="flex-1">
                      {showNames && (
                        <span className="font-medium">{lang.name}</span>
                      )}
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        {lang.code}
                      </div>
                    </div>
                    {currentLanguage === lang.code && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-xl shadow-lg text-sm font-semibold text-gray-700 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 hover:scale-105"
      >
        {showFlags && (
          <span className="text-xl group-hover:scale-110 transition-transform duration-200 drop-shadow-sm">
            {supportedLanguages[currentLanguage].flag}
          </span>
        )}
        {showNames && (
          <span className="text-indigo-700">{supportedLanguages[currentLanguage].name}</span>
        )}
        <svg 
          className={`w-5 h-5 ml-auto transition-all duration-300 text-indigo-600 group-hover:text-purple-600 ${isOpen ? 'rotate-180 scale-110' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Stunning dropdown */}
          <div className="absolute top-full left-0 mt-3 w-full min-w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-indigo-100 py-3 z-50 animate-in slide-in-from-top-4 duration-500">
            {/* Header with gradient */}
            <div className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 mx-3 rounded-xl mb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a8.233 8.233 0 01-2.592.44 1 1 0 110-2c.468 0 .925-.138 1.315-.395a18.916 18.916 0 01-2.069-4.265c-.148.312-.264.63-.346.957a1 1 0 11-1.96-.397C2.69 4.154 6.432 2 8 2zM12 8a1 1 0 011-1h5a1 1 0 110 2h-5a1 1 0 01-1-1zm-1 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2h-4z" clipRule="evenodd" />
                </svg>
                {t('language', { defaultValue: 'Choose Language' })}
              </h3>
            </div>
            
            {/* Language options */}
            <div className="px-2">
              {availableLanguages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`
                    group w-full px-4 py-4 text-left transition-all duration-300 flex items-center gap-4 rounded-xl mx-1 my-1
                    hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-[1.02] hover:shadow-md
                    ${currentLanguage === lang.code 
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow-lg border-2 border-indigo-200' 
                      : 'text-gray-700 hover:text-indigo-600 border-2 border-transparent'
                    }
                  `}
                  style={{
                    animationDelay: `${index * 75}ms`
                  }}
                >
                  {showFlags && (
                    <span className="text-2xl group-hover:scale-125 transition-all duration-300 drop-shadow-sm">
                      {lang.flag}
                    </span>
                  )}
                  <div className="flex-1">
                    {showNames && (
                      <div className="font-bold text-lg">{lang.name}</div>
                    )}
                    <div className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-1">
                      {lang.code}
                    </div>
                  </div>
                  {currentLanguage === lang.code && (
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
