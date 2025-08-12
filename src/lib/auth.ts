import { User, LoginData, SignupData } from '@/types/auth';

// Mock authentication service using localStorage
const AUTH_STORAGE_KEY = 'smartstudy_auth';
const USERS_STORAGE_KEY = 'smartstudy_users';

export class AuthService {
  static getCurrentUser(): User | null {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return null;
    
    try {
      return JSON.parse(authData);
    } catch {
      return null;
    }
  }

  static async login(data: LoginData): Promise<User> {
    const users = this.getUsers();
    const user = users.find(u => u.email === data.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, you'd verify the password hash
    // For demo purposes, we'll use a simple check
    if (data.password.length < 6) {
      throw new Error('Invalid password');
    }
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  static async signup(data: SignupData): Promise<User> {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const users = this.getUsers();
    
    if (users.find(u => u.email === data.email)) {
      throw new Error('User already exists');
    }
    
    const user: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
    };
    
    users.push(user);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    
    return user;
  }

  static logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  static updateProfile(userData: Partial<User>): User {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');
    
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    
    // Update in users array too
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    
    return updatedUser;
  }

  private static getUsers(): User[] {
    const usersData = localStorage.getItem(USERS_STORAGE_KEY);
    try {
      return usersData ? JSON.parse(usersData) : [];
    } catch {
      return [];
    }
  }
}