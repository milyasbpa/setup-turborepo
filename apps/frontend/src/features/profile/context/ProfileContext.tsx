import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profileService, QUERY_KEYS } from '@/core/api';
import type { 
  UserProfile, 
  UserStats,
} from '@/core/api';

/**
 * Profile Context Types
 */
interface ProfileContextType {
  profileQuery: {
    data: UserProfile | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  statsQuery: {
    data: UserStats | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  actions: {
    // Add any profile specific actions here in the future
  };
}

/**
 * Profile Context
 */
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

/**
 * Profile Context Provider Props
 */
interface ProfileProviderProps {
  children: ReactNode;
  userId?: number;
}

/**
 * Profile Context Provider
 * Provides profile-related state and actions to child components
 * Follows the same pattern as LessonsContext and LessonsDetailContext
 */
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ 
  children, 
  userId = 1 
}) => {
  // React Query for profile data
  const profileQuery = useQuery({
    queryKey: [...QUERY_KEYS.PROFILE, userId],
    queryFn: () => profileService.getUserProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // React Query for stats data
  const statsQuery = useQuery({
    queryKey: [...QUERY_KEYS.PROFILE_STATS, userId],
    queryFn: () => profileService.getUserStats(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const actions = useMemo(() => ({
    // Add profile specific actions here in the future
  }), []);

  const contextValue = useMemo(() => ({
    profileQuery: {
      data: profileQuery.data,
      isLoading: profileQuery.isLoading,
      error: profileQuery.error,
      refetch: profileQuery.refetch,
    },
    statsQuery: {
      data: statsQuery.data,
      isLoading: statsQuery.isLoading,
      error: statsQuery.error,
      refetch: statsQuery.refetch,
    },
    actions,
  }), [
    profileQuery.data, profileQuery.isLoading, profileQuery.error, profileQuery.refetch,
    statsQuery.data, statsQuery.isLoading, statsQuery.error, statsQuery.refetch,
    actions
  ]);

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * Hook to use Profile Context
 */
export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

/**
 * Hook for profile operations
 * Provides convenient access to profile data
 */
export const useUserProfile = () => {
  const { profileQuery } = useProfile();
  
  return {
    profile: profileQuery.data || null,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
  };
};

/**
 * Hook for stats operations
 * Provides convenient access to stats data
 */
export const useUserStats = () => {
  const { statsQuery } = useProfile();
  
  return {
    stats: statsQuery.data || null,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  };
};
