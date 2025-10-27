'use client';

import { useState } from 'react';
import { Ticket, TicketCategory, TicketPriority } from '@/types/ticket';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

const ticketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.enum(['bug', 'feature', 'support', 'billing', 'account', 'general', 'other']),
  tags: z.array(z.string()).default([]),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const commonTags = ['urgent', 'mobile', 'authentication', 'backend', 'feature-request', 'performance'];

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TicketFormData) => Promise<void>;
  ticket?: Ticket | null;
}

export function TicketDialog({ open, onOpenChange, onSubmit, ticket }: TicketDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(ticket?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: ticket?.title || '',
      description: ticket?.description || '',
      customerName: ticket?.customerName || '',
      customerEmail: ticket?.customerEmail || '',
      priority: ticket?.priority || 'medium',
      category: ticket?.category || 'general',
      tags: ticket?.tags || [],
    },
  });

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    form.setValue('tags', newTags);
  };

  const handleSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, tags: selectedTags });
      onOpenChange(false);
      form.reset();
      setSelectedTags([]);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>
              {ticket ? 'Edit Ticket' : 'Create New Ticket'}
            </DialogTitle>
            <DialogDescription>
              {ticket
                ? 'Update ticket details and information'
                : 'Create a new support ticket with customer information'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief title of the issue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the issue..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <div>
                <FormLabel className="mb-2 block">Tags</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : ticket ? 'Update Ticket' : 'Create Ticket'}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
