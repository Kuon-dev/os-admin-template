import { TicketPriority } from '@/types/ticket';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, AlertOctagon, Zap } from 'lucide-react';

const priorityConfig: Record<TicketPriority, { label: string; color: string; icon: any }> = {
  critical: {
    label: 'Critical',
    color: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500',
    icon: AlertOctagon,
  },
  high: {
    label: 'High',
    color: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500',
    icon: AlertTriangle,
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:text-gray-900',
    icon: AlertCircle,
  },
  low: {
    label: 'Low',
    color: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500',
    icon: Zap,
  },
};

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

export function TicketPriorityBadge({ priority, size = 'md' }: TicketPriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-white text-sm font-medium ${config.color}`}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {config.label}
    </div>
  );
}
