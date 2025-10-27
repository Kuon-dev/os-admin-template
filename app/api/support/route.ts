import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';
import { Ticket, TicketFilters } from '@/types/ticket';
import { addDays } from 'date-fns';

let ticketsDb: Ticket[] = JSON.parse(JSON.stringify(mockTickets));

const calculateSLADueDate = (priority: Ticket['priority']): string => {
  const now = new Date();
  const slaHours: Record<Ticket['priority'], number> = {
    critical: 4,
    high: 24,
    medium: 48,
    low: 72,
  };

  return addDays(now, slaHours[priority] / 24).toISOString();
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';
    const category = searchParams.get('category') || 'all';
    const tags = searchParams.getAll('tags');
    const assignee = searchParams.get('assignee') || 'all';
    const slaStatus = searchParams.get('slaStatus') || 'all';

    let filtered = ticketsDb.filter((t) => !t.isDeleted);

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.ticketNumber.toLowerCase().includes(searchLower) ||
          t.customerName.toLowerCase().includes(searchLower) ||
          t.customerEmail.toLowerCase().includes(searchLower)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (priority !== 'all') {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    if (category !== 'all') {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (tags.length > 0) {
      filtered = filtered.filter((t) => tags.some((tag) => t.tags.includes(tag)));
    }

    if (assignee !== 'all') {
      if (assignee === 'unassigned') {
        filtered = filtered.filter((t) => t.assignedTo === null);
      } else {
        filtered = filtered.filter((t) => t.assignedTo === assignee);
      }
    }

    if (slaStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter((t) => {
        const dueDate = new Date(t.dueDate);
        const timeRemaining = dueDate.getTime() - now.getTime();
        const hoursRemaining = timeRemaining / (1000 * 60 * 60);

        if (slaStatus === 'overdue') {
          return hoursRemaining < 0;
        } else if (slaStatus === 'due_soon') {
          return hoursRemaining >= 0 && hoursRemaining < 4;
        } else if (slaStatus === 'on_time') {
          return hoursRemaining >= 4;
        }
        return true;
      });
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error in GET /api/support:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      ticketNumber: `TKT-${String(ticketsDb.length + 1).padStart(3, '0')}`,
      title: body.title,
      description: body.description,
      status: 'new',
      priority: body.priority,
      category: body.category,
      tags: body.tags || [],
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      assignedTo: body.assignedTo || null,
      assignedToName: body.assignedToName || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: calculateSLADueDate(body.priority),
      resolvedAt: null,
      closedAt: null,
      firstResponseAt: null,
      responseTime: null,
      resolutionTime: null,
      isDeleted: false,
      deletedAt: null,
    };

    ticketsDb.push(newTicket);
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/support:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
