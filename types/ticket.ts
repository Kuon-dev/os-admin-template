export type TicketStatus = 'new' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'bug' | 'feature' | 'support' | 'billing' | 'account' | 'general' | 'other';
export type MessageType = 'customer' | 'agent' | 'internal' | 'system';

export interface Ticket {
  id: string;
  ticketNumber: string; // TKT-001, TKT-002, etc.
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  tags: string[];

  // Customer info
  customerName: string;
  customerEmail: string;

  // Assignment
  assignedTo: string | null;
  assignedToName: string | null;

  // SLA tracking
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  resolvedAt: string | null;
  closedAt: string | null;

  // Metrics
  firstResponseAt: string | null;
  responseTime: number | null;
  resolutionTime: number | null;

  // Metadata
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  type: MessageType;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
  isInternal: boolean;
  attachments: string[];
}

export interface TicketFilters {
  search: string;
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  category: TicketCategory | 'all';
  tags: string[];
  assignee: string | 'all' | 'unassigned';
  slaStatus: 'all' | 'on_time' | 'due_soon' | 'overdue';
  dateRange: {
    from: string | null;
    to: string | null;
  };
}

export interface TicketStats {
  totalTickets: number;
  openTickets: number;
  resolvedToday: number;
  avgResolutionTime: number;
  slaCompliance: number;
  overdueTickets: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
  byCategory: Record<TicketCategory, number>;
}

export type CreateTicketData = Omit<
  Ticket,
  'id' | 'createdAt' | 'updatedAt' | 'resolvedAt' | 'closedAt' | 'firstResponseAt' | 'responseTime' | 'resolutionTime' | 'isDeleted' | 'deletedAt'
>;

export type UpdateTicketData = Partial<CreateTicketData>;

export type CreateMessageData = Omit<TicketMessage, 'id' | 'createdAt'>;
