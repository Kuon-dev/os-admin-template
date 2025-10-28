import { TicketMessage } from '@/types/ticket';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface TicketMessageItemProps {
  message: TicketMessage;
}

export function TicketMessageItem({ message }: TicketMessageItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMessageBgColor = () => {
    if (message.type === 'customer') {
      return 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400';
    }
    if (message.type === 'internal') {
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400';
    }
    if (message.type === 'system') {
      return 'bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 dark:border-gray-400';
    }
    return 'bg-white dark:bg-slate-800 border-l-4 border-gray-500 dark:border-gray-400';
  };

  const getMessageTypeLabel = () => {
    if (message.type === 'customer') return 'Customer';
    if (message.type === 'agent') return message.isInternal ? 'Internal Note' : 'Agent';
    if (message.type === 'system') return 'System';
    return 'Message';
  };

  return (
    <div className={`p-4 rounded-lg ${getMessageBgColor()} space-y-2`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-xs">
              {getInitials(message.authorName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{message.authorName}</span>
              <Badge variant="outline" className="text-xs">
                {getMessageTypeLabel()}
              </Badge>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>
      </div>
      <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{message.content}</div>
      {message.attachments && message.attachments.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          📎 {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
