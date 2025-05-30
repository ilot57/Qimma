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

    // Check admin role
    const userRole = (sessionClaims?.metadata as { role?: string })?.role;
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Example: Get all users (admin only)
    const mockUsers = [
      { id: '1', email: 'user1@example.com', role: 'student' },
      { id: '2', email: 'user2@example.com', role: 'teacher' },
      { id: '3', email: 'admin@example.com', role: 'admin' },
    ];

    return NextResponse.json({
      users: mockUsers,
      requestedBy: { userId, userRole },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check super admin role for deletion
    const userRole = (sessionClaims?.metadata as { role?: string })?.role;
    if (userRole !== 'super_admin') {
      return NextResponse.json(
        { error: 'Super admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Example: Delete user (super admin only functionality)
    return NextResponse.json({
      success: true,
      message: `User ${targetUserId} would be deleted`,
      deletedBy: { userId, userRole },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
