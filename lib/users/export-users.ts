import type { User } from '@/types/user';

/**
 * Exports users data to CSV format and triggers a download
 */
export function exportUsersToCSV(users: User[], filename = 'users-export.csv') {
  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Email',
    'Role',
    'Status',
    'Created At',
    'Updated At',
    'Last Login',
    'Login Count',
  ];

  // Convert users to CSV rows
  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.role,
    user.status,
    formatDateForCSV(user.createdAt),
    formatDateForCSV(user.updatedAt),
    user.lastLogin ? formatDateForCSV(user.lastLogin) : 'Never',
    user.loginCount.toString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => escapeCSVCell(cell)).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date for CSV export
 */
function formatDateForCSV(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Escape CSV cell content (handle commas, quotes, newlines)
 */
function escapeCSVCell(cell: string): string {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

/**
 * Export filtered/selected users
 */
export function exportFilteredUsers(
  allUsers: User[],
  selectedIds: string[],
  filename?: string
) {
  const usersToExport =
    selectedIds.length > 0
      ? allUsers.filter((user) => selectedIds.includes(user.id))
      : allUsers;

  exportUsersToCSV(usersToExport, filename);
}
