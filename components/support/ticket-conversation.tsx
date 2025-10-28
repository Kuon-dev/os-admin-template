'use client';

import { useEffect, useRef, useMemo } from 'react';
import { TicketMessage } from '@/types/ticket';
import { MessageGroup } from './message-group';
import { motion } from 'motion/react';
import { isSameDay } from 'date-fns';

interface TicketConversationProps {
  messages: TicketMessage[];
  isLoading?: boolean;
}

interface MessageGroupItem {
  id: string;
  messages: TicketMessage[];
  showDateSeparator: boolean;
}

export function TicketConversation({ messages, isLoading }: TicketConversationProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Group messages by date and then by consecutive author
  const groupedMessages = useMemo(() => {
    if (messages.length === 0) return [];

    const groups: MessageGroupItem[] = [];
    let currentGroup: TicketMessage[] = [messages[0]];
    let currentDate = new Date(messages[0].createdAt);
    let lastAuthorId = messages[0].authorId;
    let showDateSeparator = true;

    for (let i = 1; i < messages.length; i++) {
      const message = messages[i];
      const messageDate = new Date(message.createdAt);
      const isSameAuthor = message.authorId === lastAuthorId;
      const isSameDateGroup = isSameDay(currentDate, messageDate);

      if (isSameAuthor && isSameDateGroup) {
        // Add to current group
        currentGroup.push(message);
      } else {
        // Save current group and start a new one
        groups.push({
          id: `group-${currentGroup[0].id}`,
          messages: currentGroup,
          showDateSeparator,
        });

        currentGroup = [message];
        lastAuthorId = message.authorId;
        showDateSeparator = !isSameDateGroup; // Show separator if date changed
        currentDate = messageDate;
      }
    }

    // Don't forget the last group
    if (currentGroup.length > 0) {
      groups.push({
        id: `group-${currentGroup[0].id}`,
        messages: currentGroup,
        showDateSeparator,
      });
    }

    return groups;
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading conversation...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Start a conversation by replying below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto pr-4">
      {groupedMessages.map((group, index) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <MessageGroup
            messages={group.messages}
            showDateSeparator={group.showDateSeparator}
          />
        </motion.div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
