import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';

import { getUserProfile, syncCurrentUser } from '@/lib/auth/user-sync';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get the current user profile, this will auto-sync if needed
    const userProfile = await getUserProfile();

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not authenticated or sync failed' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: userProfile,
    });
  } catch (error) {
    console.error('User sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Force sync the current user
    const userProfile = await syncCurrentUser();

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not authenticated or sync failed' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      data: userProfile,
    });
  } catch (error) {
    console.error('User sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
