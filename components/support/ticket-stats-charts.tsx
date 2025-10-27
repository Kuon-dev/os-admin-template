'use client';

import { TicketStats } from '@/types/ticket';
import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TicketStatsChartsProps {
  stats: TicketStats | null;
}

export function TicketStatsCharts({ stats }: TicketStatsChartsProps) {
  if (!stats) {
    return null;
  }

  // Prepare data for Status Pie Chart
  const statusData = [
    { name: 'New', value: stats.byStatus.new },
    { name: 'In Progress', value: stats.byStatus.in_progress },
    { name: 'Waiting', value: stats.byStatus.waiting },
    { name: 'Resolved', value: stats.byStatus.resolved },
    { name: 'Closed', value: stats.byStatus.closed },
  ].filter((item) => item.value > 0);

  // Prepare data for Priority Bar Chart
  const priorityData = [
    { name: 'Critical', value: stats.byPriority.critical },
    { name: 'High', value: stats.byPriority.high },
    { name: 'Medium', value: stats.byPriority.medium },
    { name: 'Low', value: stats.byPriority.low },
  ];

  // Prepare data for Category Bar Chart
  const categoryData = [
    { name: 'Bug', value: stats.byCategory.bug },
    { name: 'Feature', value: stats.byCategory.feature },
    { name: 'Support', value: stats.byCategory.support },
    { name: 'Billing', value: stats.byCategory.billing },
    { name: 'Account', value: stats.byCategory.account },
    { name: 'General', value: stats.byCategory.general },
    { name: 'Other', value: stats.byCategory.other },
  ].filter((item) => item.value > 0);

  const COLORS = {
    status: ['#3b82f6', '#eab308', '#a855f7', '#22c55e', '#6b7280'],
    priority: ['#ef4444', '#f97316', '#eab308', '#3b82f6'],
    category: ['#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#6366f1', '#ec4899'],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Status Distribution */}
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4">Tickets by Status</h3>
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.status[index % COLORS.status.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </Card>

      {/* Priority Distribution */}
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4">Tickets by Priority</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {priorityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS.priority[index % COLORS.priority.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Distribution */}
      <Card className="p-4 lg:col-span-2">
        <h3 className="font-semibold text-lg mb-4">Tickets by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS.category[index % COLORS.category.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
