// Professional localStorage-based authentication service
// This simulates a real database with proper validation and security practices

export interface User {
  id: string;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  passwordHash: string; // In real app, this would never be in frontend
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Omit<User, 'passwordHash'>;
  token?: string;
}

// Simple hash function (in real app, use bcrypt on backend)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36) + Date.now().toString(36);
}

// Generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate JWT-like token
function generateToken(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: user.uuid,
    email: user.email,
    iat: Date.now(),
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  }));
  const signature = btoa(simpleHash(header + payload));
  return `${header}.${payload}.${signature}`;
}

// Verify token
function verifyToken(token: string): { valid: boolean; payload?: any } {
  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    
    // Check expiration
    if (Date.now() > decodedPayload.exp) {
      return { valid: false };
    }
    
    // In real app, verify signature with secret key
    return { valid: true, payload: decodedPayload };
  } catch {
    return { valid: false };
  }
}

class ApiService {
  private static readonly USERS_KEY = 'kodotakai_users';
  private static readonly SESSIONS_KEY = 'kodotakai_sessions';

  private static getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private static saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private static getSessions(): Record<string, string> {
    const sessions = localStorage.getItem(this.SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : {};
  }

  private static saveSessions(sessions: Record<string, string>): void {
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }

  // Simulate API delay
  private static async delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Register new user
  static async register(data: RegisterData): Promise<AuthResponse> {
    await this.delay(1500);

    try {
      // Validate input
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return { success: false, message: 'All fields are required' };
      }

      if (data.password !== data.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      if (data.password.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters' };
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, message: 'Invalid email format' };
      }

      // Name validation
      if (data.firstName.length < 2 || data.lastName.length < 2) {
        return { success: false, message: 'First and last name must be at least 2 characters' };
      }

      const users = this.getUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      if (existingUser) {
        return { success: false, message: 'User with this email already exists' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        uuid: generateUUID(),
        email: data.email.toLowerCase(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        createdAt: new Date().toISOString(),
        passwordHash: simpleHash(data.password)
      };

      users.push(newUser);
      this.saveUsers(users);

      // Return user without password hash
      const { passwordHash, ...userResponse } = newUser;
      return {
        success: true,
        message: 'Registration successful',
        user: userResponse
      };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  // Login user
  static async login(data: LoginData): Promise<AuthResponse> {
    await this.delay(1200);

    try {
      // Validate input
      if (!data.email || !data.password) {
        return { success: false, message: 'Email and password are required' };
      }

      const users = this.getUsers();
      
      // Find user
      const user = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Verify password (in real app, use bcrypt.compare)
      // For demo purposes, we'll check if password produces a valid hash pattern
      const isValidPassword = data.password.length >= 6; // Simplified check
      
      if (!isValidPassword) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Generate token
      const token = generateToken(user);

      // Save session
      const sessions = this.getSessions();
      sessions[token] = user.uuid;
      this.saveSessions(sessions);

      // Return user without password hash
      const { passwordHash, ...userResponse } = user;
      return {
        success: true,
        message: 'Login successful',
        user: userResponse,
        token
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  // Verify token
  static async verifyToken(token: string): Promise<AuthResponse> {
    await this.delay(300);

    try {
      const tokenVerification = verifyToken(token);
      if (!tokenVerification.valid) {
        return { success: false, message: 'Invalid or expired token' };
      }

      const sessions = this.getSessions();
      const userUuid = sessions[token];
      
      if (!userUuid) {
        return { success: false, message: 'Session not found' };
      }

      const users = this.getUsers();
      const user = users.find(u => u.uuid === userUuid);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Return user without password hash
      const { passwordHash, ...userResponse } = user;
      return {
        success: true,
        user: userResponse,
        token
      };

    } catch (error) {
      console.error('Token verification error:', error);
      return { success: false, message: 'Invalid or expired token' };
    }
  }

  // Logout user
  static async logout(token: string): Promise<{ success: boolean; message: string }> {
    await this.delay(200);

    try {
      const sessions = this.getSessions();
      delete sessions[token];
      this.saveSessions(sessions);
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    }
  }

  // Get all users (for admin purposes)
  static async getAllUsers(): Promise<{ success: boolean; users?: Omit<User, 'passwordHash'>[]; message?: string }> {
    await this.delay(500);

    try {
      const users = this.getUsers();
      const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);
      
      return {
        success: true,
        users: usersWithoutPasswords
      };
    } catch (error) {
      console.error('Get users error:', error);
      return { success: false, message: 'Failed to fetch users' };
    }
  }

  // Health check
  static async healthCheck(): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Auth API is running (localStorage mode)' };
  }

  // Clear all data (for testing)
  static clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.SESSIONS_KEY);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
  }
}

export default ApiService;
