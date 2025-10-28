'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus } from 'lucide-react';

interface TicketReplyFormProps {
  onSubmit: (message: { content: string; isInternal: boolean }) => Promise<void>;
}

export function TicketReplyForm({ onSubmit }: TicketReplyFormProps) {
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
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

  return (
    <section className="sticky bottom-0 z-40 bg-gradient-to-t from-white dark:from-slate-950 via-white dark:via-slate-950 to-white/0 dark:to-slate-950/0 pt-8 pb-4 border-t border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What's the next step?
          </label>
          <Textarea
            placeholder="Respond to the customer or add an internal note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none dark:bg-slate-900 dark:border-gray-700"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id="internal"
              checked={isInternal}
              onCheckedChange={(checked) => setIsInternal(!!checked)}
              disabled={isSubmitting}
            />
            <label
              htmlFor="internal"
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer font-medium"
            >
              Internal note (team only)
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              title="Attach file"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <span>Send Reply</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
