import { useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Standard client (for non-authenticated operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hook for authenticated Supabase client with Clerk token
export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  const getSupabaseClient = async () => {
    const token = await getToken({ template: 'supabase' });

    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  };

  return { getSupabaseClient };
};
