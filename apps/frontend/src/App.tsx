import { AppRouter } from '@/core/router/AppRouter';
import { QueryProvider } from '@/core/query';
import './App.css';

/**
 * Main App Component
 * Entry point that sets up React Query provider and routing for the entire application
 */
function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;
