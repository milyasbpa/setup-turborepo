/**
 * Query keys factory for consistent and type-safe query key management
 * This helps with cache invalidation and prevents key collisions
 */
export const queryKeys = {
  all: ['app'] as const,
  
  // Users related queries
  users: () => [...queryKeys.all, 'users'] as const,
  usersList: (filters?: { search?: string; page?: number; limit?: number }) => 
    [...queryKeys.users(), 'list', filters] as const,
  usersDetail: (id: string) => [...queryKeys.users(), 'detail', id] as const,
  
  // Posts related queries (example for future use)
  posts: () => [...queryKeys.all, 'posts'] as const,
  postsList: (filters?: { userId?: string; page?: number }) => 
    [...queryKeys.posts(), 'list', filters] as const,
  postsDetail: (id: string) => [...queryKeys.posts(), 'detail', id] as const,
  
  // Profile related queries
  profile: () => [...queryKeys.all, 'profile'] as const,
  profileDetail: (id: string) => [...queryKeys.profile(), 'detail', id] as const,
} as const

/**
 * Type-safe query key utilities
 */
export type QueryKeys = typeof queryKeys
