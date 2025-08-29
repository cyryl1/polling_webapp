/**
 * Utility functions for managing mock authentication
 * These functions are for development and testing purposes only
 */

// Constants for local storage keys
const MOCK_USERS_KEY = 'polling_app_mock_users';
const CURRENT_USER_KEY = 'polling_app_current_user';

// Types
type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

/**
 * Get all mock users from local storage
 */
export function getMockUsers(): MockUser[] {
  if (typeof window === 'undefined') return [];
  
  const usersJson = localStorage.getItem(MOCK_USERS_KEY);
  if (!usersJson) return [];
  
  try {
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Error parsing mock users:', error);
    return [];
  }
}

/**
 * Add a new mock user
 */
export function addMockUser(user: MockUser): boolean {
  if (typeof window === 'undefined') return false;
  
  const users = getMockUsers();
  
  // Check if email already exists
  if (users.some(u => u.email === user.email)) {
    return false;
  }
  
  users.push(user);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  return true;
}

/**
 * Reset mock users to default state
 */
export function resetMockUsers(): void {
  if (typeof window === 'undefined') return;
  
  const defaultUsers: MockUser[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123'
    }
  ];
  
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
}

/**
 * Get current logged in user
 */
export function getCurrentUser(): CurrentUser | null {
  if (typeof window === 'undefined') return null;
  
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing current user:', error);
    return null;
  }
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Debug function to log current auth state
 */
export function logAuthState(): void {
  console.log('Current User:', getCurrentUser());
  console.log('Mock Users:', getMockUsers());
}