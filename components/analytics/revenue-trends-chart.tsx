'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { revenueData, CHART_COLORS } from '@/lib/mock-data/analytics-data';

interface RevenueTrendsChartProps {
  timeRange?: string;
}

export function RevenueTrendsChart({ timeRange = '12m' }: RevenueTrendsChartProps) {
  const handleExport = () => {
    const csv =
      'Month,Revenue,Expenses,Net Income\n' +
      revenueData
        .map((item) => `${item.month},${item.revenue},${item.expenses},${item.netIncome}`)
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-trends.csv';
    a.click();
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  // Calculate totals for summary
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
  const totalNetIncome = revenueData.reduce((sum, item) => sum + item.netIncome, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Revenue & Expense Trends</CardTitle>
            <CardDescription>
              12-month financial overview ({timeRange})
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-1 flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS.revenue }}
              />
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-1 flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS.expenses }}
              />
              <p className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-1 flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS.netIncome }}
              />
              <p className="text-sm font-medium text-muted-foreground">
                Net Income
              </p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalNetIncome)}</p>
          </div>
        </div>

        {/* Area Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={revenueData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.revenue}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.revenue}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.expenses}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.expenses}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorNetIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.netIncome}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.netIncome}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-card p-4 shadow-xl">
                      <p className="mb-3 font-semibold text-card-foreground">
                        {payload[0].payload.month}
                      </p>
                      <div className="space-y-2">
                        {payload.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {entry.name}
                              </span>
                            </div>
                            <span
                              className="text-sm font-bold"
                              style={{ color: entry.color }}
                            >
                              {formatCurrency(entry.value as number)}
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
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={CHART_COLORS.revenue}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
              animationBegin={0}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke={CHART_COLORS.expenses}
              fillOpacity={1}
              fill="url(#colorExpenses)"
              strokeWidth={2}
              animationBegin={200}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="netIncome"
              name="Net Income"
              stroke={CHART_COLORS.netIncome}
              fillOpacity={1}
              fill="url(#colorNetIncome)"
              strokeWidth={2}
              animationBegin={400}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
