import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';
import { Ticket } from '@/types/ticket';

let ticketsDb: Ticket[] = JSON.parse(JSON.stringify(mockTickets));

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, data } = body;

    if (!Array.isArray(ids) || !data) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const updatedTickets: Ticket[] = [];

    ids.forEach((id: string) => {
      const ticketIndex = ticketsDb.findIndex((t) => t.id === id && !t.isDeleted);
      if (ticketIndex !== -1) {
        const updatedTicket: Ticket = {
          ...ticketsDb[ticketIndex],
          ...data,
          id: ticketsDb[ticketIndex].id,
          ticketNumber: ticketsDb[ticketIndex].ticketNumber,
          createdAt: ticketsDb[ticketIndex].createdAt,
          updatedAt: new Date().toISOString(),
        };

        ticketsDb[ticketIndex] = updatedTicket;
        updatedTickets.push(updatedTicket);
      }
    });

    return NextResponse.json(updatedTickets);
  } catch (error) {
    console.error('Error in PUT /api/support/bulk:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
