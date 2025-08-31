import { createClient } from '@supabase/supabase-js';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Create a Supabase client for use in the browser
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(supabaseUrl, supabaseKey);
};

// Create a Supabase client for server components
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  return createServerComponentClient({
    cookies: () => cookieStore,
  });
};

// Export a singleton instance for client components
export const supabase = createSupabaseClient();
export { createClient };

