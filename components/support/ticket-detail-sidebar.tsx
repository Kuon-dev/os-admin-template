import { Ticket } from '@/types/ticket';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Building2, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TicketDetailSidebarProps {
  ticket: Ticket;
}

export function TicketDetailSidebar({ ticket }: TicketDetailSidebarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="sticky top-24 w-full max-w-sm space-y-4 lg:max-w-none lg:w-80">
      {/* Contact Information */}
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-semibold">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{getInitials(ticket.customerName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm">{ticket.customerName}</p>
              <p className="text-xs text-muted-foreground">Customer</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <a href={`mailto:${ticket.customerEmail}`} className="truncate text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {ticket.customerEmail}
              </a>
            </div>
            {/* Phone placeholder */}
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
            </div>
            {/* Organization placeholder */}
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Organization Inc</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-semibold">Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Created</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>

          {ticket.firstResponseAt && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">First Response</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(ticket.firstResponseAt), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          )}

          {ticket.resolvedAt && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Resolved</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(ticket.resolvedAt), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          )}

          {!ticket.resolvedAt && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">Resolution</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* SLA Information */}
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-semibold">SLA Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">First Response</span>
            <Badge
              variant="secondary"
              className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            >
              Met
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Resolution Time</span>
            <Badge
              variant="secondary"
              className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
            >
              2h 15m left
            </Badge>
          </div>
          <Separator />
          <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-900/20 p-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-200">
              High priority ticket - Resolution due by 6:45 PM
            </p>
          </div>
        </div>
      </Card>

      {/* Related Tickets */}
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-semibold">Related Tickets</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/50 cursor-pointer">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">#TKT-2801</p>
              <p className="text-xs text-muted-foreground">Login issues after update</p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              Closed
            </Badge>
          </div>
          <div className="flex items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/50 cursor-pointer">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">#TKT-2756</p>
              <p className="text-xs text-muted-foreground">Dashboard loading slowly</p>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              Resolved
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
