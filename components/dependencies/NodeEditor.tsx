'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
import { DependencyNode, NodeStatus } from '@/types/dependency-graph';
import { mockOwners } from '@/lib/dependencies/mockData';
import { Trash2, Save } from 'lucide-react';

interface NodeEditorProps {
  node: DependencyNode | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<DependencyNode['data']>) => void;
  onDelete: (id: string) => void;
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

export function NodeEditor({ node, open, onClose, onUpdate, onDelete }: NodeEditorProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>();

  const progress = watch('progress', 0);

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
    onClose();
  };

  const handleDelete = () => {
    if (!node) return;
    if (confirm('Are you sure you want to delete this node? This will also remove all connected edges.')) {
      onDelete(node.id);
      onClose();
    }
  };

  if (!node) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Node</SheetTitle>
          <SheetDescription>
            Update the properties of this {node.data.type} node
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label">Name *</Label>
            <Input
              id="label"
              {...register('label', { required: true })}
              placeholder="Enter node name"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as NodeStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status} className="capitalize">
                    {status.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Owner */}
          <div className="space-y-2">
            <Label htmlFor="owner">Owner *</Label>
            <Select
              value={watch('owner')}
              onValueChange={(value) => setValue('owner', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockOwners.map((owner) => (
                  <SelectItem key={owner} value={owner}>
                    {owner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Progress</Label>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Slider
              value={[progress]}
              onValueChange={(value) => setValue('progress', value[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate')}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter a description..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
