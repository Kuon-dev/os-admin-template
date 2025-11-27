'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTickets, useTicketStats, useTicketActions, useTicketFilters } from '@/stores/ticket-store';
import { TicketStatsCards } from '@/components/support/ticket-stats-cards';
import { TicketFilters } from '@/components/support/ticket-filters';
import { TicketTable } from '@/components/support/ticket-table';
import { TicketDialog } from '@/components/support/ticket-dialog';
import { TicketDeleteDialog } from '@/components/support/ticket-delete-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Edit, Trash, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Ticket } from '@/types/ticket';
import { exportTicketsToCSV } from '@/lib/support/export';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

export default function SupportPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);

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

  const handleCreateTicket = useCallback(async (data: any, isEdit?: boolean) => {
    try {
      if (isEdit && editingTicket) {
        await actions.updateTicket(editingTicket.id, data);
        toast.success('Ticket updated', {
          description: `${data.title} has been updated successfully.`,
        });
        setEditingTicket(null);
      } else {
        await actions.createTicket(data);
        toast.success('Ticket created', {
          description: `${data.title} has been added.`,
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: isEdit ? 'Failed to update ticket. Please try again.' : 'Failed to create ticket. Please try again.',
      });
      throw error;
    }
  }, [editingTicket, actions]);

  const handleCreateNewTicket = useCallback(() => {
    setEditingTicket(null);
    setDialogOpen(true);
  }, []);

  const handleEditTicket = useCallback((ticket: Ticket) => {
    setEditingTicket(ticket);
    setDialogOpen(true);
  }, []);

  const handleDeleteTicket = useCallback((ticket: Ticket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!ticketToDelete) return;
    setIsDeleting(true);
    try {
      await actions.deleteTicket(ticketToDelete.id);
      toast.success('Ticket deleted', {
        description: `${ticketToDelete.ticketNumber} has been removed.`,
      });
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to delete ticket. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  }, [ticketToDelete, actions]);

  const handleExport = useCallback(() => {
    try {
      exportTicketsToCSV(filteredTickets);
      toast.success('Export successful', {
        description: `Exported ${filteredTickets.length} tickets to CSV.`,
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to export tickets. Please try again.',
      });
    }
  }, [filteredTickets]);

  const handleSelectionChange = useCallback((count: number, tickets: Ticket[]) => {
    setSelectedCount(count);
    setSelectedTickets(tickets);
  }, []);

  const handleBulkDelete = useCallback(async () => {
    try {
      await Promise.all(selectedTickets.map(ticket => actions.deleteTicket(ticket.id)));
      toast.success('Tickets deleted', {
        description: `Deleted ${selectedCount} ticket${selectedCount > 1 ? 's' : ''} successfully.`,
      });
      setSelectedCount(0);
      setSelectedTickets([]);
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to delete tickets. Please try again.',
      });
    }
  }, [selectedTickets, selectedCount, actions]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Cmd+N or Ctrl+N for new ticket
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleCreateNewTicket();
      }

      // Escape to close dialogs
      if (e.key === 'Escape') {
        if (dialogOpen) setDialogOpen(false);
        if (deleteDialogOpen) setDeleteDialogOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogOpen, deleteDialogOpen, handleCreateNewTicket]);

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading tickets...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-5xl flex flex-col h-full relative"
    >
      {/* Bulk Actions Banner - Toast-like overlay */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
          >
            <div className="bg-background border border-border rounded-lg px-4 py-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {selectedCount} {selectedCount === 1 ? 'ticket' : 'tickets'} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3 text-xs"
                  >
                    <Edit className="mr-1.5 h-3 w-3" />
                    Bulk Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={handleBulkDelete}
                  >
                    <Trash className="mr-1.5 h-3 w-3" />
                    Delete Selected
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 ml-2"
                    onClick={() => {
                      setSelectedCount(0);
                      setSelectedTickets([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - 4pt grid: 24px bottom spacing */}
      <motion.div variants={headerVariants} className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-muted-foreground">
          Manage customer support requests
        </p>
      </motion.div>

      {/* Stats Cards - 4pt grid: 24px bottom spacing */}
      <div className="mb-6">
        <TicketStatsCards stats={stats} />
      </div>

      {/* Filters - 4pt grid: 24px bottom spacing */}
      <div className="mb-6">
        <TicketFilters
          filters={filters}
          onFiltersChange={actions.setFilters}
          onReset={actions.resetFilters}
          onExport={handleExport}
          onCreate={handleCreateNewTicket}
          resultCount={filteredTickets.length}
        />
      </div>

      {/* Table - Flexible height */}
      <div className="flex-1 min-h-0 pb-6">
        <TicketTable
          tickets={filteredTickets}
          onEditTicket={handleEditTicket}
          onDeleteTicket={handleDeleteTicket}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Create/Edit Ticket Dialog */}
      <TicketDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTicket(null);
          }
          setDialogOpen(open);
        }}
        onSubmit={handleCreateTicket}
        ticket={editingTicket}
      />

      {/* Delete Confirmation Dialog */}
      <TicketDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        ticketNumber={ticketToDelete?.ticketNumber || ''}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
