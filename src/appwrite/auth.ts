import { ID, Query } from 'appwrite';
import { account, databases } from './client';
import { APPWRITE_CONFIG } from './config';
import { User } from '../types';

export class AuthService {
  // Login with email and password
  async login(email: string, password: string): Promise<User> {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      await this.login(email, password);
      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    try {
      await account.get();
      return true;
    } catch {
      return false;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await account.createRecovery(email, 'http://localhost:8081');
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
