"use client";

import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Users, CreditCard, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "+5.2%",
      icon: Activity,
      color: "text-secondary",
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+18.3%",
      icon: CreditCard,
      color: "text-accent",
    },
    {
      title: "Growth",
      value: "24.5%",
      change: "+4.1%",
      icon: TrendingUp,
      color: "text-chart-1",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('overview')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">{stat.change}</span> from last
                  month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('stats')}</CardTitle>
            <CardDescription>
              Overview of your dashboard statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Chart placeholder - Add your charts here
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('recent')}</CardTitle>
            <CardDescription>Recent activity on your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Activity {i}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i} hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
