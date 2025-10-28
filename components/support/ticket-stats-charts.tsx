'use client';

import { useMemo } from 'react';
import { TicketStats } from '@/types/ticket';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

interface TicketStatsChartsProps {
  stats: TicketStats | null;
}

export function TicketStatsCharts({ stats }: TicketStatsChartsProps) {
  if (!stats) {
    return null;
  }

  // Color palette for charts (theme-aware hex colors)
  const CHART_COLORS = {
    status: ['#3b82f6', '#eab308', '#a855f7', '#22c55e', '#6b7280'],
    priority: ['#ef4444', '#f97316', '#eab308', '#3b82f6'],
    category: ['#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#6366f1', '#ec4899'],
  };

  // Status distribution chart config
  const statusChartConfig = {
    new: {
      label: 'New',
      color: CHART_COLORS.status[0],
    },
    in_progress: {
      label: 'In Progress',
      color: CHART_COLORS.status[1],
    },
    waiting: {
      label: 'Waiting',
      color: CHART_COLORS.status[2],
    },
    resolved: {
      label: 'Resolved',
      color: CHART_COLORS.status[3],
    },
    closed: {
      label: 'Closed',
      color: CHART_COLORS.status[4],
    },
  } satisfies ChartConfig;

  // Priority distribution chart config
  const priorityChartConfig = {
    critical: {
      label: 'Critical',
      color: CHART_COLORS.priority[0],
    },
    high: {
      label: 'High',
      color: CHART_COLORS.priority[1],
    },
    medium: {
      label: 'Medium',
      color: CHART_COLORS.priority[2],
    },
    low: {
      label: 'Low',
      color: CHART_COLORS.priority[3],
    },
  } satisfies ChartConfig;

  // Category distribution chart config
  const categoryChartConfig = {
    bug: {
      label: 'Bug',
      color: CHART_COLORS.category[0],
    },
    feature: {
      label: 'Feature',
      color: CHART_COLORS.category[1],
    },
    support: {
      label: 'Support',
      color: CHART_COLORS.category[2],
    },
    billing: {
      label: 'Billing',
      color: CHART_COLORS.category[3],
    },
    account: {
      label: 'Account',
      color: CHART_COLORS.category[4],
    },
    general: {
      label: 'General',
      color: CHART_COLORS.category[5],
    },
    other: {
      label: 'Other',
      color: CHART_COLORS.category[6],
    },
  } satisfies ChartConfig;

  // Prepare data for Status Pie Chart
  const statusData = useMemo(
    () =>
      [
        { name: 'new', value: stats.byStatus.new },
        { name: 'in_progress', value: stats.byStatus.in_progress },
        { name: 'waiting', value: stats.byStatus.waiting },
        { name: 'resolved', value: stats.byStatus.resolved },
        { name: 'closed', value: stats.byStatus.closed },
      ].filter((item) => item.value > 0),
    [stats.byStatus]
  );

  // Prepare data for Priority Bar Chart
  const priorityData = useMemo(
    () => [
      { name: 'critical', value: stats.byPriority.critical },
      { name: 'high', value: stats.byPriority.high },
      { name: 'medium', value: stats.byPriority.medium },
      { name: 'low', value: stats.byPriority.low },
    ],
    [stats.byPriority]
  );

  // Prepare data for Category Bar Chart
  const categoryData = useMemo(
    () =>
      [
        { name: 'bug', value: stats.byCategory.bug },
        { name: 'feature', value: stats.byCategory.feature },
        { name: 'support', value: stats.byCategory.support },
        { name: 'billing', value: stats.byCategory.billing },
        { name: 'account', value: stats.byCategory.account },
        { name: 'general', value: stats.byCategory.general },
        { name: 'other', value: stats.byCategory.other },
      ].filter((item) => item.value > 0),
    [stats.byCategory]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Status Distribution */}
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4">Tickets by Status</h3>
        {statusData.length > 0 ? (
          <ChartContainer config={statusChartConfig} className="h-[300px]">
            <PieChart data={statusData}>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => {
                  const config = statusChartConfig[name as keyof typeof statusChartConfig];
                  return `${config?.label || name}: ${value}`;
                }}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
              >
                {statusData.map((entry, index) => {
                  const colorKey = entry.name as keyof typeof statusChartConfig;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusChartConfig[colorKey]?.color || `hsl(var(--chart-${index + 1}))`}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </Card>

      {/* Priority Distribution */}
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4">Tickets by Priority</h3>
        <ChartContainer config={priorityChartConfig} className="h-[300px]">
          <BarChart data={priorityData} margin={{ top: 24, right: 30, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(value) => {
                const config = priorityChartConfig[value as keyof typeof priorityChartConfig];
                return config?.label || value;
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" />}
            />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} nameKey="name">
              {priorityData.map((entry, index) => {
                const colorKey = entry.name as keyof typeof priorityChartConfig;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={priorityChartConfig[colorKey]?.color || `hsl(var(--chart-${index + 1}))`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </Card>

      {/* Category Distribution */}
      <Card className="p-4 lg:col-span-2">
        <h3 className="font-semibold text-lg mb-4">Tickets by Category</h3>
        <ChartContainer config={categoryChartConfig} className="h-[300px]">
          <BarChart data={categoryData} margin={{ top: 24, right: 30, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(value) => {
                const config = categoryChartConfig[value as keyof typeof categoryChartConfig];
                return config?.label || value;
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" />}
            />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} nameKey="name">
              {categoryData.map((entry, index) => {
                const colorKey = entry.name as keyof typeof categoryChartConfig;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={categoryChartConfig[colorKey]?.color || `hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
