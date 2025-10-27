import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';
import { TicketStats, Ticket } from '@/types/ticket';

let ticketsDb: Ticket[] = JSON.parse(JSON.stringify(mockTickets));

export async function GET(request: NextRequest) {
  try {
    const activeTickets = ticketsDb.filter((t) => !t.isDeleted);

    // Count by status
    const byStatus = {
      new: activeTickets.filter((t) => t.status === 'new').length,
      in_progress: activeTickets.filter((t) => t.status === 'in_progress').length,
      waiting: activeTickets.filter((t) => t.status === 'waiting').length,
      resolved: activeTickets.filter((t) => t.status === 'resolved').length,
      closed: activeTickets.filter((t) => t.status === 'closed').length,
    };

    // Count by priority
    const byPriority = {
      critical: activeTickets.filter((t) => t.priority === 'critical').length,
      high: activeTickets.filter((t) => t.priority === 'high').length,
      medium: activeTickets.filter((t) => t.priority === 'medium').length,
      low: activeTickets.filter((t) => t.priority === 'low').length,
    };

    // Count by category
    const byCategory = {
      bug: activeTickets.filter((t) => t.category === 'bug').length,
      feature: activeTickets.filter((t) => t.category === 'feature').length,
      support: activeTickets.filter((t) => t.category === 'support').length,
      billing: activeTickets.filter((t) => t.category === 'billing').length,
      account: activeTickets.filter((t) => t.category === 'account').length,
      general: activeTickets.filter((t) => t.category === 'general').length,
      other: activeTickets.filter((t) => t.category === 'other').length,
    };

    // Calculate averages
    const resolvedTickets = activeTickets.filter((t) => t.resolutionTime !== null);
    const avgResolutionTime =
      resolvedTickets.length > 0
        ? Math.round(
            resolvedTickets.reduce((acc, t) => acc + (t.resolutionTime || 0), 0) /
              resolvedTickets.length
          )
        : 0;

    // Count open tickets
    const openTickets = activeTickets.filter(
      (t) => t.status !== 'resolved' && t.status !== 'closed'
    ).length;

    // Count resolved today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = activeTickets.filter((t) => {
      if (!t.resolvedAt) return false;
      const resolvedDate = new Date(t.resolvedAt);
      resolvedDate.setHours(0, 0, 0, 0);
      return resolvedDate.getTime() === today.getTime();
    }).length;

    // Calculate SLA compliance
    const now = new Date();
    let slaCompliant = 0;
    let overdueTickets = 0;

    activeTickets.forEach((t) => {
      if (t.status === 'closed' || t.status === 'resolved') {
        // For completed tickets, check if they were resolved before due date
        if (t.resolvedAt) {
          const resolvedDate = new Date(t.resolvedAt);
          const dueDate = new Date(t.dueDate);
          if (resolvedDate <= dueDate) {
            slaCompliant++;
          }
        }
      } else {
        // For open tickets, check if current time is before due date
        const dueDate = new Date(t.dueDate);
        if (now <= dueDate) {
          slaCompliant++;
        } else {
          overdueTickets++;
        }
      }
    });

    const slaCompliance =
      activeTickets.length > 0
        ? Math.round((slaCompliant / activeTickets.length) * 100)
        : 0;

    const stats: TicketStats = {
      totalTickets: activeTickets.length,
      openTickets,
      resolvedToday,
      avgResolutionTime,
      slaCompliance,
      overdueTickets,
      byStatus,
      byPriority,
      byCategory,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in GET /api/support/stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
