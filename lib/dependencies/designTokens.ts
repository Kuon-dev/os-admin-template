import { NodeStatus } from '@/types/dependency-graph';

// 4-point grid spacing system (macOS-inspired)
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

// Animation presets for natural motion
export const animations = {
  spring: {
    soft: { type: 'spring' as const, stiffness: 50, damping: 20 },
    medium: { type: 'spring' as const, stiffness: 100, damping: 20 },
    bouncy: { type: 'spring' as const, stiffness: 300, damping: 25 },
    snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
  easing: {
    ease: [0.4, 0.0, 0.2, 1],
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
    easeInOut: [0.4, 0.0, 0.6, 1],
  },
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.7,
  },
} as const;

// Status-based color system
export const statusColors: Record<NodeStatus, {
  bg: string;
  bgHover: string;
  border: string;
  text: string;
  accent: string;
  light: string;
}> = {
  'planning': {
    bg: '#EFF6FF',
    bgHover: '#DBEAFE',
    border: '#3B82F6',
    text: '#1E40AF',
    accent: '#2563EB',
    light: '#BFDBFE',
  },
  'in-progress': {
    bg: '#FFFBEB',
    bgHover: '#FEF3C7',
    border: '#F59E0B',
    text: '#92400E',
    accent: '#D97706',
    light: '#FDE68A',
  },
  'completed': {
    bg: '#ECFDF5',
    bgHover: '#D1FAE5',
    border: '#10B981',
    text: '#065F46',
    accent: '#059669',
    light: '#A7F3D0',
  },
  'blocked': {
    bg: '#FEF2F2',
    bgHover: '#FEE2E2',
    border: '#EF4444',
    text: '#991B1B',
    accent: '#DC2626',
    light: '#FECACA',
  },
  'on-hold': {
    bg: '#F9FAFB',
    bgHover: '#F3F4F6',
    border: '#6B7280',
    text: '#374151',
    accent: '#4B5563',
    light: '#D1D5DB',
  },
};

// Dependency type colors
export const dependencyColors = {
  blocks: {
    stroke: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
    glow: 'rgba(239, 68, 68, 0.2)',
  },
  requires: {
    stroke: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB'],
    glow: 'rgba(59, 130, 246, 0.2)',
  },
  'relates-to': {
    stroke: '#6B7280',
    gradient: ['#6B7280', '#4B5563'],
    glow: 'rgba(107, 114, 128, 0.15)',
  },
} as const;

// Shadow system
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

// Glassmorphism effect
export const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
} as const;

// Z-index layers
export const zIndex = {
  base: 0,
  canvas: 1,
  nodes: 10,
  edges: 5,
  handles: 15,
  minimap: 20,
  controls: 25,
  floatingPanel: 30,
  commandBar: 40,
  modal: 50,
  tooltip: 60,
  tour: 100,
} as const;
