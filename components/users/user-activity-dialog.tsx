'use client';

import { useEffect, useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Inbox, Loader2 } from 'lucide-react';
import type { User, ActivityLog } from '@/types/user';
import {
  getActivityActionText,
  getActivityActionIconComponent,
} from '@/lib/users/user-utils';
import { cn } from '@/lib/utils';

interface UserActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

interface GroupedActivity {
  date: string;
  logs: ActivityLog[];
}

export function UserActivityDialog({
  open,
  onOpenChange,
  user,
}: UserActivityDialogProps) {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      // Reset state when dialog opens
      setActivityLogs([]);
      fetchActivityLogs(user.id);
    }
  }, [open, user]);

  const fetchActivityLogs = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/activity`);
      if (!response.ok) throw new Error('Failed to fetch activity logs');
      const logs = await response.json();
      setActivityLogs(logs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setActivityLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityLog[]> = {};

    activityLogs.forEach((log) => {
      const date = new Date(log.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });

    return Object.entries(groups).map(([date, logs]) => ({
      date,
      logs,
    }));
  }, [activityLogs]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-5 pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">Activity Timeline</DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {user ? `${user.name}'s activity history` : 'Loading...'}
              </DialogDescription>
            </div>
            {activityLogs.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activityLogs.length} {activityLogs.length === 1 ? 'event' : 'events'}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading && activityLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Loading activity...</p>
            </div>
          ) : activityLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
                <Inbox className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No activity yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                This user hasn't performed any actions yet. Activity will appear here once they start using the system.
              </p>
            </div>
          ) : (
            <Virtuoso
              data={groupedActivities}
              className="h-full"
              itemContent={(index, group) => (
                <div className="px-4 py-2">
                  {/* Date Header */}
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2 mb-2">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {group.date}
                    </h3>
                  </div>

                  {/* Activities for this date */}
                  <div className="space-y-2">
                    {group.logs.map((log) => {
                      const IconComponent = getActivityActionIconComponent(log.action);

                      return (
                        <Card
                          key={log.id}
                          className={cn(
                            "group overflow-hidden",
                            "transition-all duration-200 ease-out",
                            "hover:shadow-md hover:border-foreground/20"
                          )}
                        >
                          <div className="flex gap-3 p-3">
                            {/* Icon */}
                            <div className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              "border border-border bg-muted/50",
                              "transition-all duration-200",
                              "group-hover:bg-muted group-hover:border-foreground/30"
                            )}>
                              <IconComponent className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="font-medium text-sm text-foreground leading-snug">
                                  {getActivityActionText(log.action)}
                                </h4>
                                <time className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                                  {new Date(log.timestamp).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </time>
                              </div>
                              <p className="text-sm text-muted-foreground leading-snug">
                                {log.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
