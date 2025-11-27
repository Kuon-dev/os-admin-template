// Analytics Dashboard Mock Data
// Property management focused analytics with minimal metrics

export type PropertyType = 'apartment' | 'condo' | 'house' | 'villa' | 'townhouse';

export type InsightType = 'positive' | 'warning' | 'info';

// Hero Metrics
export interface AnalyticsMetric {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: {
    value: number;
    label: string;
  };
  color: 'blue' | 'green' | 'purple' | 'orange';
  sparklineData: number[];
}

// Revenue Time Series
export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}

// Property Type Occupancy
export interface PropertyTypeData {
  type: PropertyType;
  label: string;
  occupied: number;
  vacant: number;
  total: number;
  occupancyRate: number;
}

// Maintenance Categories
export interface MaintenanceData {
  category: string;
  count: number;
  color: string;
}

// Analytics Insights
export interface AnalyticsInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  metric?: string;
}

// ============================================
// MOCK DATA
// ============================================

export const analyticsMetrics: AnalyticsMetric[] = [
  {
    id: 'occupancy',
    label: 'Occupancy Rate',
    value: 94.2,
    suffix: '%',
    trend: { value: 2.1, label: 'vs last month' },
    color: 'green',
    sparklineData: [89, 90, 91, 92, 93, 93, 94],
  },
  {
    id: 'revenue',
    label: 'Monthly Revenue',
    value: 485,
    prefix: '$',
    suffix: 'K',
    trend: { value: 8.5, label: 'vs last month' },
    color: 'blue',
    sparklineData: [420, 435, 448, 462, 475, 480, 485],
  },
  {
    id: 'properties',
    label: 'Total Properties',
    value: 156,
    trend: { value: 3, label: 'new this month' },
    color: 'purple',
    sparklineData: [148, 150, 151, 152, 153, 154, 156],
  },
  {
    id: 'maintenance',
    label: 'Pending Maintenance',
    value: 23,
    trend: { value: -5, label: 'vs last week' },
    color: 'orange',
    sparklineData: [35, 32, 28, 30, 25, 24, 23],
  },
];

export const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 420000, expenses: 125000, netIncome: 295000 },
  { month: 'Feb', revenue: 435000, expenses: 128000, netIncome: 307000 },
  { month: 'Mar', revenue: 448000, expenses: 132000, netIncome: 316000 },
  { month: 'Apr', revenue: 455000, expenses: 135000, netIncome: 320000 },
  { month: 'May', revenue: 462000, expenses: 138000, netIncome: 324000 },
  { month: 'Jun', revenue: 468000, expenses: 140000, netIncome: 328000 },
  { month: 'Jul', revenue: 472000, expenses: 142000, netIncome: 330000 },
  { month: 'Aug', revenue: 475000, expenses: 145000, netIncome: 330000 },
  { month: 'Sep', revenue: 478000, expenses: 148000, netIncome: 330000 },
  { month: 'Oct', revenue: 480000, expenses: 150000, netIncome: 330000 },
  { month: 'Nov', revenue: 482000, expenses: 152000, netIncome: 330000 },
  { month: 'Dec', revenue: 485000, expenses: 155000, netIncome: 330000 },
];

export const propertyTypeData: PropertyTypeData[] = [
  { type: 'apartment', label: 'Apartments', occupied: 45, vacant: 3, total: 48, occupancyRate: 93.75 },
  { type: 'condo', label: 'Condos', occupied: 32, vacant: 2, total: 34, occupancyRate: 94.12 },
  { type: 'house', label: 'Houses', occupied: 28, vacant: 1, total: 29, occupancyRate: 96.55 },
  { type: 'villa', label: 'Villas', occupied: 12, vacant: 1, total: 13, occupancyRate: 92.31 },
  { type: 'townhouse', label: 'Townhouses', occupied: 30, vacant: 2, total: 32, occupancyRate: 93.75 },
];

export const maintenanceData: MaintenanceData[] = [
  { category: 'Plumbing', count: 45, color: '#3b82f6' },
  { category: 'Electrical', count: 28, color: '#f59e0b' },
  { category: 'HVAC', count: 35, color: '#10b981' },
  { category: 'Appliances', count: 22, color: '#8b5cf6' },
  { category: 'Structural', count: 12, color: '#ef4444' },
];

export const analyticsInsights: AnalyticsInsight[] = [
  {
    id: '1',
    type: 'positive',
    title: 'Occupancy at 3-Month High',
    description: 'Your portfolio occupancy rate of 94.2% is the highest in the last quarter.',
    metric: '+2.1%',
  },
  {
    id: '2',
    type: 'warning',
    title: '18 Leases Expiring Soon',
    description: 'You have 18 lease agreements expiring within the next 30 days.',
  },
  {
    id: '3',
    type: 'info',
    title: 'HVAC Costs Trending Up',
    description: 'HVAC maintenance costs have increased 12% compared to last quarter.',
  },
  {
    id: '4',
    type: 'positive',
    title: 'Revenue Growth Steady',
    description: 'Monthly revenue has grown 15.5% year-over-year with consistent upward trend.',
    metric: '+15.5%',
  },
];

// Chart color constants
export const CHART_COLORS = {
  revenue: '#3b82f6',
  expenses: '#ef4444',
  netIncome: '#10b981',
  occupied: '#8b5cf6',
  vacant: '#94a3b8',
} as const;
