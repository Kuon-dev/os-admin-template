'use client';

import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { OrderFilters, OrderStatus, PaymentStatus, OrderPriority } from '@/types/order';

interface OrdersFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: Partial<OrderFilters>) => void;
  onReset: () => void;
  resultCount: number;
}

export function OrdersFilters({
  filters,
  onFiltersChange,
  onReset,
  resultCount,
}: OrdersFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.status !== 'all' ||
    filters.paymentStatus !== 'all' ||
    filters.priority !== 'all';

  const activeFilterCount = [
    filters.status !== 'all',
    filters.paymentStatus !== 'all',
    filters.priority !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="h-9 pl-10 pr-10 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ status: value as OrderStatus | 'all' })}
          >
            <SelectTrigger className="h-9 w-[130px] text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentStatus}
            onValueChange={(value) =>
              onFiltersChange({ paymentStatus: value as PaymentStatus | 'all' })
            }
          >
            <SelectTrigger className="h-9 w-[120px] text-sm">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) =>
              onFiltersChange({ priority: value as OrderPriority | 'all' })
            }
          >
            <SelectTrigger className="h-9 w-[110px] text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 gap-1.5 text-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results count and active filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {resultCount} {resultCount === 1 ? 'order' : 'orders'}
        </span>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Filter className="h-3 w-3" />
            {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'}
          </Badge>
        )}
      </div>
    </div>
  );
}
