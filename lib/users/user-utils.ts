import type { User, UserRole, UserStatus, UserFilters, UserSort, ActivityAction } from '@/types/user';
import { LucideIcon, Sparkles, LogIn, LogOut, Key, UserCog, Zap, Edit, CheckCircle2, FileText } from 'lucide-react';

/**
 * Get badge color variant for user role
 */
export function getRoleBadgeVariant(role: UserRole): 'destructive' | 'default' | 'secondary' {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'editor':
      return 'default';
    case 'user':
      return 'secondary';
    default:
      return 'secondary';
  }
}

/**
 * Get status badge color class
 */
export function getStatusColor(status: UserStatus): string {
  switch (status) {
    case 'active':
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
    case 'inactive':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
    case 'suspended':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700';
  }
}

/**
 * Get initials from name for avatar fallback
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Relative time for recent dates
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // Absolute date for older dates
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format full date time for tooltips
 */
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Filter users based on search and filters
 */
export function filterUsers(users: User[], filters: UserFilters): User[] {
  return users.filter((user) => {
    // Search filter (name or email)
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      !filters.search ||
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);

    // Role filter
    const matchesRole = filters.role === 'all' || user.role === filters.role;

    // Status filter
    const matchesStatus = filters.status === 'all' || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });
}

/**
 * Sort users based on sort configuration
 */
export function sortUsers(users: User[], sort: UserSort): User[] {
  return [...users].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    // Handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    // Compare values
    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Get activity action display text
 */
export function getActivityActionText(action: ActivityAction): string {
  const actionMap: Record<ActivityAction, string> = {
    user_created: 'Account Created',
    user_logged_in: 'Logged In',
    user_logged_out: 'Logged Out',
    password_changed: 'Password Changed',
    role_updated: 'Role Updated',
    status_updated: 'Status Updated',
    profile_updated: 'Profile Updated',
    email_verified: 'Email Verified',
  };

  return actionMap[action] || action;
}

/**
 * Get activity action icon/emoji
 */
export function getActivityActionIcon(action: ActivityAction): string {
  const iconMap: Record<ActivityAction, string> = {
    user_created: '✨',
    user_logged_in: '🔓',
    user_logged_out: '🔒',
    password_changed: '🔑',
    role_updated: '👤',
    status_updated: '⚡',
    profile_updated: '✏️',
    email_verified: '✅',
  };

  return iconMap[action] || '📋';
}

/**
 * Get activity action Lucide icon component
 */
export function getActivityActionIconComponent(action: ActivityAction): LucideIcon {
  const iconMap: Record<ActivityAction, LucideIcon> = {
    user_created: Sparkles,
    user_logged_in: LogIn,
    user_logged_out: LogOut,
    password_changed: Key,
    role_updated: UserCog,
    status_updated: Zap,
    profile_updated: Edit,
    email_verified: CheckCircle2,
  };

  return iconMap[action] || FileText;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate user statistics
 */
export function calculateUserStats(users: User[]) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    newThisMonth: users.filter((u) => new Date(u.createdAt) >= firstDayOfMonth).length,
    adminCount: users.filter((u) => u.role === 'admin').length,
    editorCount: users.filter((u) => u.role === 'editor').length,
    userCount: users.filter((u) => u.role === 'user').length,
  };
}
