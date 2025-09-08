import { useAuthForm } from '../hooks/useAuthForm';
import Input from './Input';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

const Login = ({ onLoginSuccess, onNavigateToRegister }: LoginProps) => {
  const {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleInputBlur,
    handleSubmit
  } = useAuthForm(onLoginSuccess);
  return (
    <div className="login-container">
      <div className="login-brand">
        <div className="brand-logo">
          <img src="/kodotakai-logo.svg" alt="Kodotakai" className="brand-image" />
          <h1 className="brand-name">Kodotakai</h1>
        </div>
        <p className="brand-tagline">
          Streamline your business operations with our comprehensive enterprise solution
        </p>
        <ul className="brand-features">
          <li>Advanced Analytics & Reporting</li>
          <li>Secure Cloud Infrastructure</li>
          <li>24/7 Customer Support</li>
          <li>Enterprise-grade Security</li>
        </ul>
      </div>
      
      <div className="login-form-container">
        <div className="login-form">
          <h2>Sign in to your account</h2>
          <p className="login-subtitle">Welcome back! Please enter your details.</p>
          
          <form onSubmit={handleSubmit}>
            <Input
              id="email"
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.email}
              disabled={isLoading}
              placeholder="Enter your email"
              required
            />
            
            <Input
              id="password"
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.password}
              disabled={isLoading}
              placeholder="Enter your password"
              required
            />
            
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}
            
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <div className="login-links">
            <a href="#forgot" className="forgot-password-link">
              Forgot your password?
            </a>
          </div>
          
          <p className="signup-link">
            Don't have an account?{' '}
            <button 
              type="button" 
              className="signup-link-button"
              onClick={onNavigateToRegister}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
