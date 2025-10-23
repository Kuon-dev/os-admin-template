'use client';

import { Search, X, Download, UserPlus, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { UserFilters } from '@/types/user';

interface UserFiltersEnhancedProps {
  filters: UserFilters;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
  onReset: () => void;
  onExport: () => void;
  onCreate: () => void;
  resultCount?: number;
}

export function UserFiltersEnhanced({
  filters,
  onFiltersChange,
  onReset,
  onExport,
  onCreate,
  resultCount,
}: UserFiltersEnhancedProps) {
  const hasActiveFilters =
    filters.search || filters.role !== 'all' || filters.status !== 'all';

  const activeFilterCount = [
    filters.search && 'search',
    filters.role !== 'all' && 'role',
    filters.status !== 'all' && 'status',
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Primary toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search with keyboard hint */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10 pr-20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <AnimatePresence>
              {filters.search && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onFiltersChange({ search: '' })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.role}
            onValueChange={(value) =>
              onFiltersChange({ role: value as UserFilters['role'] })
            }
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ status: value as UserFilters['status'] })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="default" onClick={onExport}>
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Export users to CSV</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="default" onClick={onCreate}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create User</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Add new team member (⌘N)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Active filters indicator */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {resultCount !== undefined && `Found ${resultCount} user${resultCount !== 1 ? 's' : ''}`}
              </span>
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3 w-3" />
                {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
              </Badge>

              <AnimatePresence>
                {filters.search && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="outline" className="gap-1">
                      Search: "{filters.search}"
                      <button
                        onClick={() => onFiltersChange({ search: '' })}
                        className="ml-1 hover:bg-muted rounded-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {filters.role !== 'all' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="outline" className="gap-1 capitalize">
                      Role: {filters.role}
                      <button
                        onClick={() => onFiltersChange({ role: 'all' })}
                        className="ml-1 hover:bg-muted rounded-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {filters.status !== 'all' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="outline" className="gap-1 capitalize">
                      Status: {filters.status}
                      <button
                        onClick={() => onFiltersChange({ status: 'all' })}
                        className="ml-1 hover:bg-muted rounded-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="shrink-0"
            >
              <X className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
