'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatCard } from '@/components/dashboard/stat-card';
import {
  RevenueTrendsChart,
  PropertyTypesChart,
  MaintenanceChart,
  AnalyticsInsights,
} from '@/components/analytics';
import { analyticsMetrics } from '@/lib/mock-data/analytics-data';
import { Download, Calendar, Building2, DollarSign, Home, Wrench } from 'lucide-react';
import { toast } from 'sonner';

const iconMap = {
  occupancy: Building2,
  revenue: DollarSign,
  properties: Home,
  maintenance: Wrench,
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('12m');

  const handleExport = () => {
    toast.success('Exporting analytics report...');
    // In a real app, this would trigger a download
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-5xl"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 pb-4 mb-6 border-b border-border md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Property Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your property portfolio performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Hero Metrics - 4 Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsMetrics.map((metric, index) => {
          const Icon = iconMap[metric.id as keyof typeof iconMap];
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <StatCard
                icon={Icon}
                label={metric.label}
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                trend={metric.trend}
                color={metric.color}
                tooltip={`${metric.label} for the selected time period`}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Primary Chart - Revenue Trends (Full Width) */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <RevenueTrendsChart timeRange={timeRange} />
        </motion.div>
      </div>

      {/* Secondary Charts - Property Types + Maintenance */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <PropertyTypesChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <MaintenanceChart />
        </motion.div>
      </div>

      {/* Insights */}
      <div className="pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <AnalyticsInsights />
        </motion.div>
      </div>
    </motion.div>
  );
}
