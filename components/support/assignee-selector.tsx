import { teamMembers, getTeamMemberName } from '@/lib/support/assignees';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssigneeSelectorProps {
  value: string | null;
  onChange: (assigneeId: string | null) => void;
  disabled?: boolean;
}

export function AssigneeSelector({ value, onChange, disabled }: AssigneeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Assigned
      </label>
      <Select value={value || 'unassigned'} onValueChange={(v) => onChange(v === 'unassigned' ? null : v)} disabled={disabled}>
        <SelectTrigger className="w-[160px] h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {teamMembers.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
