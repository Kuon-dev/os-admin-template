'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Add Reply
          </label>
          <Textarea
            placeholder="Type your response..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="internal"
              checked={isInternal}
              onCheckedChange={(checked) => setIsInternal(!!checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="internal" className="text-sm font-medium cursor-pointer">
              Internal note (not visible to customer)
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reply'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
