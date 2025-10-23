'use client';

import { motion } from 'motion/react';
import {
  Calendar,
  CalendarOff,
  Search,
  Filter,
  Plus,
  CalendarPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeIn, slideUp } from '@/lib/utils/motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'no-shifts' | 'no-results' | 'filtered';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  type,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'no-shifts':
        return {
          icon: CalendarOff,
          title: title || 'No Shifts Scheduled',
          description:
            description ||
            'There are no shifts scheduled for this day. Add a shift to get started.',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted/50',
        };
      case 'no-results':
        return {
          icon: Search,
          title: title || 'No Results Found',
          description:
            description ||
            'No shifts match your search query. Try adjusting your search terms.',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted/50',
        };
      case 'filtered':
        return {
          icon: Filter,
          title: title || 'No Matching Shifts',
          description:
            description ||
            'No shifts match your current filters. Try adjusting or clearing your filters.',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted/50',
        };
      default:
        return {
          icon: Calendar,
          title: title || 'No Data',
          description: description || 'No information to display',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted/50',
        };
    }
  };

  const content = getDefaultContent();
  const Icon = content.icon;

  if (compact) {
    return (
      <motion.div
        {...fadeIn}
        className={cn(
          'flex flex-col items-center justify-center py-8 px-4 text-center',
          className
        )}
      >
        <Icon className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{content.title}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...slideUp}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center space-y-6',
        className
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={cn(
          'rounded-full p-6',
          content.iconBg
        )}
      >
        <Icon className={cn('h-12 w-12', content.iconColor)} />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="space-y-2 max-w-md"
      >
        <h3 className="text-xl font-semibold tracking-tight">
          {content.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {content.description}
        </p>
      </motion.div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          {action && (
            <Button onClick={action.onClick} size="lg" className="gap-2">
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {secondaryAction.icon && (
                <secondaryAction.icon className="h-4 w-4" />
              )}
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Predefined empty state configurations for common scenarios
export function NoShiftsEmptyState({
  onAddShift,
  compact = false,
}: {
  onAddShift?: () => void;
  compact?: boolean;
}) {
  return (
    <EmptyState
      type="no-shifts"
      action={
        onAddShift
          ? {
              label: 'Add Shift',
              onClick: onAddShift,
              icon: Plus,
            }
          : undefined
      }
      compact={compact}
    />
  );
}

export function NoSearchResultsEmptyState({
  onClearSearch,
  compact = false,
}: {
  onClearSearch?: () => void;
  compact?: boolean;
}) {
  return (
    <EmptyState
      type="no-results"
      action={
        onClearSearch
          ? {
              label: 'Clear Search',
              onClick: onClearSearch,
              icon: Search,
            }
          : undefined
      }
      compact={compact}
    />
  );
}

export function FilteredEmptyState({
  onClearFilters,
  onAddShift,
  compact = false,
}: {
  onClearFilters?: () => void;
  onAddShift?: () => void;
  compact?: boolean;
}) {
  return (
    <EmptyState
      type="filtered"
      action={
        onClearFilters
          ? {
              label: 'Clear Filters',
              onClick: onClearFilters,
              icon: Filter,
            }
          : undefined
      }
      secondaryAction={
        onAddShift
          ? {
              label: 'Add Shift',
              onClick: onAddShift,
              icon: CalendarPlus,
            }
          : undefined
      }
      compact={compact}
    />
  );
}
