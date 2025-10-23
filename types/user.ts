// User role types
export type UserRole = 'admin' | 'editor' | 'user';

// User status types
export type UserStatus = 'active' | 'inactive' | 'suspended';

// Activity log action types
export type ActivityAction =
  | 'user_created'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'password_changed'
  | 'role_updated'
  | 'status_updated'
  | 'profile_updated'
  | 'email_verified';

// Main User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  loginCount: number;
}

// Activity log entry
export interface ActivityLog {
  id: string;
  userId: string;
  action: ActivityAction;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// User filter options
export interface UserFilters {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
}

// User sort options
export interface UserSort {
  field: keyof User;
  direction: 'asc' | 'desc';
}

// User statistics
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  newThisMonth: number;
  adminCount: number;
  editorCount: number;
  userCount: number;
}

// Form data for creating/editing users
export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
}
