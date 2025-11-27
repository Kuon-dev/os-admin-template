'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  open: '#8b5cf6',
  inProgress: '#3b82f6',
  pending: '#f59e0b',
  resolved: '#10b981',
};

const data = [
  { name: 'Open', value: 247, color: COLORS.open },
  { name: 'In Progress', value: 189, color: COLORS.inProgress },
  { name: 'Pending', value: 124, color: COLORS.pending },
  { name: 'Resolved', value: 724, color: COLORS.resolved },
];

export function TicketStatusChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const handleExport = () => {
    const csv =
      'Status,Count,Percentage\n' +
      data.map((item) => `${item.name},${item.value},${((item.value / total) * 100).toFixed(1)}%`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticket-status.csv';
    a.click();
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Ticket Status Distribution</CardTitle>
            <CardDescription>Current breakdown of all support tickets</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {data.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-2xl font-bold">{item.value}</span>
              <span className="text-xs text-muted-foreground">{((item.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                  style={{
                    cursor: 'pointer',
                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  stroke={entry.color}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
                        <p className="font-semibold text-card-foreground">{data.name}</p>
                      </div>
                      <p className="text-2xl font-bold text-card-foreground">{data.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {((data.value / total) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
