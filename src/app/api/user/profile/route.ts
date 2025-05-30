import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userRole = (sessionClaims?.metadata as { role?: string })?.role;

    // Example: Get user profile data
    const profileData = {
      userId,
      userRole,
      message: 'This is protected user profile data',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userRole = (sessionClaims?.metadata as { role?: string })?.role;
    const body = await request.json();

    // Example: Update user profile
    // In a real app, you'd validate the data and update the database

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      userId,
      updatedData: body,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
