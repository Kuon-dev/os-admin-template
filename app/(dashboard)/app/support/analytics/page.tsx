'use client';

import { useEffect, useState } from 'react';
import { useTicketActions } from '@/stores/ticket-store';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MetricCard } from '@/components/metric-card';
import { TicketStatusChart } from '@/components/ticket-status-chart';
import { PriorityDistributionChart } from '@/components/priority-distribution-chart';
import { TicketTrendsChart } from '@/components/ticket-trends-chart';
import { TeamPerformanceCard } from '@/components/team-performance-card';
import { InsightsCard } from '@/components/insights-card';
import { Download, Filter, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function SupportAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const { fetchTickets } = useTicketActions();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTickets();
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchTickets]);

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Analytics</h1>
          <p className="text-muted-foreground mt-1">Monitor and analyze your support team performance</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tickets</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Tickets"
          value="1,284"
          change={12.5}
          trend="up"
          sparklineData={[45, 52, 48, 61, 58, 65, 72]}
          actionLabel="View All"
        />
        <MetricCard
          title="Open Tickets"
          value="247"
          change={-8.2}
          trend="down"
          sparklineData={[85, 78, 82, 75, 68, 62, 58]}
          actionLabel="View Open"
        />
        <MetricCard
          title="Avg Response Time"
          value="2.4h"
          change={-15.3}
          trend="down"
          sparklineData={[3.2, 3.0, 2.8, 2.6, 2.5, 2.4, 2.4]}
          actionLabel="View Details"
        />
        <MetricCard
          title="Resolution Rate"
          value="94.2%"
          change={3.1}
          trend="up"
          sparklineData={[88, 89, 91, 92, 93, 93, 94]}
          actionLabel="View Resolved"
        />
        <MetricCard
          title="Customer Satisfaction"
          value="4.8/5"
          change={0}
          trend="stable"
          sparklineData={[4.7, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8]}
          actionLabel="View Feedback"
        />
        <MetricCard
          title="Overdue Tickets"
          value="18"
          change={-22.5}
          trend="down"
          sparklineData={[32, 28, 25, 23, 21, 19, 18]}
          actionLabel="View Overdue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TicketStatusChart />
        <PriorityDistributionChart />
      </div>

      {/* Timeline Chart */}
      <TicketTrendsChart timeRange={timeRange} />

      {/* Insights and Team Performance */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InsightsCard />
        </div>
        <TeamPerformanceCard />
      </div>
    </motion.div>
  );
}
