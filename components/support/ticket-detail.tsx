'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTicketStore, useCurrentTicket, useMessages, useTicketActions } from '@/stores/ticket-store';
import { TicketDetailMessages } from './ticket-detail-messages';
import { TicketDetailReplyForm } from './ticket-detail-reply-form';
import { TicketDetailSidebar } from './ticket-detail-sidebar';
import { QuickActionsCard } from './quick-actions-card';
import { getTeamMemberName } from '@/lib/support/assignees';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Loader2, MoreVertical, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function TicketDetail() {
  const router = useRouter();
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ticket = useCurrentTicket();
  const messages = useMessages(ticketId || '');
  const actions = useTicketActions();

  // Get ticket ID from localStorage or URL
  useEffect(() => {
    const id = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('id') || localStorage.getItem('selectedTicketId')
      : null;

    if (id) {
      setTicketId(id);
    }
  }, []);

  useEffect(() => {
    if (!ticketId) return;

    const loadData = async () => {
      try {
        await actions.fetchTicket(ticketId);
      } catch (error) {
        toast.error('Failed to load ticket');
        router.push('/app/support');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ticketId, actions, router]);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticketId) return;
    try {
      await actions.updateTicket(ticketId, { status: newStatus as any });
      toast.success('Ticket status updated');
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  const handleAssigneeChange = async (assigneeId: string | null) => {
    if (!ticketId) return;
    try {
      await actions.updateTicket(ticketId, {
        assignedTo: assigneeId,
        assignedToName: assigneeId ? getTeamMemberName(assigneeId) : null,
      });
      toast.success('Ticket assigned successfully');
    } catch (error) {
      toast.error('Failed to assign ticket');
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticketId) return;
    try {
      await actions.updateTicket(ticketId, { priority: newPriority as any });
      toast.success('Ticket priority updated');
    } catch (error) {
      toast.error('Failed to update ticket priority');
    }
  };

  const handleAddMessage = async (data: { content: string; isInternal: boolean }) => {
    if (!ticket || !ticketId) return;

    try {
      await actions.addMessage(ticketId, {
        type: data.isInternal ? 'internal' : 'agent',
        content: data.content,
        authorId: 'current-user',
        authorName: 'Admin User',
        authorAvatar: null,
        isInternal: data.isInternal,
        attachments: [],
        ticketId,
      });
      toast.success('Reply added successfully');
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Ticket not found</h2>
          <p className="text-muted-foreground">The ticket you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/app/support')}>Back to Tickets</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => router.push('/app/support')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Badge variant="outline" className="shrink-0 font-mono text-xs">
              {ticket.ticketNumber}
            </Badge>
            <h1 className="truncate text-lg font-semibold lg:text-xl">
              {ticket.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto flex flex-1 gap-6 px-4 py-6 lg:px-6">
        {/* Main Column */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Quick Actions */}
          <QuickActionsCard
            ticket={ticket}
            onStatusChange={handleStatusChange}
            onAssigneeChange={handleAssigneeChange}
            onPriorityChange={handlePriorityChange}
          />

          {/* Messages */}
          <TicketDetailMessages messages={messages} isLoading={isLoading} />

          {/* Reply Form */}
          <TicketDetailReplyForm onSubmit={handleAddMessage} isInternal={false} />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <TicketDetailSidebar ticket={ticket} />
        </div>

        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg lg:hidden"
            >
              <Info className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Ticket Details</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <TicketDetailSidebar ticket={ticket} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
