import { Ticket } from '@/types/ticket';
import { Badge } from '@/components/ui/badge';
import { TicketSLAIndicator } from './ticket-sla-indicator';
import { User, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface TicketMetadataPanelProps {
  ticket: Ticket;
  onAssigneeChange?: (assigneeId: string | null) => Promise<void>;
}

export function TicketMetadataPanel({ ticket, onAssigneeChange }: TicketMetadataPanelProps) {
  const capitalizeCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-8 max-w-sm">
      {/* Section 1: Contact Info */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-4">
          Contact
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {ticket.customerName}
              </p>
              <a href={`mailto:${ticket.customerEmail}`}
                 className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                {ticket.customerEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Organization */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-4">
          Organization
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Category</p>
            <Badge variant="outline">{capitalizeCategory(ticket.category)}</Badge>
          </div>
          {ticket.tags.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {ticket.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Timeline & SLA */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-4">
          Timeline
        </h3>
        <div className="space-y-3">
          {/* Timeline events */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Created</span>
              <time className="text-gray-900 dark:text-gray-100 font-medium"
                    title={format(new Date(ticket.createdAt), 'PPpp')}>
                {format(new Date(ticket.createdAt), 'MMM d')}
              </time>
            </div>

            {ticket.firstResponseAt && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">First response</span>
                <time className="text-gray-900 dark:text-gray-100 font-medium">
                  {format(new Date(ticket.firstResponseAt), 'MMM d, h:mm a')}
                </time>
              </div>
            )}

            {ticket.resolvedAt && (
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Resolved</span>
                <time className="text-gray-900 dark:text-gray-100 font-medium">
                  {format(new Date(ticket.resolvedAt), 'MMM d, h:mm a')}
                </time>
              </div>
            )}
          </div>

          {/* SLA Info */}
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg mt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">SLA Due</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              {format(new Date(ticket.dueDate), 'MMM d, h:mm a')}
            </p>
            <TicketSLAIndicator
              dueDate={ticket.dueDate}
              resolved={ticket.status === 'resolved' || ticket.status === 'closed'}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
