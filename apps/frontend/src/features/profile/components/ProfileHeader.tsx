import React from 'react';
import { useTranslation } from '@/core/i18n';
import type { UserProfile } from '@/core/api';
import { Card } from '@/core/components';
import { apiUtils } from '@/core/api';

/**
 * Profile Header Props
 */
interface ProfileHeaderProps {
  profile: UserProfile;
  className?: string;
}

/**
 * Profile Header Component
 * Displays user basic information and overall stats
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  className = '' 
}) => {
  const { t } = useTranslation('profile');
  
  // Calculate progress percentage
  const progressPercentage = profile.totalLessons > 0 
    ? (profile.lessonsCompleted / profile.totalLessons) * 100 
    : 0;

  return (
    <Card className={`${className}`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {profile.username?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.username || 'Anonymous User'}
          </h1>
          <p className="text-gray-600 mb-3">{profile.email}</p>
          
          {/* Key Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-2xl">⚡</span>
              <span className="font-medium">{apiUtils.formatXP(profile.xp)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl">🔥</span>
              <span className="font-medium">{apiUtils.formatStreak(profile.streak.current)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl">📚</span>
              <span className="font-medium">
                {profile.lessonsCompleted} / {profile.totalLessons} lessons
              </span>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="text-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                className="text-blue-600 transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('progress.complete')}</p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Top Section: Avatar and Basic Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-white">
              {profile.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {profile.username || 'Anonymous User'}
            </h1>
            <p className="text-sm text-gray-600 truncate">{profile.email}</p>
          </div>
          {/* Progress Circle - Mobile */}
          <div className="text-center flex-shrink-0">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                  className="text-blue-600 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('progress.complete')}</p>
          </div>
        </div>
        
        {/* Bottom Section: Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-1">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-medium text-gray-900">{apiUtils.formatXP(profile.xp)}</span>
            <span className="text-xs text-gray-500">XP</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-medium text-gray-900">{apiUtils.formatStreak(profile.streak.current)}</span>
            <span className="text-xs text-gray-500">day</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-2xl">📚</span>
            <span className="text-sm font-medium text-gray-900">
              {profile.lessonsCompleted} / {profile.totalLessons}
            </span>
            <span className="text-xs text-gray-500">lessons</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
