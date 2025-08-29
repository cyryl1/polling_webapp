import { supabase } from './supabase';

export type AuthError = {
  message: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
};

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    if (!data.user) {
      return { user: null, error: { message: 'User not found' } };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
    };

    return { user, error: null };
  } catch (error: unknown) {
    return { 
      user: null, 
      error: { 
        message: error instanceof Error ? error.message : 'An error occurred during sign in'
      } 
    };
  }
}

/**
 * Sign up with email, password and name
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    if (!data.user) {
      return { user: null, error: { message: 'Failed to create user' } };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name,
    };

    return { user, error: null };
  } catch (error: unknown) {
    return { 
      user: null, 
      error: { 
        message: error instanceof Error ? error.message : 'An error occurred during sign up'
      } 
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (error: unknown) {
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'An error occurred during sign out'
      } 
    };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { user: null, error: { message: error.message } };
    }

    if (!data.user) {
      return { user: null, error: null };
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
    };

    return { user, error: null };
  } catch (error: unknown) {
    return { 
      user: null, 
      error: { 
        message: error instanceof Error ? error.message : 'An error occurred getting the current user'
      } 
    };
  }
}