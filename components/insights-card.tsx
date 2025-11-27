'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Clock, AlertCircle } from 'lucide-react';

const insights = [
  {
    icon: TrendingUp,
    title: 'Resolution Time Improving',
    description: 'High priority tickets now average 2.5h to resolve, down 18% from last month',
    type: 'positive' as const,
  },
  {
    icon: Clock,
    title: 'Peak Hours Identified',
    description: 'Most tickets arrive between 9-11 AM. Consider adjusting team schedules',
    type: 'info' as const,
  },
  {
    icon: AlertCircle,
    title: 'Billing Issues Trending',
    description: 'Billing-related tickets increased 23% this week. May need additional resources',
    type: 'warning' as const,
  },
  {
    icon: Lightbulb,
    title: 'Self-Service Opportunity',
    description: '45% of tickets are password resets. Consider implementing automated reset flow',
    type: 'info' as const,
  },
];

export function InsightsCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle>AI-Powered Insights</CardTitle>
        </div>
        <CardDescription>Actionable recommendations based on your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const badgeVariant =
              insight.type === 'positive' ? 'default' : insight.type === 'warning' ? 'destructive' : 'secondary';

            return (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
              >
                <div
                  className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                  ${
                    insight.type === 'positive'
                      ? 'bg-green-500/10 text-green-600'
                      : insight.type === 'warning'
                        ? 'bg-orange-500/10 text-orange-600'
                        : 'bg-blue-500/10 text-blue-600'
                  }
                `}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-foreground">{insight.title}</h4>
                    <Badge variant={badgeVariant} className="text-xs">
                      {insight.type === 'positive'
                        ? 'Positive'
                        : insight.type === 'warning'
                          ? 'Action Needed'
                          : 'Insight'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
