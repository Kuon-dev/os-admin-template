import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, UserFilters, UserSort, ActivityLog } from '@/types/user';

interface UserStore {
  users: User[];
  activityLogs: Record<string, ActivityLog[]>;
  filters: UserFilters;
  sort: UserSort;
  selectedUserIds: string[];
  isLoading: boolean;
  actions: {
    // Fetch users
    fetchUsers: () => Promise<void>;

    // CRUD operations
    createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'loginCount'>) => Promise<User>;
    updateUser: (id: string, userData: Partial<User>) => Promise<User>;
    deleteUser: (id: string) => Promise<void>;
    deleteUsers: (ids: string[]) => Promise<void>;

    // Activity logs
    fetchActivityLogs: (userId: string) => Promise<ActivityLog[]>;
    addActivityLog: (userId: string, log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

    // Filters and sorting
    setFilters: (filters: Partial<UserFilters>) => void;
    setSort: (sort: UserSort) => void;
    resetFilters: () => void;

    // Selection
    toggleUserSelection: (id: string) => void;
    selectAllUsers: () => void;
    clearSelection: () => void;

    // Utility
    refreshUsers: () => Promise<void>;
  };
}

const defaultFilters: UserFilters = {
  search: '',
  role: 'all',
  status: 'all',
};

const defaultSort: UserSort = {
  field: 'createdAt',
  direction: 'desc',
};

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      users: [],
      activityLogs: {},
      filters: defaultFilters,
      sort: defaultSort,
      selectedUserIds: [],
      isLoading: false,

      actions: {
        // Fetch all users from API
        fetchUsers: async () => {
          set({ isLoading: true });
          try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();
            set({ users, isLoading: false });
          } catch (error) {
            console.error('Error fetching users:', error);
            set({ isLoading: false });
          }
        },

        // Create a new user
        createUser: async (userData) => {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) throw new Error('Failed to create user');

          const newUser = await response.json();
          set((state) => ({
            users: [newUser, ...state.users],
          }));

          return newUser;
        },

        // Update an existing user
        updateUser: async (id, userData) => {
          const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) throw new Error('Failed to update user');

          const updatedUser = await response.json();
          set((state) => ({
            users: state.users.map((user) =>
              user.id === id ? updatedUser : user
            ),
          }));

          return updatedUser;
        },

        // Delete a single user
        deleteUser: async (id) => {
          const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) throw new Error('Failed to delete user');

          set((state) => ({
            users: state.users.filter((user) => user.id !== id),
            selectedUserIds: state.selectedUserIds.filter((uid) => uid !== id),
          }));
        },

        // Delete multiple users
        deleteUsers: async (ids) => {
          await Promise.all(ids.map((id) => get().actions.deleteUser(id)));
          get().actions.clearSelection();
        },

        // Fetch activity logs for a specific user
        fetchActivityLogs: async (userId) => {
          const response = await fetch(`/api/users/${userId}/activity`);
          if (!response.ok) throw new Error('Failed to fetch activity logs');

          const logs = await response.json();
          set((state) => ({
            activityLogs: {
              ...state.activityLogs,
              [userId]: logs,
            },
          }));

          return logs;
        },

        // Add an activity log entry (for local state management)
        addActivityLog: (userId, log) => {
          const newLog: ActivityLog = {
            ...log,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            activityLogs: {
              ...state.activityLogs,
              [userId]: [newLog, ...(state.activityLogs[userId] || [])],
            },
          }));
        },

        // Set filters
        setFilters: (newFilters) => {
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          }));
        },

        // Set sort
        setSort: (sort) => {
          set({ sort });
        },

        // Reset filters to default
        resetFilters: () => {
          set({ filters: defaultFilters });
        },

        // Toggle user selection
        toggleUserSelection: (id) => {
          set((state) => ({
            selectedUserIds: state.selectedUserIds.includes(id)
              ? state.selectedUserIds.filter((uid) => uid !== id)
              : [...state.selectedUserIds, id],
          }));
        },

        // Select all visible users
        selectAllUsers: () => {
          set((state) => ({
            selectedUserIds: state.users.map((user) => user.id),
          }));
        },

        // Clear selection
        clearSelection: () => {
          set({ selectedUserIds: [] });
        },

        // Refresh users (alias for fetchUsers)
        refreshUsers: async () => {
          await get().actions.fetchUsers();
        },
      },
    }),
    { name: 'UserStore' }
  )
);

// Selector hooks for better performance
export const useUsers = () => useUserStore((state) => state.users);
export const useUserFilters = () => useUserStore((state) => state.filters);
export const useUserSort = () => useUserStore((state) => state.sort);
export const useSelectedUserIds = () => useUserStore((state) => state.selectedUserIds);
export const useUserActions = () => useUserStore((state) => state.actions);
export const useIsLoadingUsers = () => useUserStore((state) => state.isLoading);
