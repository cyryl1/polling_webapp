'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'

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

export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/auth/sign-in')
}