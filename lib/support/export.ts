import { Ticket } from '@/types/ticket';
import { format } from 'date-fns';

export function exportTicketsToCSV(tickets: Ticket[], filename = 'support_tickets.csv') {
  // Define CSV headers
  const headers = [
    'Ticket ID',
    'Title',
    'Customer Name',
    'Customer Email',
    'Status',
    'Priority',
    'Category',
    'Tags',
    'Created Date',
    'Due Date',
    'Response Time (min)',
    'Resolution Time (min)',
  ];

  // Convert tickets to CSV rows
  const rows = tickets.map((ticket) => [
    ticket.ticketNumber,
    `"${ticket.title}"`, // Quote title in case it contains commas
    ticket.customerName,
    ticket.customerEmail,
    ticket.status,
    ticket.priority,
    ticket.category,
    `"${ticket.tags.join(', ')}"`, // Quote tags
    format(new Date(ticket.createdAt), 'yyyy-MM-dd HH:mm'),
    format(new Date(ticket.dueDate), 'yyyy-MM-dd HH:mm'),
    ticket.responseTime?.toString() || 'N/A',
    ticket.resolutionTime?.toString() || 'N/A',
  ]);

  // Combine headers and rows
  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTicketsSummary(tickets: Ticket[], filename = 'ticket_summary.txt') {
  const summary = {
    'Total Tickets': tickets.length,
    'By Status': {
      'New': tickets.filter((t) => t.status === 'new').length,
      'In Progress': tickets.filter((t) => t.status === 'in_progress').length,
      'Waiting': tickets.filter((t) => t.status === 'waiting').length,
      'Resolved': tickets.filter((t) => t.status === 'resolved').length,
      'Closed': tickets.filter((t) => t.status === 'closed').length,
    },
    'By Priority': {
      'Critical': tickets.filter((t) => t.priority === 'critical').length,
      'High': tickets.filter((t) => t.priority === 'high').length,
      'Medium': tickets.filter((t) => t.priority === 'medium').length,
      'Low': tickets.filter((t) => t.priority === 'low').length,
    },
    'By Category': {
      'Bug': tickets.filter((t) => t.category === 'bug').length,
      'Feature': tickets.filter((t) => t.category === 'feature').length,
      'Support': tickets.filter((t) => t.category === 'support').length,
      'Billing': tickets.filter((t) => t.category === 'billing').length,
      'Account': tickets.filter((t) => t.category === 'account').length,
      'General': tickets.filter((t) => t.category === 'general').length,
      'Other': tickets.filter((t) => t.category === 'other').length,
    },
  };

  const text = `SUPPORT TICKETS SUMMARY
Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}

${JSON.stringify(summary, null, 2)}`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
