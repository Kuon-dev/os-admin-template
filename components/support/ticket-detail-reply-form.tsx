'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Lock, Send, Paperclip } from 'lucide-react';

interface TicketDetailReplyFormProps {
  onSubmit: (data: { content: string; isInternal: boolean }) => Promise<void>;
  isInternal?: boolean;
}

export function TicketDetailReplyForm({ onSubmit, isInternal: defaultInternal = false }: TicketDetailReplyFormProps) {
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(defaultInternal);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content, isInternal });
      setContent('');
      setIsInternal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Reply</h3>
          <Button
            type="button"
            variant={isInternal ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setIsInternal(!isInternal)}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            {isInternal ? 'Internal Note' : 'Public Reply'}
          </Button>
        </div>

        {isInternal && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-200">
              This note will only be visible to team members
            </p>
          </div>
        )}

        <Textarea
          placeholder={isInternal ? 'Add an internal note...' : 'Type your reply...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-32 resize-none"
          disabled={isSubmitting}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2"
              disabled={isSubmitting}
            >
              <Paperclip className="h-4 w-4" />
              Attach
            </Button>
            <span className="text-xs text-muted-foreground">{content.length} / 5000</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="hidden text-xs text-muted-foreground sm:inline">⌘ + Enter to send</span>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="gap-2 flex-1 sm:flex-none"
            >
              <Send className="h-4 w-4" />
              Send Reply
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
