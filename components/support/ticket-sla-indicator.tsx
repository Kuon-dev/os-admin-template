import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface TicketSLAIndicatorProps {
  dueDate: string;
  resolved?: boolean;
}

export function TicketSLAIndicator({ dueDate, resolved }: TicketSLAIndicatorProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [status, setStatus] = useState<'overdue' | 'due_soon' | 'on_time'>('on_time');

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const due = new Date(dueDate);
      const diff = due.getTime() - now.getTime();

      if (diff < 0) {
        setStatus('overdue');
        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h overdue`);
        } else {
          setTimeRemaining(`${hours}h overdue`);
        }
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days === 0 && hours < 4) {
          setStatus('due_soon');
          setTimeRemaining(`${hours}h remaining`);
        } else {
          setStatus('on_time');
          if (days > 0) {
            setTimeRemaining(`${days}d ${hours}h remaining`);
          } else {
            setTimeRemaining(`${hours}h remaining`);
          }
        }
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [dueDate]);

  if (resolved) {
    return (
      <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="h-4 w-4" />
        <span>Resolved</span>
      </div>
    );
  }

  if (status === 'overdue') {
    return (
      <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 font-medium">
        <AlertTriangle className="h-4 w-4" />
        <span>{timeRemaining}</span>
      </div>
    );
  }

  if (status === 'due_soon') {
    return (
      <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
        <Clock className="h-4 w-4" />
        <span>{timeRemaining}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
      <Clock className="h-4 w-4" />
      <span>{timeRemaining}</span>
    </div>
  );
}
