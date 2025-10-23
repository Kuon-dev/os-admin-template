'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export interface ActivityItem {
  id: string;
  user?: {
    name: string;
    avatar?: string;
  };
  icon?: LucideIcon;
  title: string;
  description: string;
  time: string;
  type?: 'success' | 'warning' | 'error' | 'info';
}

interface ActivityFeedProps {
  items: ActivityItem[];
  maxItems?: number;
}

const typeConfig = {
  success: {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500',
  },
  warning: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
  error: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
  },
  info: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
};

export function ActivityFeed({ items, maxItems = 10 }: ActivityFeedProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <div className="space-y-1">
      {displayItems.map((item, index) => {
        const Icon = item.icon;
        const type = item.type || 'info';
        const config = typeConfig[type];

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="group relative flex gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            {/* Timeline line */}
            {index < displayItems.length - 1 && (
              <div className="absolute left-[29px] top-12 h-[calc(100%+4px)] w-px bg-border" />
            )}

            {/* Icon or Avatar */}
            <div className="relative">
              {item.user ? (
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {item.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              ) : Icon ? (
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 border-background',
                    config.bg
                  )}
                >
                  <Icon className={cn('h-4 w-4', config.text)} />
                </div>
              ) : (
                <div className="h-10 w-10" />
              )}
              {/* Activity dot */}
              <div
                className={cn(
                  'absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background',
                  config.dot
                )}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1 pt-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-tight">{item.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
