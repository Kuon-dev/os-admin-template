'use client';

import type { PropertyStatus } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
  variant?: 'default' | 'outline' | 'secondary';
}

const statusConfig: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  available: {
    label: 'Available',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  sold: {
    label: 'Sold',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  rented: {
    label: 'Rented',
    className:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  under_offer: {
    label: 'Under Offer',
    className:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
  maintenance: {
    label: 'Maintenance',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
};

export function PropertyStatusBadge({
  status,
  variant = 'default',
}: PropertyStatusBadgeProps) {
  const config = statusConfig[status];

  if (variant === 'outline') {
    return (
      <Badge
        variant="outline"
        className={cn('capitalize', config.className)}
      >
        {config.label}
      </Badge>
    );
  }

  return (
    <Badge
      className={cn('capitalize', config.className)}
    >
      {config.label}
    </Badge>
  );
}
