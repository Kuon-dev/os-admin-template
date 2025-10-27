'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTicketStore, useCurrentTicket, useMessages, useTicketActions } from '@/stores/ticket-store';
import { TicketConversation } from '@/components/support/ticket-conversation';
import { TicketReplyForm } from '@/components/support/ticket-reply-form';
import { TicketMetadataPanel } from '@/components/support/ticket-metadata-panel';
import { TicketStatusBadge } from '@/components/support/ticket-status-badge';
import { TicketPriorityBadge } from '@/components/support/ticket-priority-badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

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
        <h2 className="text-xl font-semibold text-gray-900">Ticket not found</h2>
        <p className="text-gray-500 mt-2">The ticket you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/app/support')} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/app/support')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{ticket.ticketNumber}</h1>
            <p className="text-gray-600 text-lg">{ticket.title}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteTicket}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status and Priority Controls */}
          <div className="bg-white dark:bg-slate-950 rounded-lg border p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Select
                  value={ticket.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Priority
                </label>
                <div className="flex items-center">
                  <TicketPriorityBadge priority={ticket.priority} />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-950 rounded-lg border p-4">
            <h2 className="font-semibold text-lg mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Conversation */}
          <div className="bg-white dark:bg-slate-950 rounded-lg border p-4">
            <h2 className="font-semibold text-lg mb-4">Conversation</h2>
            <TicketConversation
              messages={messages}
              isLoading={isLoading}
            />
          </div>

          {/* Reply Form */}
          <TicketReplyForm onSubmit={handleAddMessage} />
        </div>

        {/* Sidebar */}
        <div>
          <TicketMetadataPanel ticket={ticket} />
        </div>
      </div>
    </motion.div>
  );
}
