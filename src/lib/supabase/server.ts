import { cookies } from 'next/headers';

import { auth } from '@clerk/nextjs/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Server Component limitation
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Server Component limitation
          }
        },
      },
    }
  );
};

// Create authenticated Supabase client with Clerk token
export const createAuthenticatedClient = async () => {
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });

  const cookieStore = await cookies();

  const clientOptions = {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Server Component limitation
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Server Component limitation
        }
      },
    },
    ...(token && {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }),
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    clientOptions
  );
};
