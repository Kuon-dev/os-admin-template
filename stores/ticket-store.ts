import { create } from 'zustand';
import { useMemo } from 'react';
import { Ticket, TicketMessage, TicketFilters, TicketStats, CreateTicketData, UpdateTicketData, CreateMessageData } from '@/types/ticket';

interface TicketStore {
  // State
  tickets: Ticket[];
  currentTicket: Ticket | null;
  messages: Record<string, TicketMessage[]>;
  filters: TicketFilters;
  stats: TicketStats | null;
  isLoading: boolean;

  // Actions
  fetchTickets: () => Promise<void>;
  fetchTicket: (id: string) => Promise<void>;
  createTicket: (data: CreateTicketData) => Promise<Ticket>;
  updateTicket: (id: string, data: UpdateTicketData) => Promise<Ticket>;
  deleteTicket: (id: string) => Promise<void>;
  bulkUpdateTickets: (ids: string[], data: Partial<Ticket>) => Promise<void>;
  fetchMessages: (ticketId: string) => Promise<void>;
  addMessage: (ticketId: string, message: CreateMessageData) => Promise<TicketMessage>;
  fetchStats: () => Promise<void>;
  setFilters: (filters: Partial<TicketFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: TicketFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  tags: [],
  assignee: 'all',
  slaStatus: 'all',
  dateRange: {
    from: null,
    to: null,
  },
};

export const useTicketStore = create<TicketStore>((set, get) => ({
  // Initial state
  tickets: [],
  currentTicket: null,
  messages: {},
  filters: defaultFilters,
  stats: null,
  isLoading: false,

  // Actions
  fetchTickets: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/support');
      const data = await response.json();
      set({ tickets: data });
      await get().fetchStats();
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTicket: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/support/${id}`);
      const data = await response.json();
      set({ currentTicket: data });
      await get().fetchMessages(id);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      set({ currentTicket: null });
    } finally {
      set({ isLoading: false });
    }
  },

  createTicket: async (data: CreateTicketData) => {
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const newTicket = await response.json();
      set((state) => ({
        tickets: [newTicket, ...state.tickets],
      }));
      await get().fetchStats();
      return newTicket;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  },

  updateTicket: async (id: string, data: UpdateTicketData) => {
    try {
      const response = await fetch(`/api/support/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      const updatedTicket = await response.json();
      set((state) => ({
        tickets: state.tickets.map((t) => (t.id === id ? updatedTicket : t)),
        currentTicket: state.currentTicket?.id === id ? updatedTicket : state.currentTicket,
      }));
      await get().fetchStats();
      return updatedTicket;
    } catch (error) {
      console.error('Failed to update ticket:', error);
      throw error;
    }
  },

  deleteTicket: async (id: string) => {
    try {
      const response = await fetch(`/api/support/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== id),
        currentTicket: state.currentTicket?.id === id ? null : state.currentTicket,
      }));
      await get().fetchStats();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      throw error;
    }
  },

  bulkUpdateTickets: async (ids: string[], data: Partial<Ticket>) => {
    try {
      const response = await fetch('/api/support/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, data }),
      });

      if (!response.ok) {
        throw new Error('Failed to bulk update tickets');
      }

      const updatedTickets = await response.json();
      set((state) => ({
        tickets: state.tickets.map((t) => updatedTickets.find((u: Ticket) => u.id === t.id) || t),
      }));
      await get().fetchStats();
    } catch (error) {
      console.error('Failed to bulk update tickets:', error);
      throw error;
    }
  },

  fetchMessages: async (ticketId: string) => {
    try {
      const response = await fetch(`/api/support/${ticketId}/messages`);
      const data = await response.json();
      set((state) => ({
        messages: {
          ...state.messages,
          [ticketId]: data,
        },
      }));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  },

  addMessage: async (ticketId: string, message: CreateMessageData) => {
    try {
      const response = await fetch(`/api/support/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to add message');
      }

      const newMessage = await response.json();
      set((state) => ({
        messages: {
          ...state.messages,
          [ticketId]: [...(state.messages[ticketId] || []), newMessage],
        },
      }));
      return newMessage;
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    }
  },

  fetchStats: async () => {
    try {
      const response = await fetch('/api/support/stats');
      const data = await response.json();
      set({ stats: data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  setFilters: (newFilters: Partial<TicketFilters>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },
}));

// Selector hooks for performance
export const useTickets = () => useTicketStore((state) => state.tickets);
export const useCurrentTicket = () => useTicketStore((state) => state.currentTicket);
export const useMessages = (ticketId: string) =>
  useTicketStore((state) => state.messages[ticketId] || []);
export const useTicketFilters = () => useTicketStore((state) => state.filters);
export const useTicketStats = () => useTicketStore((state) => state.stats);
export const useTicketIsLoading = () => useTicketStore((state) => state.isLoading);

// Individual action hooks to avoid object identity issues
export const useFetchTickets = () => useTicketStore((state) => state.fetchTickets);
export const useFetchTicket = () => useTicketStore((state) => state.fetchTicket);
export const useCreateTicket = () => useTicketStore((state) => state.createTicket);
export const useUpdateTicket = () => useTicketStore((state) => state.updateTicket);
export const useDeleteTicket = () => useTicketStore((state) => state.deleteTicket);
export const useBulkUpdateTickets = () => useTicketStore((state) => state.bulkUpdateTickets);
export const useFetchMessages = () => useTicketStore((state) => state.fetchMessages);
export const useAddMessage = () => useTicketStore((state) => state.addMessage);
export const useFetchStats = () => useTicketStore((state) => state.fetchStats);
export const useSetFilters = () => useTicketStore((state) => state.setFilters);
export const useResetFilters = () => useTicketStore((state) => state.resetFilters);

// Convenience hook that combines all actions
// Memoized to prevent object identity changes and infinite loops
export const useTicketActions = () => {
  const fetchTickets = useFetchTickets();
  const fetchTicket = useFetchTicket();
  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const bulkUpdateTickets = useBulkUpdateTickets();
  const fetchMessages = useFetchMessages();
  const addMessage = useAddMessage();
  const fetchStats = useFetchStats();
  const setFilters = useSetFilters();
  const resetFilters = useResetFilters();

  // Memoize to ensure stable object reference
  return useMemo(
    () => ({
      fetchTickets,
      fetchTicket,
      createTicket,
      updateTicket,
      deleteTicket,
      bulkUpdateTickets,
      fetchMessages,
      addMessage,
      fetchStats,
      setFilters,
      resetFilters,
    }),
    [
      fetchTickets,
      fetchTicket,
      createTicket,
      updateTicket,
      deleteTicket,
      bulkUpdateTickets,
      fetchMessages,
      addMessage,
      fetchStats,
      setFilters,
      resetFilters,
    ]
  );
};
