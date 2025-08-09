// React Query core exports
export { queryClient } from './queryClient'
export { QueryProvider } from './QueryProvider'
export { queryKeys } from './queryKeys'
export { 
  useInvalidateQueries, 
  useRemoveQueries, 
  useOptimisticUpdate,
  type MutationOptions 
} from './queryUtils'

// Re-export commonly used React Query hooks and utilities
export {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useSuspenseQuery,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
  type UseMutationResult,
} from '@tanstack/react-query'
