export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@support.com',
    avatar: null,
  },
  {
    id: 'user-2',
    name: 'Michael Johnson',
    email: 'michael.johnson@support.com',
    avatar: null,
  },
  {
    id: 'user-3',
    name: 'David Lee',
    email: 'david.lee@support.com',
    avatar: null,
  },
  {
    id: 'user-4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@support.com',
    avatar: null,
  },
  {
    id: 'user-5',
    name: 'James Wilson',
    email: 'james.wilson@support.com',
    avatar: null,
  },
];

export function getTeamMemberById(id: string | null): TeamMember | null {
  if (!id) return null;
  return teamMembers.find((member) => member.id === id) || null;
}

export function getTeamMemberName(id: string | null): string {
  if (!id) return 'Unassigned';
  const member = getTeamMemberById(id);
  return member?.name || 'Unknown';
}
