import { Ticket } from '@/types/ticket';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface QuickActionsCardProps {
  ticket: Ticket;
  onStatusChange: (status: string) => void;
  onAssigneeChange: (assigneeId: string | null) => void;
  onPriorityChange: (priority: string) => void;
}

const statusLabels: Record<string, string> = {
  new: 'New',
  in_progress: 'In Progress',
  waiting: 'Waiting',
  resolved: 'Resolved',
  closed: 'Closed',
};

const priorityLabels: Record<string, string> = {
  low: '⚪ Low',
  medium: '🟢 Medium',
  high: '🟡 High',
  critical: '🔴 Critical',
};

const assigneeLabels: Record<string, string> = {
  sarah: 'Sarah Chen',
  mike: 'Mike Johnson',
  alex: 'Alex Rivera',
  unassigned: 'Unassigned',
};

export function QuickActionsCard({
  ticket,
  onStatusChange,
  onAssigneeChange,
  onPriorityChange,
}: QuickActionsCardProps) {
  const getPriorityIcon = (priority: string) => {
    const icons: Record<string, string> = {
      low: '⚪',
      medium: '🟢',
      high: '🟡',
      critical: '🔴',
    };
    return icons[priority] || '◯';
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500',
      in_progress: 'bg-purple-500',
      waiting: 'bg-amber-500',
      resolved: 'bg-green-500',
      closed: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <Card className="p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select value={ticket.status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  {statusLabels[ticket.status]}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  New
                </div>
              </SelectItem>
              <SelectItem value="in_progress">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  In Progress
                </div>
              </SelectItem>
              <SelectItem value="waiting">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  Waiting
                </div>
              </SelectItem>
              <SelectItem value="resolved">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Resolved
                </div>
              </SelectItem>
              <SelectItem value="closed">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gray-500" />
                  Closed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Priority</label>
          <Select value={ticket.priority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority">
                {priorityLabels[ticket.priority]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <span>⚪</span>
                  Low
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <span>🟢</span>
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <span>🟡</span>
                  High
                </div>
              </SelectItem>
              <SelectItem value="critical">
                <div className="flex items-center gap-2">
                  <span>🔴</span>
                  Critical
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assignee */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Assignee</label>
          <Select
            value={ticket.assignedTo || 'unassigned'}
            onValueChange={(value) => onAssigneeChange(value === 'unassigned' ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Unassigned">
                {assigneeLabels[ticket.assignedTo || 'unassigned']}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              <SelectItem value="sarah">Sarah Chen</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
              <SelectItem value="alex">Alex Rivera</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* SLA Status */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">SLA Status</label>
          <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-muted/50 px-3">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">2h 15m left</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
