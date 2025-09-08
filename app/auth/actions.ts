'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * Handles user sign-in by authenticating with Supabase using email and password.
 * Redirects to the dashboard upon successful sign-in, or returns an error.
 * @param formData - FormData object containing 'email' and 'password'.
 * @returns An object with an 'error' property if authentication fails, otherwise redirects.
 */
export async function signIn(
  formData: FormData
) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = createServerSupabaseClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  redirect('/dashboard')
}

/**
 * Handles user sign-up by creating a new user in Supabase with email, password, and name.
 * Redirects to the dashboard upon successful sign-up, or returns an error.
 * @param formData - FormData object containing 'email', 'password', and 'name'.
 * @returns An object with an 'error' property if sign-up fails, otherwise redirects.
 */
export async function signUp(
  formData: FormData
) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  
  const supabase = createServerSupabaseClient()
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })
  
  if (error) {
    return { error: error.message }
  }
  
  redirect('/dashboard')
}

/**
 * Handles user sign-out by invalidating the current session with Supabase.
 * Redirects to the sign-in page after successful sign-out.
 */
export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/auth/sign-in')
}