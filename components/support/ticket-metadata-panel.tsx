import { Ticket } from '@/types/ticket';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketStatusBadge } from './ticket-status-badge';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { TicketSLAIndicator } from './ticket-sla-indicator';
import { teamMembers, getTeamMemberName } from '@/lib/support/assignees';
import { format } from 'date-fns';
import {
  User,
  Mail,
  Tag,
  Calendar,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface TicketMetadataPanelProps {
  ticket: Ticket;
  onAssigneeChange?: (assigneeId: string | null) => Promise<void>;
}

export function TicketMetadataPanel({ ticket, onAssigneeChange }: TicketMetadataPanelProps) {
  const capitalizeCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleAssigneeChange = async (assigneeId: string) => {
    const id = assigneeId === 'unassigned' ? null : assigneeId;
    await onAssigneeChange?.(id);
  };

  return (
    <div className="space-y-4">
      {/* Status & Priority */}
      <Card className="p-4 space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
          <div className="mt-2">
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
          <div className="mt-2">
            <TicketPriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </Card>

      {/* SLA */}
      <Card className="p-4 space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">SLA Due Date</label>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-700">
              {format(new Date(ticket.dueDate), 'MMM d, yyyy h:mm a')}
            </p>
            <TicketSLAIndicator
              dueDate={ticket.dueDate}
              resolved={ticket.status === 'resolved' || ticket.status === 'closed'}
            />
          </div>
        </div>
      </Card>

      {/* Assignee */}
      <Card className="p-4">
        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
          Assigned To
        </label>
        <Select
          value={ticket.assignedTo || 'unassigned'}
          onValueChange={handleAssigneeChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Customer Info */}
      <Card className="p-4 space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase block">
          Customer Information
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">{ticket.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <a href={`mailto:${ticket.customerEmail}`} className="text-blue-600 hover:underline">
              {ticket.customerEmail}
            </a>
          </div>
        </div>
      </Card>

      {/* Category */}
      <Card className="p-4">
        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
          Category
        </label>
        <Badge variant="outline">{capitalizeCategory(ticket.category)}</Badge>
      </Card>

      {/* Tags */}
      {ticket.tags.length > 0 && (
        <Card className="p-4">
          <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {ticket.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card className="p-4 space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase block">Timeline</label>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-600">Created</p>
              <p className="text-gray-800">{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>

          {ticket.firstResponseAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-600">First Response</p>
                <p className="text-gray-800">
                  {format(new Date(ticket.firstResponseAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          )}

          {ticket.resolvedAt && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-600">Resolved</p>
                <p className="text-gray-800">
                  {format(new Date(ticket.resolvedAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
