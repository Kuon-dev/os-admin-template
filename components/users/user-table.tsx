'use client';

import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Activity } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User, UserSort } from '@/types/user';
import {
  getRoleBadgeVariant,
  getStatusColor,
  getInitials,
  formatDate,
  formatDateTime,
} from '@/lib/users/user-utils';

interface UserTableProps {
  users: User[];
  sort: UserSort;
  onSortChange: (sort: UserSort) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewActivity: (user: User) => void;
}

export function UserTable({
  users,
  sort,
  onSortChange,
  onEdit,
  onDelete,
  onViewActivity,
}: UserTableProps) {
  const handleSort = (field: keyof User) => {
    if (sort.field === field) {
      onSortChange({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  };

  const SortButton = ({ field, children }: { field: keyof User; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Activity className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No users found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            No users match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <SortButton field="name">User</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="role">Role</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="lastLogin">Last Login</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="loginCount">Logins</SortButton>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`capitalize ${getStatusColor(user.status)}`}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  className="cursor-help"
                  title={formatDateTime(user.lastLogin)}
                >
                  {formatDate(user.lastLogin)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground">{user.loginCount}</span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit user
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewActivity(user)}>
                      <Activity className="mr-2 h-4 w-4" />
                      View activity
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
