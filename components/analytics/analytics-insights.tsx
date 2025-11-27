'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { analyticsInsights, type AnalyticsInsight } from '@/lib/mock-data/analytics-data';

const iconMap = {
  positive: TrendingUp,
  warning: AlertTriangle,
  info: Lightbulb,
};

const badgeVariantMap = {
  positive: 'default' as const,
  warning: 'destructive' as const,
  info: 'secondary' as const,
};

const badgeLabelMap = {
  positive: 'Positive',
  warning: 'Attention',
  info: 'Insight',
};

const iconStyleMap = {
  positive: 'bg-green-500/10 text-green-600 dark:text-green-400',
  warning: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
};

export function AnalyticsInsights() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle>Key Insights</CardTitle>
        </div>
        <CardDescription>
          Important observations from your property portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsInsights.map((insight) => {
            const Icon = iconMap[insight.type];
            const badgeVariant = badgeVariantMap[insight.type];
            const badgeLabel = badgeLabelMap[insight.type];
            const iconStyle = iconStyleMap[insight.type];

            return (
              <div
                key={insight.id}
                className="flex gap-4 rounded-lg border border-border bg-card/50 p-4 transition-colors hover:bg-card"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {insight.title}
                    </h4>
                    {insight.metric && (
                      <span
                        className={`text-xs font-bold ${
                          insight.type === 'positive'
                            ? 'text-green-600 dark:text-green-400'
                            : insight.type === 'warning'
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {insight.metric}
                      </span>
                    )}
                    <Badge variant={badgeVariant} className="text-xs">
                      {badgeLabel}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
