'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star } from 'lucide-react';

const teamMembers = [
  { name: 'Sarah Chen', resolved: 142, rating: 4.9, initials: 'SC', rank: 1 },
  { name: 'Michael Torres', resolved: 128, rating: 4.8, initials: 'MT', rank: 2 },
  { name: 'Emily Rodriguez', resolved: 115, rating: 4.7, initials: 'ER', rank: 3 },
  { name: 'James Wilson', resolved: 98, rating: 4.6, initials: 'JW', rank: 4 },
];

export function TeamPerformanceCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <CardTitle>Top Performers</CardTitle>
        </div>
        <CardDescription>Team members by tickets resolved this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                {member.rank === 1 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Trophy className="h-3 w-3 text-yellow-900" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm text-foreground truncate">{member.name}</p>
                  {member.rank <= 3 && (
                    <Badge variant="secondary" className="text-xs">
                      #{member.rank}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{member.resolved} resolved</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {member.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
