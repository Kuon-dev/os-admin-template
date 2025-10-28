'use client';

import { TicketMessage } from '@/types/ticket';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';

interface TicketDetailMessagesProps {
  messages: TicketMessage[];
  isLoading?: boolean;
}

export function TicketDetailMessages({ messages, isLoading }: TicketDetailMessagesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading conversation...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground">Start a conversation by replying below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        if (message.type === 'system') {
          return (
            <div key={message.id} className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 rounded-full border border-muted-foreground/20 bg-muted/50 px-4 py-1.5">
                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{message.content}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.createdAt), 'h:mm a')}
                </span>
              </div>
            </div>
          );
        }

        const borderColor =
          message.type === 'customer'
            ? 'border-l-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : message.type === 'agent'
              ? 'border-l-gray-400 bg-gray-50 dark:bg-gray-900/20'
              : 'border-l-amber-400 bg-amber-50 dark:bg-amber-900/20';

        return (
          <Card
            key={message.id}
            className={`border-l-4 p-4 ${borderColor}`}
          >
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={message.authorAvatar || undefined} alt={message.authorName} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{message.authorName}</span>
                  {message.type === 'internal' && (
                    <Badge variant="secondary" className="text-xs">
                      Internal
                    </Badge>
                  )}
                  {message.type === 'customer' && (
                    <Badge variant="outline" className="text-xs">
                      Customer
                    </Badge>
                  )}
                  {message.type === 'agent' && (
                    <Badge variant="outline" className="text-xs">
                      Agent
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    📎 {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
