# React Query Setup Documentation

This document explains the React Query (TanStack Query) implementation in the frontend project.

## 📦 Installation

The following packages are installed:
- `@tanstack/react-query` - Core React Query library
- `@tanstack/react-query-devtools` - Development tools for debugging

## 🏗️ Architecture

### Query Client Configuration
- **Location**: `src/core/query/queryClient.ts`
- **Features**:
  - 5-minute stale time for queries
  - 10-minute garbage collection time
  - 3 retry attempts for failed requests
  - Automatic refetch on reconnect
  - Disabled refetch on window focus

### Query Provider Setup
- **Location**: `src/core/query/QueryProvider.tsx`
- **Features**:
  - Wraps the entire app with QueryClientProvider
  - Includes React Query DevTools in development mode
  - Uses Vite's `import.meta.env.DEV` for environment detection

### Query Keys Management
- **Location**: `src/core/query/queryKeys.ts`
- **Features**:
  - Centralized query key factory
  - Type-safe key generation
  - Hierarchical key structure
  - Consistent naming conventions

### Query Utilities
- **Location**: `src/core/query/queryUtils.ts`
- **Features**:
  - `useInvalidateQueries` - Bulk query invalidation
  - `useRemoveQueries` - Cache cleanup utilities
  - `useOptimisticUpdate` - Optimistic UI updates

## 🔧 Usage Examples

### Basic Query Hook

```typescript
import { useQuery } from '@/core/query';
import { apiClient, API_ENDPOINTS } from '@/core/api/client';

const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USERS);
    return response.data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Custom Hook with React Query

```typescript
// src/features/users/hooks/useUsers.ts
export const useUsers = (options?: UseUsersOptions) => {
  const { filters, ...queryOptions } = options || {};
  
  return useQuery({
    queryKey: queryKeys.usersList(filters),
    queryFn: async (): Promise<User[]> => {
      // API call logic
    },
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });
};
```

### Mutation Hook

```typescript
export const useCreateUser = () => {
  const { invalidateUsers } = useInvalidateQueries();
  
  return useMutation({
    mutationFn: async (userData: Omit<User, 'id'>): Promise<User> => {
      const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
      return response.data;
    },
    onSuccess: () => {
      invalidateUsers(); // Refetch users list
    },
  });
};
```

## 🎯 Features Implemented

### ✅ Query Management
- Centralized query keys factory
- Type-safe query configuration
- Automatic background refetching
- Error boundary integration

### ✅ Caching Strategy
- Smart cache invalidation
- Optimistic updates support
- Background data synchronization
- Stale-while-revalidate pattern

### ✅ Developer Experience
- React Query DevTools integration
- TypeScript support throughout
- Consistent error handling
- Reusable query utilities

### ✅ Performance Optimizations
- Query deduplication
- Automatic garbage collection
- Background refetching
- Intelligent retry logic

## 🚀 Best Practices

1. **Query Keys**: Use the centralized `queryKeys` factory for consistency
2. **Error Handling**: Implement proper error boundaries and fallbacks
3. **Loading States**: Always handle `isLoading` and `isError` states
4. **Cache Invalidation**: Use specific invalidation over global cache clearing
5. **Optimistic Updates**: Implement for better UX in mutation flows

## 🔍 Development Tools

- **React Query DevTools**: Available in development mode at the bottom of the screen
- **Query Inspector**: View query states, cache contents, and network activity
- **Cache Explorer**: Inspect and manipulate cached data
- **Performance Monitoring**: Track query timing and performance metrics

## 📚 Integration Points

- **Router**: Integrated with React Router for route-based data fetching
- **API Client**: Works seamlessly with the existing Axios configuration
- **Error Boundaries**: Proper error handling with the core error boundary
- **Loading States**: Consistent loading UI with the core loading components

This setup provides a robust, scalable foundation for data fetching and state management across the application.
