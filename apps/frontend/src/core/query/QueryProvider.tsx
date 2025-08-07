import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './queryClient'

interface QueryProviderProps {
  children: ReactNode
  client?: QueryClient
}

export function QueryProvider({ children, client = queryClient }: QueryProviderProps) {
  const isDevelopment = import.meta.env.DEV;
  
  return (
    <QueryClientProvider client={client}>
      {children}
      {/* Show devtools only in development */}
      {isDevelopment && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </QueryClientProvider>
  )
}
