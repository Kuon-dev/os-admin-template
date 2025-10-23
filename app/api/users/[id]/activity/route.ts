import { NextResponse } from 'next/server';
import type { ActivityLog } from '@/types/user';

// Mock activity logs storage
const activityLogs: Record<string, ActivityLog[]> = {
  '1': [
    {
      id: 'act-1-1',
      userId: '1',
      action: 'user_logged_in',
      description: 'Logged in from Chrome on macOS',
      timestamp: '2025-10-23T08:15:00Z',
    },
    {
      id: 'act-1-2',
      userId: '1',
      action: 'profile_updated',
      description: 'Updated profile information',
      timestamp: '2025-10-20T14:30:00Z',
    },
    {
      id: 'act-1-3',
      userId: '1',
      action: 'user_logged_in',
      description: 'Logged in from Firefox on Windows',
      timestamp: '2025-10-19T09:20:00Z',
    },
    {
      id: 'act-1-4',
      userId: '1',
      action: 'password_changed',
      description: 'Password was changed successfully',
      timestamp: '2025-10-15T16:45:00Z',
    },
  ],
  '2': [
    {
      id: 'act-2-1',
      userId: '2',
      action: 'user_logged_in',
      description: 'Logged in from Safari on iOS',
      timestamp: '2025-10-22T18:30:00Z',
    },
    {
      id: 'act-2-2',
      userId: '2',
      action: 'role_updated',
      description: 'Role changed from editor to admin',
      timestamp: '2025-10-22T16:45:00Z',
    },
    {
      id: 'act-2-3',
      userId: '2',
      action: 'user_logged_in',
      description: 'Logged in from Chrome on macOS',
      timestamp: '2025-10-20T10:15:00Z',
    },
  ],
  '3': [
    {
      id: 'act-3-1',
      userId: '3',
      action: 'user_logged_in',
      description: 'Logged in from Edge on Windows',
      timestamp: '2025-10-21T11:45:00Z',
    },
    {
      id: 'act-3-2',
      userId: '3',
      action: 'profile_updated',
      description: 'Updated avatar image',
      timestamp: '2025-10-21T10:20:00Z',
    },
  ],
  '12': [
    {
      id: 'act-12-1',
      userId: '12',
      action: 'status_updated',
      description: 'Account suspended due to policy violation',
      timestamp: '2025-10-10T09:00:00Z',
    },
    {
      id: 'act-12-2',
      userId: '12',
      action: 'user_logged_in',
      description: 'Last login before suspension',
      timestamp: '2025-10-05T12:00:00Z',
    },
  ],
};

// GET /api/users/[id]/activity - Get activity logs for a user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const logs = activityLogs[id] || [];

  return NextResponse.json(logs);
}

// POST /api/users/[id]/activity - Add a new activity log (optional, for future use)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      userId: id,
      action: body.action,
      description: body.description,
      timestamp: new Date().toISOString(),
      metadata: body.metadata,
    };

    if (!activityLogs[id]) {
      activityLogs[id] = [];
    }

    activityLogs[id] = [newLog, ...activityLogs[id]];

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create activity log' },
      { status: 500 }
    );
  }
}
