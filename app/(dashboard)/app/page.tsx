'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { LiveMetric } from '@/components/dashboard/live-metric';
import { ProgressRing } from '@/components/dashboard/progress-ring';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { MiniChart } from '@/components/dashboard/mini-chart';
import { DataTable } from '@/components/dashboard/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  dashboardStats,
  liveMetrics,
  systemHealth,
  performanceMetrics,
  recentActivity,
  recentTransactions,
  transactionColumns,
  topProducts,
  goals,
} from '@/lib/mock-data/dashboard-data';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/5 p-4 md:p-8">
      <div className="mx-auto max-w-[1800px] space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-muted-foreground">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Report
          </Button>
        </motion.div>

        {/* Live Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-background to-background">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Live Operational Metrics
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Real-time system health and performance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {liveMetrics.map((metric) => (
                  <LiveMetric
                    key={metric.label}
                    {...metric}
                    updateInterval={2000}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Key Business Metrics</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View Details
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {dashboardStats.map((stat) => (
              <StatCard key={stat.id} {...stat} />
            ))}
          </div>
        </motion.div>

        {/* Performance Charts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Performance Trends</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {performanceMetrics.map((metric) => (
              <Card key={metric.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MiniChart
                    data={metric.data}
                    type={metric.type}
                    color={metric.color}
                    height={80}
                  />
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Last 7 days</span>
                    {metric.id === 'conversion-trend' || metric.id === 'customer-acquisition' ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <TrendingUp className="h-3 w-3" />
                        Trending up
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <TrendingUp className="h-3 w-3" />
                        Growing
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Goals and Activity Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Goals Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <PieChart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Quarterly Objectives
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Q4 2024 strategic goals
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {goals.map((goal) => (
                    <ProgressRing
                      key={goal.label}
                      value={goal.value}
                      max={goal.max}
                      label={goal.label}
                      color={goal.color}
                      size="sm"
                      showPercentage
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        Recent Activity
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Latest system events and updates
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                <ActivityFeed items={recentActivity} maxItems={8} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Health Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      System Health
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Infrastructure monitoring
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    All Systems Operational
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {systemHealth.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {metric.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold tabular-nums">
                          {metric.value}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            metric.value < 50
                              ? 'from-green-500 to-green-600'
                              : metric.value < 80
                                ? 'from-orange-500 to-orange-600'
                                : 'from-red-500 to-red-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products Performance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Top Performing Products
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Best sellers this month
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Details
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.8 + index * 0.1,
                    }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales.toLocaleString()} sales • $
                        {product.revenue.toLocaleString()} revenue
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MiniChart
                        data={[20, 35, 28, 42, 38, 45, 52]}
                        type="line"
                        color={product.color}
                        height={40}
                        showGradient={false}
                      />
                      <div
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                          product.trend > 0
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {product.trend > 0 ? '+' : ''}
                        {product.trend}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Recent Transactions
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Latest orders and payments
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={transactionColumns}
                data={recentTransactions}
                maxRows={7}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Stats - Platform Health Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="rounded-xl border bg-card/30 p-6 backdrop-blur-sm"
        >
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Platform Health
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total Users
              </p>
              <p className="text-3xl font-bold tabular-nums">24,573</p>
              <p className="mt-1 text-xs text-muted-foreground">All-time registrations</p>
            </div>
            <Separator orientation="vertical" className="hidden lg:block" />
            <div className="text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                API Uptime
              </p>
              <p className="text-3xl font-bold tabular-nums">99.98%</p>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">Last 30 days</p>
            </div>
            <Separator orientation="vertical" className="hidden lg:block" />
            <div className="text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Data Processed
              </p>
              <p className="text-3xl font-bold tabular-nums">2.4TB</p>
              <p className="mt-1 text-xs text-muted-foreground">
                This month
              </p>
            </div>
            <Separator orientation="vertical" className="hidden lg:block" />
            <div className="text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Support CSAT
              </p>
              <p className="text-3xl font-bold tabular-nums">4.8</p>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">Out of 5.0 stars</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
