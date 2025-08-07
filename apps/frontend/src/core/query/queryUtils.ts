import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'

/**
 * Common mutation patterns and utilities
 */

export interface MutationOptions<TData = unknown, TError = Error, TVariables = unknown> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: TError, variables: TVariables) => void
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void
}

/**
 * Utility hook for invalidating queries after mutations
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  return {
    // Invalidate all users queries
    invalidateUsers: () => queryClient.invalidateQueries({ 
      queryKey: queryKeys.users() 
    }),
    
    // Invalidate specific user detail
    invalidateUser: (id: string) => queryClient.invalidateQueries({ 
      queryKey: queryKeys.usersDetail(id) 
    }),
    
    // Invalidate all posts queries
    invalidatePosts: () => queryClient.invalidateQueries({ 
      queryKey: queryKeys.posts() 
    }),
    
    // Invalidate all queries (use sparingly)
    invalidateAll: () => queryClient.invalidateQueries({ 
      queryKey: queryKeys.all 
    }),
  }
}

/**
 * Utility hook for removing queries from cache
 */
export function useRemoveQueries() {
  const queryClient = useQueryClient()

  return {
    // Remove user from cache
    removeUser: (id: string) => queryClient.removeQueries({ 
      queryKey: queryKeys.usersDetail(id) 
    }),
    
    // Remove all users queries
    removeUsers: () => queryClient.removeQueries({ 
      queryKey: queryKeys.users() 
    }),
  }
}

/**
 * Utility for optimistic updates
 */
export function useOptimisticUpdate() {
  const queryClient = useQueryClient()

  return {
    // Update user data optimistically
    updateUser: <T>(id: string, updater: (old: T) => T) => {
      queryClient.setQueryData(queryKeys.usersDetail(id), updater)
    },
    
    // Update users list optimistically
    updateUsersList: <T>(filters: Parameters<typeof queryKeys.usersList>[0], updater: (old: T) => T) => {
      queryClient.setQueryData(queryKeys.usersList(filters), updater)
    },
  }
}
