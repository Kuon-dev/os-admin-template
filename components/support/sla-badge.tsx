'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SLABadgeProps {
  dueDate: string;
  resolved: boolean;
}

export function SLABadge({ dueDate, resolved }: SLABadgeProps) {
  const [status, setStatus] = useState<'overdue' | 'due_soon' | 'on_time'>('on_time');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const due = new Date(dueDate);
      const diff = due.getTime() - now.getTime();

      if (diff < 0) {
        setStatus('overdue');
        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setTimeRemaining(`${days > 0 ? `${days}d ` : ''}${hours}h overdue`);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days === 0 && hours < 4) {
          setStatus('due_soon');
          setTimeRemaining(`${hours}h left`);
        } else {
          setStatus('on_time');
          setTimeRemaining(`${days > 0 ? `${days}d ` : ''}${hours}h left`);
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [dueDate]);

  if (resolved) {
    return (
      <Badge variant="outline" className="gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
        <CheckCircle className="w-3 h-3" />
        Resolved
      </Badge>
    );
  }

  const variantStyles = {
    on_time: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    due_soon: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    overdue: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  const icons = {
    on_time: Clock,
    due_soon: AlertTriangle,
    overdue: AlertTriangle,
  };

  const Icon = icons[status];

  return (
    <Badge variant="outline" className={`gap-1 ${variantStyles[status]}`}>
      <Icon className="w-3 h-3" />
      {timeRemaining}
    </Badge>
  );
}
