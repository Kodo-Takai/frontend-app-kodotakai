import { useState, useEffect } from 'react'
import { SplashScreen, Login } from './components'
import { APP_STATES, type AppState, shouldShowSplash, markSplashShown } from './utils/appState'
import { SPLASH_CONFIGS } from './config/splashConfig'
import './App.css'

function App() {
  // Initialize state based on whether splash has been shown before
  const [currentState, setCurrentState] = useState<AppState>(() => {
    return shouldShowSplash() ? APP_STATES.SPLASH : APP_STATES.LOGIN;
  });

  const handleSplashComplete = () => {
    markSplashShown();
    setCurrentState(APP_STATES.LOGIN);
  };

  // Reset splash state on app reload (for development/demo purposes)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Press 'R' key to reset splash state
      if (event.key === 'r' || event.key === 'R') {
        if (event.ctrlKey || event.metaKey) {
          // Prevent default refresh behavior
          return;
        }
        window.location.reload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentState = () => {
    switch (currentState) {
      case APP_STATES.SPLASH:
        return (
          <SplashScreen 
            {...SPLASH_CONFIGS.standard}
            onComplete={handleSplashComplete}
          />
        );
      case APP_STATES.LOGIN:
        return (
          <Login
            onLoginSuccess={() => {
              // handle successful login (e.g., navigate to dashboard)
            }}
            onNavigateToRegister={() => {
              // handle navigation to register page
            }}
          />
        );
      default:
        return (
          <Login
            onLoginSuccess={() => {
              // handle successful login (e.g., navigate to dashboard)
            }}
            onNavigateToRegister={() => {
              // handle navigation to register page
            }}
          />
        );
    }
  };

  return renderCurrentState();
}

export default App;
