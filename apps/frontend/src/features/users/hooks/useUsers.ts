import { useQuery, useMutation, queryKeys, useInvalidateQueries, type UseQueryOptions } from '@/core/query';
import { apiClient, API_ENDPOINTS } from '@/core/api/client';

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    zipcode: string;
  };
  company?: {
    name: string;
  };
}

interface UsersFilters {
  search?: string;
  page?: number;
  limit?: number;
}

interface UseUsersOptions extends Omit<UseQueryOptions<User[], Error>, 'queryKey' | 'queryFn'> {
  filters?: UsersFilters;
}

/**
 * React Query hook for fetching users list
 */
export const useUsers = (options?: UseUsersOptions) => {
  const { filters, ...queryOptions } = options || {};
  
  return useQuery({
    queryKey: queryKeys.usersList(filters),
    queryFn: async (): Promise<User[]> => {
      const params = new URLSearchParams();
      
      if (filters?.search) params.append('q', filters.search);
      if (filters?.page) params.append('_page', filters.page.toString());
      if (filters?.limit) params.append('_limit', filters.limit.toString());
      
      const url = `${API_ENDPOINTS.USERS}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<User[]>(url);
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...queryOptions,
  });
};

/**
 * React Query hook for fetching a single user
 */
export const useUser = (id: string, options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: queryKeys.usersDetail(id),
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run query if id is provided
    staleTime: 10 * 60 * 1000, // 10 minutes for individual user data
    ...options,
  });
};

/**
 * Mutation hook for creating a new user
 */
export const useCreateUser = () => {
  const { invalidateUsers } = useInvalidateQueries();
  
  return useMutation({
    mutationFn: async (userData: Omit<User, 'id'>): Promise<User> => {
      const response = await apiClient.post<User>(API_ENDPOINTS.USERS, userData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate users list to refetch
      invalidateUsers();
    },
  });
};

/**
 * Mutation hook for updating a user
 */
export const useUpdateUser = () => {
  const { invalidateUsers, invalidateUser } = useInvalidateQueries();
  
  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: Partial<User> }): Promise<User> => {
      const response = await apiClient.put<User>(`${API_ENDPOINTS.USERS}/${id}`, userData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate both the user detail and users list
      invalidateUser(data.id.toString());
      invalidateUsers();
    },
  });
};

/**
 * Mutation hook for deleting a user
 */
export const useDeleteUser = () => {
  const { invalidateUsers } = useInvalidateQueries();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`);
    },
    onSuccess: () => {
      // Invalidate users list to refetch
      invalidateUsers();
    },
  });
};
