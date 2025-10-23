'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { UserStatsCompact } from '@/components/users/user-stats-compact';
import { UserFiltersEnhanced } from '@/components/users/user-filters-enhanced';
import { DataTable } from '@/components/users/data-table';
import { createColumns } from '@/components/users/columns';
import { UserDialogEnhanced } from '@/components/users/user-dialog-enhanced';
import { UserActivityDialog } from '@/components/users/user-activity-dialog';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import {
  useUsers,
  useUserFilters,
  useUserActions,
  useIsLoadingUsers,
} from '@/stores/user-store';
import {
  calculateUserStats,
  filterUsers,
} from '@/lib/users/user-utils';
import { exportUsersToCSV } from '@/lib/users/export-users';
import type { User, UserFormData } from '@/types/user';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

export default function UsersPageEnhanced() {
  const users = useUsers();
  const filters = useUserFilters();
  const actions = useUserActions();
  const isLoading = useIsLoadingUsers();

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users on mount
  useEffect(() => {
    actions.fetchUsers();
  }, []);

  // Calculate filtered users
  const filteredUsers = useMemo(() => {
    return filterUsers(users, filters);
  }, [users, filters]);

  // Calculate statistics
  const stats = useMemo(() => calculateUserStats(users), [users]);

  // Handlers
  const handleCreateUser = useCallback(() => {
    setSelectedUser(null);
    setIsUserDialogOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleViewActivity = useCallback((user: User) => {
    setSelectedUser(user);
    setIsActivityDialogOpen(true);
  }, []);

  const handleUserSubmit = async (data: UserFormData) => {
    try {
      if (selectedUser) {
        await actions.updateUser(selectedUser.id, data);
        toast.success('User updated', {
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        await actions.createUser(data);
        toast.success('User created', {
          description: `${data.name} has been added to your team.`,
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: selectedUser
          ? 'Failed to update user. Please try again.'
          : 'Failed to create user. Please try again.',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await actions.deleteUser(userToDelete.id);
      toast.success('User deleted', {
        description: `${userToDelete.name} has been removed from your team.`,
      });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to delete user. Please try again.',
      });
    }
  };

  const handleExport = () => {
    exportUsersToCSV(filteredUsers);
    toast.success('Export successful', {
      description: `Exported ${filteredUsers.length} users to CSV.`,
    });
  };

  // Create columns with callbacks
  const columns = useMemo(
    () =>
      createColumns({
        onEdit: handleEditUser,
        onDelete: handleDeleteUser,
        onViewActivity: handleViewActivity,
      }),
    [handleEditUser, handleDeleteUser, handleViewActivity]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Cmd+N or Ctrl+N for new user
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleCreateUser();
      }

      // Escape to close dialogs
      if (e.key === 'Escape') {
        if (isUserDialogOpen) setIsUserDialogOpen(false);
        if (isActivityDialogOpen) setIsActivityDialogOpen(false);
        if (isDeleteDialogOpen) setIsDeleteDialogOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUserDialogOpen, isActivityDialogOpen, isDeleteDialogOpen, handleCreateUser]);

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading users...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-5xl space-y-6"
    >
      {/* Header - 4pt grid: 24px bottom spacing */}
      <motion.div variants={headerVariants} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage your team members and their access
        </p>
      </motion.div>

      {/* Stats Cards - 4pt grid: 24px bottom spacing */}
      <UserStatsCompact stats={stats} />

      {/* Filters - 4pt grid: 24px bottom spacing */}
      <UserFiltersEnhanced
        filters={filters}
        onFiltersChange={(newFilters) => actions.setFilters(newFilters)}
        onReset={() => actions.resetFilters()}
        onExport={handleExport}
        onCreate={handleCreateUser}
        resultCount={filteredUsers.length}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        searchQuery={filters.search}
      />

      {/* Dialogs */}
      <UserDialogEnhanced
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        user={selectedUser}
        onSubmit={handleUserSubmit}
      />

      <UserActivityDialog
        open={isActivityDialogOpen}
        onOpenChange={setIsActivityDialogOpen}
        user={selectedUser}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  );
}
