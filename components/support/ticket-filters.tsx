'use client';

import { useState } from 'react';
import { TicketCategory, TicketPriority, TicketStatus } from '@/types/ticket';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search, RotateCcw, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

const statusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Priority' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const categoryOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'support', label: 'Support' },
  { value: 'billing', label: 'Billing' },
  { value: 'account', label: 'Account' },
  { value: 'general', label: 'General' },
];

const slaStatusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All SLA' },
  { value: 'on_time', label: 'On Time' },
  { value: 'due_soon', label: 'Due Soon' },
  { value: 'overdue', label: 'Overdue' },
];

const commonTags = ['urgent', 'mobile', 'authentication', 'backend', 'feature-request', 'bug', 'performance', 'critical-system'];

interface TicketFiltersProps {
  filters: {
    search: string;
    status: string;
    priority: string;
    category: string;
    tags: string[];
    slaStatus: string;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  onExport?: () => void;
}

export function TicketFilters({ filters, onFiltersChange, onReset, onExport }: TicketFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleReset = () => {
    setSearchInput('');
    onReset();
  };

  const hasActiveFilters =
    searchInput ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.tags.length > 0 ||
    filters.slaStatus !== 'all';

  return (
    <Card className="p-4 space-y-4">
      {/* Search and Controls */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by ID, title, customer..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Status
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Priority
          </label>
          <Select
            value={filters.priority}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, priority: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Category
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, category: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            SLA Status
          </label>
          <Select
            value={filters.slaStatus}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, slaStatus: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {slaStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tag Filter */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
              {filters.tags.includes(tag) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          {filters.tags.length > 0 && (
            <span>
              Filtering by {filters.tags.length} tag
              {filters.tags.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
