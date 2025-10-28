'use client';

import { TicketStats } from '@/types/ticket';
import { Card } from '@/components/ui/card';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface TicketStatsCardsProps {
  stats: TicketStats | null;
}

export function TicketStatsCards({ stats }: TicketStatsCardsProps) {
  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    },
    {
      title: 'Resolved Today',
      value: stats.resolvedToday,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    },
    {
      title: 'Avg Resolution',
      value: `${Math.round(stats.avgResolutionTime / 60)}h`,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    },
    {
      title: 'SLA Compliance',
      value: `${stats.slaCompliance}%`,
      icon: CheckCircle,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    },
    {
      title: 'Overdue Tickets',
      value: stats.overdueTickets,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
