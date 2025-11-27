'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#3b82f6',
  Low: '#10b981',
};

const data = [
  { priority: 'Critical', count: 45, color: COLORS.Critical },
  { priority: 'High', count: 128, color: COLORS.High },
  { priority: 'Medium', count: 342, color: COLORS.Medium },
  { priority: 'Low', count: 769, color: COLORS.Low },
];

export function PriorityDistributionChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleExport = () => {
    const csv = 'Priority,Count\n' + data.map((item) => `${item.priority},${item.count}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'priority-distribution.csv';
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Tickets organized by priority level</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Tickets</p>
            <p className="text-3xl font-bold">{data.reduce((sum, item) => sum + item.count, 0)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Urgent (Critical + High)</p>
            <p className="text-3xl font-bold text-destructive">
              {data
                .filter((d) => d.priority === 'Critical' || d.priority === 'High')
                .reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setActiveIndex(state.activeTooltipIndex ?? null);
              } else {
                setActiveIndex(null);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="priority"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-card p-4 shadow-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-3 w-3 rounded" style={{ backgroundColor: data.color }} />
                        <p className="font-semibold text-card-foreground">{data.priority} Priority</p>
                      </div>
                      <p className="text-3xl font-bold text-card-foreground mb-1">{data.count}</p>
                      <p className="text-sm text-muted-foreground">tickets in queue</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} animationBegin={0} animationDuration={800}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                style={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
