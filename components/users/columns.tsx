'use client';

import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { User } from '@/types/user';
import {
  getRoleBadgeVariant,
  getStatusColor,
  getInitials,
  formatDate,
  formatDateTime,
} from '@/lib/users/user-utils';

export type UserColumn = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  role: User['role'];
  status: User['status'];
  lastLogin: string | null;
  loginCount: number;
};

interface ActionsMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewActivity: (user: User) => void;
}

function ActionsMenu({ user, onEdit, onDelete, onViewActivity }: ActionsMenuProps) {
  return (
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
  );
}

export function createColumns({
  onEdit,
  onDelete,
  onViewActivity,
}: {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewActivity: (user: User) => void;
}) {
  return [
    {
      id: 'select',
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'user',
      accessorKey: 'name',
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 h-auto p-2"
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const user = row.original as User;
        return (
          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 h-auto p-2"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const user = row.original as User;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                  {user.role}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {user.role === 'admin' && 'Full system access'}
                  {user.role === 'editor' && 'Can edit content'}
                  {user.role === 'user' && 'Basic access'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 h-auto p-2"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const user = row.original as User;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`capitalize ${getStatusColor(user.status)}`}
                >
                  <span className="mr-1.5">●</span>
                  {user.status}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {user.lastLogin
                    ? `Last active: ${formatDateTime(user.lastLogin)}`
                    : 'Never logged in'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: 'lastLogin',
      accessorKey: 'lastLogin',
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 h-auto p-2"
        >
          Last Login
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const user = row.original as User;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-sm text-muted-foreground">
                  {formatDate(user.lastLogin)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{formatDateTime(user.lastLogin)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: 'loginCount',
      accessorKey: 'loginCount',
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 h-auto p-2"
        >
          Logins
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const user = row.original as User;
        return (
          <span className="text-sm text-muted-foreground">
            {user.loginCount.toLocaleString()}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => {
        const user = row.original as User;
        return (
          <div className="flex justify-end">
            <ActionsMenu
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewActivity={onViewActivity}
            />
          </div>
        );
      },
    },
  ];
}
