import { currentUser } from '@clerk/nextjs/server';

import { createAuthenticatedClient } from '@/lib/supabase/server';

export interface UserProfile {
  id: string;
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  subscriptionTier: 'free' | 'standard' | 'plus' | 'full';
  creditsRemaining: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sync current Clerk user to Supabase
 * Creates or updates user record in Supabase based on Clerk data
 */
export async function syncCurrentUser(): Promise<UserProfile | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const supabase = await createAuthenticatedClient();

    // Prepare user data
    const userData = {
      clerk_user_id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      first_name: user.firstName,
      last_name: user.lastName,
      updated_at: new Date().toISOString(),
    };

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    let dbUser;

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('clerk_user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      dbUser = data;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          ...userData,
          role: 'teacher', // Default role
          subscription_tier: 'free', // Default tier
          credits_remaining: 30, // Default free credits
        })
        .select()
        .single();

      if (error) throw error;
      dbUser = data;
    }

    return {
      id: dbUser.id,
      clerkUserId: dbUser.clerk_user_id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      role: dbUser.role,
      subscriptionTier: dbUser.subscription_tier,
      creditsRemaining: dbUser.credits_remaining,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
    };
  } catch (error) {
    console.error('Error syncing user:', error);
    return null;
  }
}

/**
 * Get user profile from Supabase
 * Returns the user profile data for the current authenticated user
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const supabase = await createAuthenticatedClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    if (error) {
      // If user doesn't exist, try to sync them
      if (error.code === 'PGRST116') {
        return await syncCurrentUser();
      }
      throw error;
    }

    return {
      id: data.id,
      clerkUserId: data.clerk_user_id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      subscriptionTier: data.subscription_tier,
      creditsRemaining: data.credits_remaining,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Update user profile in Supabase
 */
export async function updateUserProfile(
  updates: Partial<
    Pick<UserProfile, 'firstName' | 'lastName' | 'role' | 'subscriptionTier'>
  >
): Promise<UserProfile | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const supabase = await createAuthenticatedClient();

    const updateData = {
      ...(updates.firstName !== undefined && { first_name: updates.firstName }),
      ...(updates.lastName !== undefined && { last_name: updates.lastName }),
      ...(updates.role !== undefined && { role: updates.role }),
      ...(updates.subscriptionTier !== undefined && {
        subscription_tier: updates.subscriptionTier,
      }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('clerk_user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      clerkUserId: data.clerk_user_id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      subscriptionTier: data.subscription_tier,
      creditsRemaining: data.credits_remaining,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

/**
 * Update user credits
 */
export async function updateUserCredits(
  amount: number,
  operation: 'add' | 'subtract' = 'subtract'
): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;

    const supabase = await createAuthenticatedClient();

    // Get current credits
    const { data: userData } = await supabase
      .from('users')
      .select('credits_remaining')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData) return false;

    const newCredits =
      operation === 'add'
        ? userData.credits_remaining + amount
        : Math.max(0, userData.credits_remaining - amount);

    const { error } = await supabase
      .from('users')
      .update({
        credits_remaining: newCredits,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user credits:', error);
    return false;
  }
}

/**
 * Ensures the current user is synced to Supabase database
 * This should be called in server components for protected routes
 * to automatically sync users when they access the application
 */
export async function ensureUserSynced() {
  try {
    const userProfile = await getUserProfile();
    return userProfile;
  } catch (error) {
    console.error('Error ensuring user sync:', error);
    return null;
  }
}
