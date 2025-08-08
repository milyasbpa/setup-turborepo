import React from 'react';
import type { UserStats } from '@/core/api';
import { Card } from '@/core/components';
import { apiUtils } from '@/core/api';

/**
 * Stats Cards Props
 */
interface StatsCardsProps {
  stats: UserStats;
  className?: string;
}

/**
 * Stats Cards Component
 * Displays detailed statistics in a grid layout
 */
export const StatsCards: React.FC<StatsCardsProps> = ({ 
  stats, 
  className = '' 
}) => {
  const statItems = [
    {
      title: 'Total XP',
      value: apiUtils.formatXP(stats.totalXp),
      icon: '⚡',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Current Streak',
      value: apiUtils.formatStreak(stats.currentStreak),
      icon: '🔥',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Best Streak',
      value: apiUtils.formatStreak(stats.bestStreak),
      icon: '🏆',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Lessons Completed',
      value: `${stats.lessonsCompleted} / ${stats.totalLessons}`,
      icon: '📚',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Score',
      value: `${Math.round(stats.averageScore)}%`,
      icon: '📊',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions.toString(),
      icon: '✅',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {statItems.map((item, index) => (
        <Card key={index} className="text-center">
          <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <span className="text-2xl">{item.icon}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{item.title}</h3>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </Card>
      ))}
    </div>
  );
};
