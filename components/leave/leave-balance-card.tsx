'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { LeaveBalance } from '@/types/employee';

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
}

const getLeaveTypeColor = (leaveType: string) => {
  switch (leaveType) {
    case 'Annual Leave':
      return { bg: 'bg-blue-500', text: 'text-blue-600' };
    case 'Sick Leave':
      return { bg: 'bg-red-500', text: 'text-red-600' };
    case 'Personal Leave':
      return { bg: 'bg-purple-500', text: 'text-purple-600' };
    case 'Parental Leave':
      return { bg: 'bg-green-500', text: 'text-green-600' };
    default:
      return { bg: 'bg-gray-500', text: 'text-gray-600' };
  }
};

export function LeaveBalanceCard({ balance }: LeaveBalanceCardProps) {
  const colors = getLeaveTypeColor(balance.leaveType);
  const usagePercentage = (balance.used / balance.total) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {balance.leaveType}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-3xl font-bold ${colors.text}`}>
              {balance.remaining}
            </p>
            <p className="text-xs text-muted-foreground">days remaining</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{balance.used} used</p>
            <p>{balance.total} total</p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress
            value={usagePercentage}
            className="h-2"
            indicatorClassName={colors.bg}
          />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round(usagePercentage)}% used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
