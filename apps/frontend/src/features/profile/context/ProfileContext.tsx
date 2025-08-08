import React, { createContext, useContext, ReactNode } from 'react';
import type { 
  UserProfile, 
  UserStats,
} from '@/core/api';

/**
 * Profile Context Types
 */
interface ProfileContextValue {
  // Profile state
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  
  // Stats state
  stats: UserStats | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // Actions
  refetchProfile: () => void;
  refetchStats: () => void;
}

/**
 * Profile Context
 */
const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * Profile Context Provider Props
 */
interface ProfileProviderProps {
  children: ReactNode;
  value?: ProfileContextValue;
}

/**
 * Profile Context Provider
 * Provides profile-related state and actions to child components
 */
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ 
  children, 
  value: providedValue 
}) => {
  // Default value when no value is provided
  const defaultValue: ProfileContextValue = {
    profile: null,
    profileLoading: false,
    profileError: null,
    
    stats: null,
    statsLoading: false,
    statsError: null,
    
    refetchProfile: () => {},
    refetchStats: () => {},
  };

  const value = providedValue || defaultValue;

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * Hook to use Profile Context
 */
export const useProfile = (): ProfileContextValue => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

/**
 * Hook for profile operations
 */
export const useUserProfile = () => {
  const { profile, profileLoading, profileError, refetchProfile } = useProfile();
  
  return {
    profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  };
};

/**
 * Hook for stats operations
 */
export const useUserStats = () => {
  const { stats, statsLoading, statsError, refetchStats } = useProfile();
  
  return {
    stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  };
};
