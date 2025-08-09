import { AppRouter } from '@/core/router/AppRouter';
import { QueryProvider } from '@/core/query';
import { UpdatePrompt, InstallPrompt } from '@/core/pwa';
import { SplashScreen, useSplashScreen } from '@/core/pwa/SplashScreen';

/**
 * Main App Component
 * Entry point that sets up React Query provider, PWA functionality, and routing
 */
function App() {
  const { isVisible, isComplete, onComplete } = useSplashScreen({
    showOnPWA: true,
    duration: 2500
  });

  return (
    <QueryProvider>
      {/* Splash Screen - shown when app is installed as PWA */}
      <SplashScreen 
        isVisible={isVisible}
        appName="TurboApp"
        appTagline="Modern PWA Experience"
        logoText="TA"
        onComplete={onComplete}
      />
      
      {/* Main App - only render when splash is complete */}
      {isComplete && (
        <>
          <AppRouter />
          <UpdatePrompt />
          <InstallPrompt />
        </>
      )}
    </QueryProvider>
  );
}

export default App;
