'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'
import { getCurrentUser, signInWithEmail, signUpWithEmail, signOut as authSignOut } from './auth-utils'

type User = {
  id: string
  name?: string
  email: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          const { user: currentUser, error } = await getCurrentUser()
          if (currentUser && !error) {
            setUser(currentUser)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthState()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const { user: currentUser, error } = await getCurrentUser()
          if (currentUser && !error) {
            setUser(currentUser)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { user: authUser, error } = await signInWithEmail(email, password)
      
      if (error || !authUser) {
        console.error('Error signing in:', error?.message || 'Unknown error')
        return false
      }
      
      setUser(authUser)
      return true
    } catch (error) {
      console.error('Error signing in:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { user: authUser, error } = await signUpWithEmail(email, password, name)
      
      if (error || !authUser) {
        console.error('Error signing up:', error?.message || 'Unknown error')
        return false
      }
      
      setUser(authUser)
      return true
    } catch (error) {
      console.error('Error signing up:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await authSignOut()
      
      if (error) {
        console.error('Error signing out:', error.message)
        throw new Error(error.message)
      }
      
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    } finally {
      setIsLoading(false)
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