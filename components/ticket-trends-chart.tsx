'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { date: 'Mon', created: 45, resolved: 38, pending: 12 },
  { date: 'Tue', created: 52, resolved: 45, pending: 15 },
  { date: 'Wed', created: 48, resolved: 51, pending: 10 },
  { date: 'Thu', created: 61, resolved: 48, pending: 18 },
  { date: 'Fri', created: 58, resolved: 62, pending: 14 },
  { date: 'Sat', created: 35, resolved: 42, pending: 8 },
  { date: 'Sun', created: 28, resolved: 35, pending: 6 },
];

const COLORS = {
  created: '#8b5cf6',
  resolved: '#10b981',
  pending: '#f59e0b',
};

interface TicketTrendsChartProps {
  timeRange?: string;
}

export function TicketTrendsChart({ timeRange = '7d' }: TicketTrendsChartProps) {
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());

  const handleExport = () => {
    const csv =
      'Date,Created,Resolved,Pending\n' +
      data.map((item) => `${item.date},${item.created},${item.resolved},${item.pending}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticket-trends.csv';
    a.click();
  };

  const totalCreated = data.reduce((sum, item) => sum + item.created, 0);
  const totalResolved = data.reduce((sum, item) => sum + item.resolved, 0);
  const avgPending = Math.round(data.reduce((sum, item) => sum + item.pending, 0) / data.length);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Ticket Trends Over Time</CardTitle>
            <CardDescription>Track ticket creation and resolution patterns ({timeRange})</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.created }} />
              <p className="text-sm font-medium text-muted-foreground">Total Created</p>
            </div>
            <p className="text-2xl font-bold">{totalCreated}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.resolved }} />
              <p className="text-sm font-medium text-muted-foreground">Total Resolved</p>
            </div>
            <p className="text-2xl font-bold">{totalResolved}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.pending }} />
              <p className="text-sm font-medium text-muted-foreground">Avg Pending</p>
            </div>
            <p className="text-2xl font-bold">{avgPending}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-card p-4 shadow-xl">
                      <p className="font-semibold text-card-foreground mb-3">{payload[0].payload.date}</p>
                      <div className="space-y-2">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-sm text-muted-foreground capitalize">{entry.name}</span>
                            </div>
                            <span className="text-sm font-bold" style={{ color: entry.color }}>
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="created"
              stroke={COLORS.created}
              strokeWidth={3}
              name="Created"
              dot={{ r: 5, strokeWidth: 2, fill: 'hsl(var(--background))' }}
              activeDot={{ r: 7 }}
              animationBegin={0}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke={COLORS.resolved}
              strokeWidth={3}
              name="Resolved"
              dot={{ r: 5, strokeWidth: 2, fill: 'hsl(var(--background))' }}
              activeDot={{ r: 7 }}
              animationBegin={200}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke={COLORS.pending}
              strokeWidth={3}
              name="Pending"
              dot={{ r: 5, strokeWidth: 2, fill: 'hsl(var(--background))' }}
              activeDot={{ r: 7 }}
              animationBegin={400}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
