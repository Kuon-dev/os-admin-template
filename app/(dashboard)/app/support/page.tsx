'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTicketStore, useTickets, useTicketStats, useTicketActions, useTicketFilters } from '@/stores/ticket-store';
import { TicketStatsCards } from '@/components/support/ticket-stats-cards';
import { TicketFilters } from '@/components/support/ticket-filters';
import { TicketTable } from '@/components/support/ticket-table';
import { TicketDialog } from '@/components/support/ticket-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Ticket } from '@/types/ticket';

export default function SupportPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tickets = useTickets();
  const stats = useTicketStats();
  const filters = useTicketFilters();
  const actions = useTicketActions();

  useEffect(() => {
    const loadData = async () => {
      try {
        await actions.fetchTickets();
      } catch (error) {
        toast.error('Failed to load tickets');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [actions]);

  // Filter tickets based on current filters
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((t) =>
        filters.tags.some((tag) => t.tags.includes(tag))
      );
    }

    // SLA status filter
    if (filters.slaStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter((t) => {
        const dueDate = new Date(t.dueDate);
        const timeRemaining = dueDate.getTime() - now.getTime();
        const hoursRemaining = timeRemaining / (1000 * 60 * 60);

        if (filters.slaStatus === 'overdue') {
          return hoursRemaining < 0;
        } else if (filters.slaStatus === 'due_soon') {
          return hoursRemaining >= 0 && hoursRemaining < 4;
        } else if (filters.slaStatus === 'on_time') {
          return hoursRemaining >= 4;
        }
        return true;
      });
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.ticketNumber.toLowerCase().includes(searchLower) ||
          t.customerName.toLowerCase().includes(searchLower) ||
          t.customerEmail.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [tickets, filters]);

  const handleCreateTicket = async (data: any) => {
    try {
      await actions.createTicket(data);
      toast.success('Ticket created successfully');
    } catch (error) {
      toast.error('Failed to create ticket');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Manage customer support requests</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <TicketStatsCards stats={stats} />

      {/* Create Ticket Dialog */}
      <TicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateTicket}
      />

      {/* Filters */}
      <TicketFilters
        filters={filters}
        onFiltersChange={actions.setFilters}
        onReset={actions.resetFilters}
      />

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <TicketTable tickets={filteredTickets} />
      </motion.div>
    </motion.div>
  );
}
