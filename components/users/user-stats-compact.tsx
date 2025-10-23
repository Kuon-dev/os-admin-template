'use client';

import { useEffect, useState } from 'react';
import { Users, UserCheck, UserPlus, Shield } from 'lucide-react';
import { motion, useSpring, useTransform } from 'motion/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { UserStats } from '@/types/user';

interface UserStatsCompactProps {
  stats: UserStats;
}

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const spring = useSpring(0, { stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on('change', (latest) => setDisplayValue(latest));
    return () => unsubscribe();
  }, [value, spring, display]);

  return <span>{displayValue}</span>;
}

const statVariants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      delay: custom * 0.05,
    },
  }),
};

export function UserStatsCompact({ stats }: UserStatsCompactProps) {
  const activePercentage = stats.total > 0
    ? ((stats.active / stats.total) * 100).toFixed(1)
    : '0.0';

  const statsData = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.total,
      detail: `${stats.adminCount} admins, ${stats.editorCount} editors, ${stats.userCount} users`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: UserCheck,
      label: 'Active Users',
      value: stats.active,
      detail: `${activePercentage}% of total users are active`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: UserPlus,
      label: 'New This Month',
      value: stats.newThisMonth,
      detail: `${stats.inactive} inactive, ${stats.suspended} suspended`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Shield,
      label: 'Administrators',
      value: stats.adminCount,
      detail: 'Users with full system access',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <TooltipProvider key={stat.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  custom={index}
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 400, damping: 17 },
                  }}
                  className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-shadow hover:shadow-md cursor-help"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                      <span className="text-2xl font-bold tabular-nums">
                        <AnimatedCounter value={stat.value} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <p className="text-xs">{stat.detail}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
