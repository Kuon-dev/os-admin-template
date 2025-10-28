import { format } from 'date-fns';

interface MessageSeparatorProps {
  date: Date | string;
}

export function MessageSeparator({ date }: MessageSeparatorProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div className="flex items-center gap-3 my-6 px-0">
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
      <time className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2">
        {format(dateObj, 'MMMM d, yyyy')}
      </time>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
