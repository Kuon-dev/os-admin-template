import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';
import { mockTicketMessages } from '@/lib/mock-data/ticket-messages';
import { Ticket, TicketMessage } from '@/types/ticket';

let ticketsDb: Ticket[] = JSON.parse(JSON.stringify(mockTickets));
let messagesDb: Record<string, TicketMessage[]> = JSON.parse(JSON.stringify(mockTicketMessages));

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = ticketsDb.find((t) => t.id === params.id && !t.isDeleted);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const messages = messagesDb[params.id] || [];
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error in GET /api/support/[id]/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const ticket = ticketsDb.find((t) => t.id === params.id && !t.isDeleted);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const newMessage: TicketMessage = {
      id: crypto.randomUUID(),
      ticketId: params.id,
      type: body.type || 'agent',
      content: body.content,
      authorId: body.authorId,
      authorName: body.authorName,
      authorAvatar: body.authorAvatar || null,
      createdAt: new Date().toISOString(),
      isInternal: body.isInternal || false,
      attachments: body.attachments || [],
    };

    if (!messagesDb[params.id]) {
      messagesDb[params.id] = [];
    }

    messagesDb[params.id].push(newMessage);

    // Update ticket's firstResponseAt if this is the first response and not from customer
    if (
      body.type !== 'customer' &&
      !ticket.firstResponseAt &&
      !ticket.isDeleted
    ) {
      const ticketIndex = ticketsDb.findIndex((t) => t.id === params.id);
      if (ticketIndex !== -1) {
        ticketsDb[ticketIndex].firstResponseAt = newMessage.createdAt;
        ticketsDb[ticketIndex].responseTime = Math.floor(
          (new Date(newMessage.createdAt).getTime() -
            new Date(ticket.createdAt).getTime()) /
            (1000 * 60)
        );
        ticketsDb[ticketIndex].updatedAt = newMessage.createdAt;
      }
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/support/[id]/messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
