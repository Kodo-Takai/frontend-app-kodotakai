import { useSplash } from '../hooks/useSplash';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
  logo?: string;
  appName?: string;
}

const SplashScreen = ({ 
  onComplete, 
  duration = 3000, 
  logo = '/kodotakai-logo.svg',
  appName = 'Kodotakai'
}: SplashScreenProps) => {
  const { isVisible, isAnimating } = useSplash({ 
    duration, 
    onComplete 
  });

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`splash-screen ${isAnimating ? 'fade-in' : 'fade-out'}`}>
      <div className="splash-content">
        <div className="logo-container">
          <img 
            src={logo} 
            alt={`${appName} Logo`} 
            className="splash-logo"
          />
        </div>
        <h1 className="app-name">{appName}</h1>
        <p className="app-subtitle">Enterprise Business Solution</p>
        <div className="loading-indicator">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="loading-text">LOADING</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
