import { useState, useCallback } from 'react';
import ApiService from '../services/apiService';
import type { RegisterData, LoginData } from '../services/apiService';

interface FormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  general?: string;
}

interface UseAuthFormReturn {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  isValid: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearErrors: () => void;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation functions
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

const validatePassword = (password: string, isRegistration = false): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  const minLength = isRegistration ? 8 : 6;
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return undefined;
};

const validateName = (name: string, fieldName: string): string | undefined => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  return undefined;
};

const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return undefined;
};

// Mock login function - replace with actual API call
const mockLogin = async (email: string, password: string): Promise<{ success: boolean; message?: string; user?: any; token?: string }> => {
  const loginData: LoginData = { email, password };
  return await ApiService.login(loginData);
};

// Mock registration function
const mockRegister = async (formData: FormData): Promise<{ success: boolean; message?: string; user?: any; token?: string }> => {
  const registerData: RegisterData = {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    confirmPassword: formData.confirmPassword || ''
  };
  return await ApiService.register(registerData);
};

export const useAuthForm = (onSuccess: () => void, mode: 'login' | 'register' = 'login'): UseAuthFormReturn => {
  const [formData, setFormData] = useState<FormData>(() => {
    if (mode === 'register') {
      return {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
      };
    }
    return {
      email: '',
      password: ''
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value, mode === 'register');
      case 'firstName':
        return validateName(value, 'First name');
      case 'lastName':
        return validateName(value, 'Last name');
      case 'confirmPassword':
        return validateConfirmPassword(formData.password, value);
      default:
        return undefined;
    }
  }, [mode, formData.password]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: error
      }));
    }
  }, [validateField]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password, mode === 'register');
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    // Additional validation for registration
    if (mode === 'register') {
      const firstNameError = validateName(formData.firstName || '', 'First name');
      const lastNameError = validateName(formData.lastName || '', 'Last name');
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword || '');
      
      if (firstNameError) newErrors.firstName = firstNameError;
      if (lastNameError) newErrors.lastName = lastNameError;
      if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, mode]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev: FormErrors) => ({ ...prev, general: undefined }));

    try {
      let result;
      
      if (mode === 'register') {
        result = await mockRegister(formData);
      } else {
        result = await mockLogin(formData.email, formData.password);
      }
      
      if (result.success) {
        if (mode === 'login') {
          // Store auth token in localStorage
          localStorage.setItem('auth_token', result.token || 'mock-jwt-token');
          localStorage.setItem('userEmail', formData.email);
          if (result.user) {
            localStorage.setItem('user', JSON.stringify(result.user));
          }
        }
        
        // Call success callback
        onSuccess();
      } else {
        setErrors((prev: FormErrors) => ({
          ...prev,
          general: result.message || (mode === 'register' ? 'Registration failed' : 'Login failed')
        }));
      }
    } catch (error) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        general: 'An unexpected error occurred. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, onSuccess, mode]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const isValid = mode === 'register' 
    ? !errors.email && !errors.password && !errors.firstName && !errors.lastName && !errors.confirmPassword && 
      formData.email && formData.password && formData.firstName && formData.lastName && formData.confirmPassword
    : !errors.email && !errors.password && formData.email && formData.password;

  return {
    formData,
    errors,
    isLoading,
    isValid: Boolean(isValid),
    handleInputChange,
    handleInputBlur,
    handleSubmit,
    clearErrors
  };
};
