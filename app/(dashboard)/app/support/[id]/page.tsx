'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTicketStore, useCurrentTicket, useMessages, useTicketActions } from '@/stores/ticket-store';
import { TicketConversation } from '@/components/support/ticket-conversation';
import { TicketReplyForm } from '@/components/support/ticket-reply-form';
import { TicketMetadataPanel } from '@/components/support/ticket-metadata-panel';
import { QuickActionBar } from '@/components/support/quick-action-bar';
import { getTeamMemberName } from '@/lib/support/assignees';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ticket = useCurrentTicket();
  const messages = useMessages(ticketId);
  const actions = useTicketActions();

  useEffect(() => {
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

  const handleAddMessage = async (data: { content: string; isInternal: boolean }) => {
    if (!ticket) return;

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await actions.updateTicket(ticketId, { status: newStatus as any });
      toast.success('Ticket status updated');
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  const handleAssigneeChange = async (assigneeId: string | null) => {
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

  const handleDeleteTicket = async () => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await actions.deleteTicket(ticketId);
      toast.success('Ticket deleted');
      router.push('/app/support');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ticket not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">The ticket you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/app/support')} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 space-y-3">
          {/* Row 1: Navigation & Title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-baseline gap-3 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={() => router.push('/app/support')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {ticket.ticketNumber}
                </h1>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white truncate">
                  {ticket.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {ticket.customerName} • {ticket.customerEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={handleDeleteTicket}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Row 2: Quick Actions Bar */}
          <div className="pl-10">
            <QuickActionBar
              ticket={ticket}
              onStatusChange={handleStatusChange}
              onAssigneeChange={handleAssigneeChange}
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
            {/* DESCRIPTION SECTION */}
            <section className="space-y-2">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                <span>Created {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}</span>
                <span>Category: {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</span>
                {ticket.tags.length > 0 && (
                  <span>Tags: {ticket.tags.join(', ')}</span>
                )}
              </div>
            </section>

            {/* CONVERSATION SECTION */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conversation
              </h2>
              <TicketConversation
                messages={messages}
                isLoading={isLoading}
              />
            </section>

            {/* METADATA PANEL (below on desktop, accessible via drawer on mobile) */}
            <section className="hidden lg:block pt-4 border-t border-gray-200 dark:border-gray-800">
              <TicketMetadataPanel
                ticket={ticket}
                onAssigneeChange={handleAssigneeChange}
              />
            </section>
          </div>
        </div>

        {/* STICKY REPLY FORM AT BOTTOM */}
        <div className="px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <TicketReplyForm onSubmit={handleAddMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
