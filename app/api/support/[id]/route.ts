import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';
import { Ticket } from '@/types/ticket';

let ticketsDb: Ticket[] = JSON.parse(JSON.stringify(mockTickets));

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = ticketsDb.find((t) => t.id === id && !t.isDeleted);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error in GET /api/support/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const ticketIndex = ticketsDb.findIndex((t) => t.id === id && !t.isDeleted);

    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const updatedTicket: Ticket = {
      ...ticketsDb[ticketIndex],
      ...body,
      id: ticketsDb[ticketIndex].id,
      ticketNumber: ticketsDb[ticketIndex].ticketNumber,
      createdAt: ticketsDb[ticketIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };

    // Handle status changes
    if (body.status && body.status !== ticketsDb[ticketIndex].status) {
      if (body.status === 'resolved' && !updatedTicket.resolvedAt) {
        updatedTicket.resolvedAt = new Date().toISOString();
        updatedTicket.resolutionTime = Math.floor(
          (new Date(updatedTicket.resolvedAt).getTime() -
            new Date(updatedTicket.createdAt).getTime()) /
            (1000 * 60)
        );
      }
      if (body.status === 'closed' && !updatedTicket.closedAt) {
        updatedTicket.closedAt = new Date().toISOString();
      }
    }

    ticketsDb[ticketIndex] = updatedTicket;
    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error in PUT /api/support/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticketIndex = ticketsDb.findIndex((t) => t.id === id && !t.isDeleted);

    if (ticketIndex === -1) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    ticketsDb[ticketIndex] = {
      ...ticketsDb[ticketIndex],
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/support/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
