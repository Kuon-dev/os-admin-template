import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  Target,
  Zap,
  Globe,
  Server,
  Database,
  Cpu,
  HardDrive,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { ActivityItem } from '@/components/dashboard/activity-feed';
import { TableColumn } from '@/components/dashboard/data-table';

// Generate time series data
export function generateTimeSeriesData(
  length: number,
  min: number,
  max: number,
  trend: 'up' | 'down' | 'stable' = 'stable'
) {
  const data: number[] = [];
  let current = min + (max - min) / 2;

  for (let i = 0; i < length; i++) {
    const variance = (Math.random() - 0.5) * (max - min) * 0.3;
    let trendValue = 0;

    if (trend === 'up') {
      trendValue = ((max - min) / length) * 0.5;
    } else if (trend === 'down') {
      trendValue = -((max - min) / length) * 0.5;
    }

    current = Math.max(min, Math.min(max, current + variance + trendValue));
    data.push(Math.round(current));
  }

  return data;
}

// Dashboard statistics - Key Business Metrics
export const dashboardStats = [
  {
    id: 'monthly-revenue',
    icon: DollarSign,
    label: 'Monthly Revenue',
    value: 284750,
    prefix: '$',
    trend: { value: 12.5, label: 'vs last month' },
    color: 'green' as const,
    subtitle: 'Total revenue this month',
    decimals: 0,
  },
  {
    id: 'new-customers',
    icon: Users,
    label: 'New Customers',
    value: 1247,
    trend: { value: 18.3, label: 'vs last month' },
    color: 'blue' as const,
    subtitle: 'New signups this month',
    decimals: 0,
  },
  {
    id: 'retention-rate',
    icon: TrendingUp,
    label: 'Retention Rate',
    value: 94.2,
    suffix: '%',
    trend: { value: 2.1, label: 'vs last month' },
    color: 'purple' as const,
    subtitle: 'Customer retention',
    decimals: 1,
  },
  {
    id: 'conversion-rate',
    icon: Target,
    label: 'Conversion Rate',
    value: 3.24,
    suffix: '%',
    trend: { value: 5.1, label: 'vs last month' },
    color: 'orange' as const,
    subtitle: 'Visitor to customer',
    decimals: 2,
  },
  {
    id: 'avg-order-value',
    icon: ShoppingCart,
    label: 'Avg Order Value',
    value: 72.45,
    prefix: '$',
    trend: { value: 3.7, label: 'vs last month' },
    color: 'pink' as const,
    subtitle: 'Per transaction',
    decimals: 2,
  },
  {
    id: 'customer-lifetime-value',
    icon: TrendingUp,
    label: 'Customer LTV',
    value: 847,
    prefix: '$',
    trend: { value: 8.9, label: 'vs last quarter' },
    color: 'cyan' as const,
    subtitle: 'Average lifetime value',
    decimals: 0,
  },
];

// Live metrics for real-time operational monitoring
export const liveMetrics = [
  {
    label: 'Active Sessions',
    value: 1847,
    icon: Activity,
    variance: 8,
    color: 'green' as const,
    decimals: 0,
  },
  {
    label: 'API Response Time',
    value: 142,
    suffix: 'ms',
    icon: Zap,
    variance: 15,
    color: 'blue' as const,
    decimals: 0,
  },
  {
    label: 'Server Load',
    value: 54,
    suffix: '%',
    icon: Server,
    variance: 10,
    color: 'orange' as const,
    decimals: 0,
  },
  {
    label: 'Error Rate',
    value: 0.12,
    suffix: '%',
    icon: AlertCircle,
    variance: 20,
    color: 'red' as const,
    decimals: 2,
  },
];

// System health metrics
export const systemHealth = [
  {
    label: 'CPU Usage',
    value: 42,
    max: 100,
    color: 'blue' as const,
    icon: Cpu,
  },
  {
    label: 'Memory',
    value: 68,
    max: 100,
    color: 'purple' as const,
    icon: HardDrive,
  },
  {
    label: 'Disk Space',
    value: 54,
    max: 100,
    color: 'orange' as const,
    icon: Database,
  },
  {
    label: 'Network',
    value: 78,
    max: 100,
    color: 'green' as const,
    icon: Globe,
  },
];

// Performance metrics with charts - Distinct business areas
export const performanceMetrics = [
  {
    id: 'revenue-trend',
    label: 'Daily Revenue',
    data: generateTimeSeriesData(7, 8000, 15000, 'up'),
    color: 'green' as const,
    type: 'line' as const,
  },
  {
    id: 'conversion-trend',
    label: 'Conversion Rate',
    data: generateTimeSeriesData(7, 2.5, 4.5, 'up'),
    color: 'orange' as const,
    type: 'line' as const,
  },
  {
    id: 'orders-trend',
    label: 'Order Volume',
    data: generateTimeSeriesData(7, 100, 200, 'stable'),
    color: 'purple' as const,
    type: 'bar' as const,
  },
  {
    id: 'customer-acquisition',
    label: 'New Signups',
    data: generateTimeSeriesData(7, 30, 80, 'up'),
    color: 'blue' as const,
    type: 'bar' as const,
  },
];

