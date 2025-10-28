import { Ticket } from '@/types/ticket';
import { StatusSelector } from './status-selector';
import { AssigneeSelector } from './assignee-selector';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { SLABadge } from './sla-badge';

interface QuickActionBarProps {
  ticket: Ticket;
  onStatusChange: (status: string) => void;
  onAssigneeChange: (assigneeId: string | null) => void;
}

export function QuickActionBar({
  ticket,
  onStatusChange,
  onAssigneeChange,
}: QuickActionBarProps) {
  return (
    <div className="flex items-center gap-4 py-3 px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950">
      <StatusSelector value={ticket.status as any} onChange={onStatusChange as any} />
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Priority
        </span>
        <TicketPriorityBadge priority={ticket.priority} />
      </div>
      <AssigneeSelector value={ticket.assignedTo} onChange={onAssigneeChange} />
      <SLABadge dueDate={ticket.dueDate} resolved={ticket.status === 'resolved' || ticket.status === 'closed'} />
    </div>
  );
}
