'use client';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { NodeType, NodeStatus } from '@/types/dependency-graph';
import { mockOwners } from '@/lib/dependencies/mockData';
import { Search, X } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  filters: {
    nodeTypes: NodeType[];
    statuses: NodeStatus[];
    owners: string[];
  };
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: {
    nodeTypes: NodeType[];
    statuses: NodeStatus[];
    owners: string[];
  }) => void;
}

const nodeTypes: NodeType[] = ['project', 'epic', 'feature', 'task', 'milestone'];
const statuses: NodeStatus[] = ['planning', 'in-progress', 'completed', 'blocked', 'on-hold'];

export function FilterPanel({
  searchQuery,
  filters,
  onSearchChange,
  onFiltersChange,
}: FilterPanelProps) {
  const toggleNodeType = (type: NodeType) => {
    const newTypes = filters.nodeTypes.includes(type)
      ? filters.nodeTypes.filter(t => t !== type)
      : [...filters.nodeTypes, type];
    onFiltersChange({ ...filters, nodeTypes: newTypes });
  };

  const toggleStatus = (status: NodeStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const toggleOwner = (owner: string) => {
    const newOwners = filters.owners.includes(owner)
      ? filters.owners.filter(o => o !== owner)
      : [...filters.owners, owner];
    onFiltersChange({ ...filters, owners: newOwners });
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onFiltersChange({ nodeTypes: [], statuses: [], owners: [] });
  };

  const hasActiveFilters = searchQuery || filters.nodeTypes.length > 0 ||
    filters.statuses.length > 0 || filters.owners.length > 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm mb-1">Filters</h3>
            <p className="text-xs text-muted-foreground">
              Filter nodes by type, status, or owner
            </p>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <Separator />

        {/* Search */}
        <div className="space-y-2">
          <Label className="text-xs">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>

        <Separator />

        {/* Node Types */}
        <div className="space-y-2">
          <Label className="text-xs">Node Type</Label>
          <div className="space-y-2">
            {nodeTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.nodeTypes.includes(type)}
                  onCheckedChange={() => toggleNodeType(type)}
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-xs font-normal capitalize cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-xs">Status</Label>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.statuses.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-xs font-normal capitalize cursor-pointer"
                >
                  {status.replace('-', ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Owners */}
        <div className="space-y-2">
          <Label className="text-xs">Owner</Label>
          <div className="space-y-2">
            {mockOwners.map((owner) => (
              <div key={owner} className="flex items-center space-x-2">
                <Checkbox
                  id={`owner-${owner}`}
                  checked={filters.owners.includes(owner)}
                  onCheckedChange={() => toggleOwner(owner)}
                />
                <label
                  htmlFor={`owner-${owner}`}
                  className="text-xs font-normal cursor-pointer"
                >
                  {owner}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
