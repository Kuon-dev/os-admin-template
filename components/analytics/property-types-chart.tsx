'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { propertyTypeData, CHART_COLORS } from '@/lib/mock-data/analytics-data';

export function PropertyTypesChart() {
  // Prepare data for horizontal bar chart
  const chartData = propertyTypeData.map((item) => ({
    name: item.label,
    occupied: item.occupied,
    vacant: item.vacant,
    total: item.total,
    occupancyRate: item.occupancyRate,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Occupancy by Property Type</CardTitle>
        <CardDescription>
          Occupied vs vacant units across property categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={90}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-card p-4 shadow-xl">
                      <p className="mb-3 font-semibold text-card-foreground">
                        {data.name}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: CHART_COLORS.occupied }}
                            />
                            <span className="text-sm text-muted-foreground">
                              Occupied
                            </span>
                          </div>
                          <span
                            className="text-sm font-bold"
                            style={{ color: CHART_COLORS.occupied }}
                          >
                            {data.occupied} units
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: CHART_COLORS.vacant }}
                            />
                            <span className="text-sm text-muted-foreground">
                              Vacant
                            </span>
                          </div>
                          <span
                            className="text-sm font-bold"
                            style={{ color: CHART_COLORS.vacant }}
                          >
                            {data.vacant} units
                          </span>
                        </div>
                        <div className="mt-2 border-t pt-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                              Occupancy Rate
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              {data.occupancyRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
            <Bar
              dataKey="occupied"
              name="Occupied"
              fill={CHART_COLORS.occupied}
              stackId="stack"
              radius={[0, 0, 0, 0]}
              animationBegin={0}
              animationDuration={800}
            />
            <Bar
              dataKey="vacant"
              name="Vacant"
              fill={CHART_COLORS.vacant}
              stackId="stack"
              radius={[0, 4, 4, 0]}
              animationBegin={200}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
