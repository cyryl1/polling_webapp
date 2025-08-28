'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type User = {
  id: string
  name: string
  email: string
} | null

type MockUser = {
  id: string
  name: string
  email: string
  password: string
}

type AuthContextType = {
  user: User
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database
const MOCK_USERS_KEY = 'polling_app_mock_users'
const CURRENT_USER_KEY = 'polling_app_current_user'

// Initialize mock users if they don't exist
const initializeMockUsers = (): MockUser[] => {
  if (typeof window === 'undefined') return []
  
  const existingUsers = localStorage.getItem(MOCK_USERS_KEY)
  if (existingUsers) {
    return JSON.parse(existingUsers)
  }
  
  // Create default admin user
  const defaultUsers: MockUser[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123'
    }
  ]
  
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    // Initialize mock users
    initializeMockUsers()
    
    // Check for existing logged in user
    const checkAuthState = () => {
      try {
        const savedUser = localStorage.getItem(CURRENT_USER_KEY)
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser({
            id: parsedUser.id,
            name: parsedUser.name,
            email: parsedUser.email
          })
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking auth state:', error)
        setUser(null)
        setIsLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Get users from local storage
      const users: MockUser[] = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
      
      // Find user with matching email and password
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        // Create a user object without the password
        const userToSave = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email
        }
        
        // Save to local storage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToSave))
        
        // Update state
        setUser(userToSave)
        setIsLoading(false)
        return true
      } else {
        console.error('Invalid email or password')
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error signing in:', error)
      setIsLoading(false)
      return false
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Get existing users
      const users: MockUser[] = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
      
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        console.error('Email already in use')
        setIsLoading(false)
        return false
      }
      
      // Create new user
      const newUser: MockUser = {
        id: `${users.length + 1}`,
        name,
        email,
        password
      }
      
      // Add to users array
      users.push(newUser)
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
      
      // Create a user object without the password
      const userToSave = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
      
      // Save current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToSave))
      
      // Update state
      setUser(userToSave)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Error signing up:', error)
      setIsLoading(false)
      return false
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      // Remove current user from local storage
      localStorage.removeItem(CURRENT_USER_KEY)
      
      // Update state
      setUser(null)
      setIsLoading(false)
    } catch (error) {
      console.error('Error signing out:', error)
      setIsLoading(false)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}