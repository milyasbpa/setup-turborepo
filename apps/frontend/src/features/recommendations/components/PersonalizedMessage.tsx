import React from 'react';
import { useTranslation } from '@/core/i18n';

interface PersonalizedMessageProps {
  message: string;
}

const PersonalizedMessage: React.FC<PersonalizedMessageProps> = ({ message }) => {
  const { t } = useTranslation('recommendations');
  
  return (
    <div className="personalized-message bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            {t('personalizedMessage.title')}
          </h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedMessage;
