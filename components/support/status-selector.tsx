import { TicketStatus } from '@/types/ticket';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatusSelectorProps {
  value: TicketStatus;
  onChange: (status: TicketStatus) => void;
  disabled?: boolean;
}

const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'text-blue-600' },
  in_progress: { label: 'In Progress', color: 'text-amber-600' },
  waiting: { label: 'Waiting', color: 'text-pink-600' },
  resolved: { label: 'Resolved', color: 'text-green-600' },
  closed: { label: 'Closed', color: 'text-gray-600' },
};

export function StatusSelector({ value, onChange, disabled }: StatusSelectorProps) {
  const config = statusConfig[value];

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Status
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as TicketStatus)} disabled={disabled}>
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="waiting">Waiting</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
