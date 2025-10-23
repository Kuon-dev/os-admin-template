'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { User, UserFormData } from '@/types/user';

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'editor', 'user']),
  status: z.enum(['active', 'inactive', 'suspended']),
  avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserDialogEnhancedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
}

const dialogVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const formFieldVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: custom * 0.05,
    },
  }),
};

export function UserDialogEnhanced({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserDialogEnhancedProps) {
  const isEditing = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      avatar: '',
    },
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        avatar: '',
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      await onSubmit({
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
        avatar: values.avatar || undefined,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[525px]">
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {isEditing ? 'Edit User' : 'Create New User'}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? 'Update user information and permissions.'
                    : 'Add a new user to your team. Fill in their details below.'}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-6">
                  <motion.div
                    custom={0}
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    custom={1}
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      custom={2}
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      custom={3}
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    custom={4}
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avatar URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/avatar.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Provide a URL to the user's avatar image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <DialogFooter className="gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={form.formState.isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {form.formState.isSubmitting
                        ? 'Saving...'
                        : isEditing
                        ? 'Save Changes'
                        : 'Create User'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
