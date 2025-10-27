'use client';

import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { DependencyNode, NodeStatus } from '@/types/dependency-graph';
import { mockOwners } from '@/lib/dependencies/mockData';
import { animations, statusColors } from '@/lib/dependencies/designTokens';
import { cn } from '@/lib/utils';
import {
  Settings,
  Layers,
  Save,
  Trash2,
  ChevronRight,
  CalendarIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface NodePropertiesPanelProps {
  node: DependencyNode | null;
  isCollapsed: boolean;
  onUpdate: (id: string, data: Partial<DependencyNode['data']>) => void;
  onDelete: (id: string) => void;
  onToggleCollapse: () => void;
}

interface FormData {
  label: string;
  status: NodeStatus;
  owner: string;
  startDate: string;
  endDate: string;
  description: string;
  progress: number;
}

const statuses: NodeStatus[] = ['planning', 'in-progress', 'completed', 'blocked', 'on-hold'];

export function NodePropertiesPanel({
  node,
  isCollapsed,
  onUpdate,
  onDelete,
  onToggleCollapse,
}: NodePropertiesPanelProps) {
  const { register, handleSubmit, setValue, watch, reset, control } = useForm<FormData>();
  const progress = watch('progress', 0);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  useEffect(() => {
    if (node) {
      reset({
        label: node.data.label,
        status: node.data.status,
        owner: node.data.owner,
        startDate: node.data.startDate || '',
        endDate: node.data.endDate || '',
        description: node.data.description || '',
        progress: node.data.progress || 0,
      });
    }
  }, [node, reset]);

  const onSubmit = (data: FormData) => {
    if (!node) return;
    onUpdate(node.id, data);
  };

  const handleDelete = () => {
    if (!node) return;
    if (confirm('Delete this node and all its connections?')) {
      onDelete(node.id);
    }
  };

  // Collapsed state - show narrow strip with expand button
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center h-full bg-background border-l">
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-8 w-8 p-0"
          onClick={onToggleCollapse}
          title="Expand Properties Panel"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </Button>
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="flex flex-col items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground writing-mode-vertical rotate-180">
              Properties
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Expanded state - show full panel
  return (
    <div className="flex flex-col h-full bg-background border-l overflow-hidden">
      {/* Header with collapse button */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm text-foreground">Node Properties</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onToggleCollapse}
          title="Collapse Properties Panel"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Content area with proper overflow handling */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {!node ? (
          // No node selected
          <div className="flex items-center justify-center h-full p-4">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Layers />
                </EmptyMedia>
                <EmptyTitle>No Node Selected</EmptyTitle>
                <EmptyDescription>
                  Select a node from the graph to edit its properties
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <motion.div
            className="p-4 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={animations.spring.soft}
          >
            {/* Node type info */}
            <div className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm capitalize text-foreground">
                  {node.data.type || 'Node'}
                </h4>
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    backgroundColor: statusColors[node.data.status].bg,
                    borderColor: statusColors[node.data.status].border,
                    color: statusColors[node.data.status].text,
                  }}
                >
                  {node.data.status.replace('-', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ID: {node.id}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Label */}
              <div className="space-y-2">
                <Label htmlFor="label" className="text-xs">Name *</Label>
                <Input
                  id="label"
                  {...register('label', { required: true })}
                  placeholder="Enter node name"
                  className="h-9"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={node?.data.status || field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status} className="capitalize text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: statusColors[status].accent }}
                              />
                              {status.replace('-', ' ')}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Owner */}
              <div className="space-y-2">
                <Label className="text-xs">Owner *</Label>
                <Controller
                  name="owner"
                  control={control}
                  render={({ field }) => (
                    <Select value={node?.data.owner || field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockOwners.map((owner) => (
                          <SelectItem key={owner} value={owner} className="text-sm">
                            {owner}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Progress</Label>
                  <span className="text-xs text-muted-foreground font-medium">{progress}%</span>
                </div>
                <Slider
                  value={[progress]}
                  onValueChange={(value) => setValue('progress', value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Start Date</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full h-9 justify-start text-left font-normal text-xs',
                          !watch('startDate') && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch('startDate')
                          ? format(new Date(watch('startDate')), 'MMM dd, yyyy')
                          : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={watch('startDate') ? new Date(watch('startDate')) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setValue('startDate', format(date, 'yyyy-MM-dd'));
                          }
                          setStartDateOpen(false);
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date('2000-01-01')
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Due Date</Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full h-9 justify-start text-left font-normal text-xs',
                          !watch('endDate') && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch('endDate')
                          ? format(new Date(watch('endDate')), 'MMM dd, yyyy')
                          : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={watch('endDate') ? new Date(watch('endDate')) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setValue('endDate', format(date, 'yyyy-MM-dd'));
                          }
                          setEndDateOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date('2000-01-01')
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter a description..."
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button type="submit" className="flex-1 h-9">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="h-9 px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
