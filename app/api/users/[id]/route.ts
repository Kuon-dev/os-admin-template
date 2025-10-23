import { NextResponse } from 'next/server';
import type { User } from '@/types/user';

// Import users from the main route (in a real app, this would be a database)
// For this mock, we'll re-declare it here
let users: User[] = [];

// Helper to load users (simulating database fetch)
async function getUsers(): Promise<User[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`, {
    cache: 'no-store',
  });
  return response.json();
}

// GET /api/users/[id] - Get a single user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const allUsers = await getUsers();
  const user = allUsers.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // In a real app, this would update the database
    // For this mock, we need to fetch and update from the parent module
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`, {
      cache: 'no-store',
    });
    users = await response.json();

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    users[userIndex] = updatedUser;

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Note: In the mock implementation, the actual deletion happens in the store
    // This endpoint just confirms the action
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
