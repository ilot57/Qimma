import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';

import { createSupabaseServiceClient } from '../../../../lib/supabase/service-client';

export async function POST(req: NextRequest) {
  try {
    console.log('🎯 Clerk webhook received');

    // Get webhook secret from environment
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('❌ Missing CLERK_WEBHOOK_SECRET environment variable');
      throw new Error(
        'Please add CLERK_WEBHOOK_SECRET to your environment variables'
      );
    }

    console.log('✅ Webhook secret found');

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    console.log('📋 Headers received:', {
      'svix-id': svix_id ? 'present' : 'missing',
      'svix-timestamp': svix_timestamp ? 'present' : 'missing',
      'svix-signature': svix_signature ? 'present' : 'missing',
    });

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('❌ Missing required Svix headers');
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      );
    }

    // Get body
    const payload = await req.text();
    console.log('📦 Payload length:', payload.length);

    // Create new Svix instance with secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify webhook
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
      console.log('✅ Webhook signature verified');
    } catch (err) {
      console.error('❌ Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      );
    }

    // Handle the webhook
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`🎉 Clerk webhook processed: ${eventType} for user ${id}`);

    // Handle user creation and updates
    if (eventType === 'user.created' || eventType === 'user.updated') {
      console.log('👤 Processing user sync...');
      const result = await syncUserToSupabase(evt.data);
      console.log('✅ User sync completed:', result?.id);
    } else {
      console.log('ℹ️ Event type not handled:', eventType);
    }

    return NextResponse.json(
      {
        message: 'Webhook processed successfully',
        eventType,
        userId: id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('💥 Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function syncUserToSupabase(userData: any) {
  try {
    console.log('🔄 Starting user sync to Supabase...');
    console.log('👤 User data:', {
      id: userData.id,
      email: userData.email_addresses?.[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
    });

    const supabase = createSupabaseServiceClient();

    const userProfile = {
      clerk_user_id: userData.id,
      email: userData.email_addresses?.[0]?.email_address || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      role: (userData.public_metadata?.role as string) || 'teacher',
      subscription_tier: 'free',
      credits_remaining: 30,
    };

    console.log('📝 Upserting user profile:', userProfile);

    // Upsert user (insert or update if exists)
    const { data, error } = await supabase
      .from('users')
      .upsert(userProfile, {
        onConflict: 'clerk_user_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error syncing user to Supabase:', error);
      throw error;
    }

    console.log('✅ User synced to Supabase successfully:', data.id);
    return data;
  } catch (error) {
    console.error('💥 Error in syncUserToSupabase:', error);
    throw error;
  }
}