// Activity feed data
export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    user: { name: 'Sarah Johnson' },
    title: 'New order #3924 received',
    description: 'Order for $245.99 from Premium Plan subscription',
    time: '2m ago',
    type: 'success',
  },
  {
    id: '2',
    icon: AlertCircle,
    title: 'Payment failed for order #3923',
    description: 'Customer payment method declined, retry scheduled',
    time: '8m ago',
    type: 'warning',
  },
  {
    id: '3',
    user: { name: 'Mike Chen' },
    title: 'New user registration',
    description: 'Signed up via Google OAuth from San Francisco, CA',
    time: '15m ago',
    type: 'info',
  },
  {
    id: '4',
    icon: CheckCircle2,
    title: 'Server backup completed',
    description: 'Automated backup finished successfully (2.4 GB)',
    time: '23m ago',
    type: 'success',
  },
  {
    id: '5',
    user: { name: 'Emma Davis' },
    title: 'Support ticket #892 resolved',
    description: 'Bug report about dashboard loading times',
    time: '35m ago',
    type: 'success',
  },
  {
    id: '6',
    icon: XCircle,
    title: 'API rate limit exceeded',
    description: 'Third-party integration exceeded quota (1000/hour)',
    time: '42m ago',
    type: 'error',
  },
  {
    id: '7',
    user: { name: 'James Wilson' },
    title: 'Product updated',
    description: 'Changed pricing for Enterprise Plan from $99 to $89',
    time: '1h ago',
    type: 'info',
  },
  {
    id: '8',
    icon: Clock,
    title: 'Scheduled maintenance',
    description: 'Database optimization scheduled for tonight at 2 AM',
    time: '2h ago',
    type: 'warning',
  },
];

// Recent transactions table
export const transactionColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'Order ID',
    align: 'left',
  },
  {
    key: 'customer',
    label: 'Customer',
    align: 'left',
  },
  {
    key: 'product',
    label: 'Product',
    align: 'left',
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right',
    render: (value) => (
      <span className="font-semibold tabular-nums">${value}</span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    align: 'center',
    render: (value) => {
      const statusConfig = {
        completed: { label: 'Completed', variant: 'success' as const },
        pending: { label: 'Pending', variant: 'warning' as const },
        failed: { label: 'Failed', variant: 'error' as const },
      };
      const config = statusConfig[value as keyof typeof statusConfig];
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            config.variant === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : config.variant === 'warning'
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    key: 'time',
    label: 'Time',
    align: 'right',
  },
];

export const recentTransactions = [
  {
    id: '#3924',
    customer: 'Sarah Johnson',
    product: 'Premium Plan',
    amount: '245.99',
    status: 'completed',
    time: '2m ago',
  },
  {
    id: '#3923',
    customer: 'Mike Chen',
    product: 'Starter Plan',
    amount: '49.99',
    status: 'pending',
    time: '8m ago',
  },
  {
    id: '#3922',
    customer: 'Emma Davis',
    product: 'Enterprise Plan',
    amount: '899.00',
    status: 'completed',
    time: '15m ago',
  },
  {
    id: '#3921',
    customer: 'James Wilson',
    product: 'Premium Plan',
    amount: '245.99',
    status: 'completed',
    time: '23m ago',
  },
  {
    id: '#3920',
    customer: 'Lisa Anderson',
    product: 'Starter Plan',
    amount: '49.99',
    status: 'failed',
    time: '35m ago',
  },
  {
    id: '#3919',
    customer: 'Tom Baker',
    product: 'Premium Plan',
    amount: '245.99',
    status: 'completed',
    time: '42m ago',
  },
  {
    id: '#3918',
    customer: 'Nina Patel',
    product: 'Enterprise Plan',
    amount: '899.00',
    status: 'completed',
    time: '1h ago',
  },
];

// Top products/services - Diverse product categories
export const topProducts = [
  {
    name: 'Premium Subscription',
    sales: 1284,
    revenue: 315796,
    trend: 12.4,
    color: 'blue' as const,
  },
  {
    name: 'Enterprise License',
    sales: 342,
    revenue: 307458,
    trend: 8.7,
    color: 'purple' as const,
  },
  {
    name: 'Professional Services',
    sales: 892,
    revenue: 156340,
    trend: 15.3,
    color: 'green' as const,
  },
  {
    name: 'API Access Credits',
    sales: 1847,
    revenue: 92350,
    trend: 22.1,
    color: 'orange' as const,
  },
];

// Goal progress - Strategic quarterly objectives
export const goals = [
  {
    label: 'Revenue Target',
    value: 284750,
    max: 350000,
    color: 'green' as const,
  },
  {
    label: 'Customer Growth',
    value: 1247,
    max: 2000,
    color: 'blue' as const,
  },
  {
    label: 'Market Share',
    value: 23,
    max: 30,
    color: 'purple' as const,
  },
  {
    label: 'Team Expansion',
    value: 42,
    max: 50,
    color: 'orange' as const,
  },
];
