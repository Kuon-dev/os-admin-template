'use client';

import { useEffect, useRef } from 'react';
import { TicketMessage } from '@/types/ticket';
import { TicketMessageItem } from './ticket-message-item';
import { motion } from 'motion/react';

interface TicketConversationProps {
  messages: TicketMessage[];
  isLoading?: boolean;
}

export function TicketConversation({ messages, isLoading }: TicketConversationProps) {
  const endRef = useRef<HTMLDivElement>(null);

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
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <TicketMessageItem message={message} />
        </motion.div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
