'use client';

import { useEffect, useState } from 'react';
import { useTicketStore, useTicketStats, useTicketActions } from '@/stores/ticket-store';
import { TicketStatsCards } from '@/components/support/ticket-stats-cards';
import { TicketStatsCharts } from '@/components/support/ticket-stats-charts';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function SupportAnalyticsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const stats = useTicketStats();
  const { fetchStats, fetchTickets } = useTicketActions();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTickets();
        await fetchStats();
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/app/support')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Support Analytics</h1>
            <p className="text-gray-600 mt-1">Overview of ticket metrics and statistics</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <TicketStatsCards stats={stats} />

      {/* Charts */}
      <TicketStatsCharts stats={stats} />
    </motion.div>
  );
}
