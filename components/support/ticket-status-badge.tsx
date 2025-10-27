import { TicketStatus } from '@/types/ticket';
import { Badge } from '@/components/ui/badge';
import {
  Circle,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';

const statusConfig: Record<TicketStatus, { label: string; variant: any; icon: any }> = {
  new: {
    label: 'New',
    variant: 'default',
    icon: Circle,
  },
  in_progress: {
    label: 'In Progress',
    variant: 'secondary',
    icon: Clock,
  },
  waiting: {
    label: 'Waiting',
    variant: 'outline',
    icon: AlertCircle,
  },
  resolved: {
    label: 'Resolved',
    variant: 'default',
    icon: CheckCircle,
  },
  closed: {
    label: 'Closed',
    variant: 'secondary',
    icon: XCircle,
  },
};

interface TicketStatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export function TicketStatusBadge({ status, size = 'md' }: TicketStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {config.label}
    </Badge>
  );
}
