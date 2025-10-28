'use client';

import { TicketMessage } from '@/types/ticket';
import { TicketMessageItem } from './ticket-message-item';
import { format, isSameDay } from 'date-fns';

interface MessageGroupProps {
  messages: TicketMessage[];
  showDateSeparator?: boolean;
}

export function MessageGroup({ messages, showDateSeparator = false }: MessageGroupProps) {
  if (messages.length === 0) return null;

  const firstMessage = messages[0];
  const messageDate = new Date(firstMessage.createdAt);
  const isConsecutiveGroup = messages.every(msg => msg.authorId === firstMessage.authorId);

  return (
    <div className="space-y-3">
      {showDateSeparator && (
        <div className="flex items-center gap-3 my-6 px-0">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          <time className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2">
            {format(messageDate, 'MMMM d, yyyy')}
          </time>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
        </div>
      )}

      {isConsecutiveGroup ? (
        // For grouped messages from same author
        <div className="space-y-1">
          {messages.map((message, index) => (
            <div key={message.id} className={index === 0 ? '' : '-mt-2'}>
              <TicketMessageItem
                message={message}
                showAuthor={index === 0}
                isGrouped={true}
              />
            </div>
          ))}
        </div>
      ) : (
        // For single message
        <TicketMessageItem message={firstMessage} />
      )}
    </div>
  );
}
