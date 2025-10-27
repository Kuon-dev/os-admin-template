import { DependencyNode, DependencyEdge } from '@/types/dependency-graph';

export const initialNodes: DependencyNode[] = [
  // Projects
  {
    id: 'proj-1',
    type: 'custom',
    position: { x: 300, y: 50 },
    data: {
      label: 'Mobile App Redesign',
      type: 'project',
      status: 'in-progress',
      owner: 'Sarah Chen',
      ownerAvatar: 'SC',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      description: 'Complete redesign of the mobile application with new UI/UX',
      progress: 65,
    },
  },
  {
    id: 'proj-2',
    type: 'custom',
    position: { x: 700, y: 50 },
    data: {
      label: 'API v3 Migration',
      type: 'project',
      status: 'in-progress',
      owner: 'Alex Kumar',
      ownerAvatar: 'AK',
      startDate: '2024-02-01',
      endDate: '2024-07-15',
      description: 'Migrate all services to new API v3 architecture',
      progress: 40,
    },
  },

  // Epics
  {
    id: 'epic-1',
    type: 'custom',
    position: { x: 150, y: 200 },
    data: {
      label: 'User Authentication',
      type: 'epic',
      status: 'in-progress',
      owner: 'Sarah Chen',
      ownerAvatar: 'SC',
      description: 'Implement OAuth2 and multi-factor authentication',
      progress: 75,
    },
  },
  {
    id: 'epic-2',
    type: 'custom',
    position: { x: 450, y: 200 },
    data: {
      label: 'Onboarding Flow',
      type: 'epic',
      status: 'in-progress',
      owner: 'Sarah Chen',
      ownerAvatar: 'SC',
      description: 'Streamlined user onboarding experience',
      progress: 50,
    },
  },
  {
    id: 'epic-3',
    type: 'custom',
    position: { x: 750, y: 200 },
    data: {
      label: 'GraphQL Migration',
      type: 'epic',
      status: 'blocked',
      owner: 'Alex Kumar',
      ownerAvatar: 'AK',
      description: 'Convert REST endpoints to GraphQL',
      progress: 20,
    },
  },

  // Features
  {
    id: 'feat-1',
    type: 'custom',
    position: { x: 50, y: 350 },
    data: {
      label: 'OAuth2 Integration',
      type: 'feature',
      status: 'completed',
      owner: 'James Wilson',
      ownerAvatar: 'JW',
      description: 'Google and GitHub OAuth',
      progress: 100,
    },
  },
  {
    id: 'feat-2',
    type: 'custom',
    position: { x: 250, y: 350 },
    data: {
      label: 'MFA Setup',
      type: 'feature',
      status: 'in-progress',
      owner: 'James Wilson',
      ownerAvatar: 'JW',
      description: 'TOTP authentication',
      progress: 60,
    },
  },
  {
    id: 'feat-3',
    type: 'custom',
    position: { x: 450, y: 350 },
    data: {
      label: 'Welcome Tutorial',
      type: 'feature',
      status: 'in-progress',
      owner: 'Emily Rodriguez',
      ownerAvatar: 'ER',
      description: 'Interactive tutorial for new users',
      progress: 70,
    },
  },
  {
    id: 'feat-4',
    type: 'custom',
    position: { x: 750, y: 350 },
    data: {
      label: 'GraphQL Schema',
      type: 'feature',
      status: 'in-progress',
      owner: 'David Park',
      ownerAvatar: 'DP',
      description: 'GraphQL schema design',
      progress: 80,
    },
  },

  // Tasks
  {
    id: 'task-1',
    type: 'custom',
    position: { x: 250, y: 500 },
    data: {
      label: 'MFA Testing',
      type: 'task',
      status: 'in-progress',
      owner: 'James Wilson',
      ownerAvatar: 'JW',
      description: 'Test MFA flow end-to-end',
      progress: 50,
    },
  },
  {
    id: 'task-2',
    type: 'custom',
    position: { x: 450, y: 500 },
    data: {
      label: 'UX Feedback',
      type: 'task',
      status: 'completed',
      owner: 'Emily Rodriguez',
      ownerAvatar: 'ER',
      description: 'Collect user feedback on tutorial',
      progress: 100,
    },
  },

  // Milestone
  {
    id: 'mile-1',
    type: 'custom',
    position: { x: 400, y: 650 },
    data: {
      label: 'Beta Launch',
      type: 'milestone',
      status: 'planning',
      owner: 'Sarah Chen',
      ownerAvatar: 'SC',
      endDate: '2024-05-15',
      description: 'Launch beta version',
      progress: 0,
    },
  },
];

export const initialEdges: DependencyEdge[] = [
  // Task blocks Features (tasks must complete first)
  { id: 'e1', source: 'task-1', target: 'feat-2', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },
  { id: 'e2', source: 'task-2', target: 'feat-3', type: 'custom', data: { dependencyType: 'blocks', strength: 'medium' } },

  // Feature blocks Epics (features must complete before epics)
  { id: 'e3', source: 'feat-1', target: 'epic-1', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },
  { id: 'e4', source: 'feat-2', target: 'epic-1', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },
  { id: 'e5', source: 'feat-3', target: 'epic-2', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },
  { id: 'e6', source: 'feat-4', target: 'epic-3', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },

  // Epic blocks Projects (epics must complete before projects)
  { id: 'e7', source: 'epic-1', target: 'proj-1', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },
  { id: 'e8', source: 'epic-2', target: 'proj-1', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },
  { id: 'e9', source: 'epic-3', target: 'proj-2', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },

  // Multiple items block Milestone (all must complete for milestone)
  { id: 'e10', source: 'feat-1', target: 'mile-1', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },
  { id: 'e11', source: 'feat-3', target: 'mile-1', type: 'custom', data: { dependencyType: 'blocks', strength: 'strong' } },
];

export const mockOwners = [
  'Sarah Chen',
  'Alex Kumar',
  'Maria Garcia',
  'James Wilson',
  'Emily Rodriguez',
  'David Park',
  'Lisa Zhang',
];
