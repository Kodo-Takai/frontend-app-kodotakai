import { useAuthForm } from '../hooks/useInput';
import Input from './Input';
import './Register.css';

interface RegisterProps {
  onNavigateToLogin: () => void;
}

const Register = ({ onNavigateToLogin }: RegisterProps) => {
  const {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleInputBlur,
    handleSubmit
  } = useAuthForm(onNavigateToLogin, 'register');

  return (
    <div className="register-container">
      <div className="register-brand">
        <div className="brand-logo">
          <img src="/kodotakai-logo.svg" alt="Kodotakai" className="brand-image" />
          <h1 className="brand-name">Kodotakai</h1>
        </div>
        <p className="brand-tagline">
          Join thousands of businesses transforming their operations with our platform
        </p>
        <ul className="brand-features">
          <li>Complete Business Management Suite</li>
          <li>Advanced Analytics & Insights</li>
          <li>Enterprise-grade Security</li>
          <li>24/7 Premium Support</li>
        </ul>
      </div>
      
      <div className="register-form-container">
        <div className="register-form">
          <h2>Create your account</h2>
          <p className="register-subtitle">Start your journey with Kodotakai today</p>
          
          <form onSubmit={handleSubmit}>
            <div className="name-fields">
              <Input
                id="firstName"
                type="text"
                name="firstName"
                label="First Name"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.firstName}
                disabled={isLoading}
                placeholder="Enter your first name"
                required
              />
              
              <Input
                id="lastName"
                type="text"
                name="lastName"
                label="Last Name"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={errors.lastName}
                disabled={isLoading}
                placeholder="Enter your last name"
                required
              />
            </div>
            
            <Input
              id="email"
              type="email"
              name="email"
              label="Email"
              value={formData.email || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.email}
              disabled={isLoading}
              placeholder="Enter your email address"
              required
            />
            
            <Input
              id="password"
              type="password"
              name="password"
              label="Password"
              value={formData.password || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.password}
              disabled={isLoading}
              placeholder="Enter a strong password"
              required
            />
            
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.confirmPassword}
              disabled={isLoading}
              placeholder="Confirm your password"
              required
            />
            
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}
            
            <button 
              type="submit" 
              className="register-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="login-link">
            <p>
              Already have an account?{' '}
              <button 
                type="button" 
                className="login-link-button"
                onClick={onNavigateToLogin}
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
