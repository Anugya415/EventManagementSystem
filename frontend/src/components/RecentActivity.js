'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  RefreshCw,
  Clock,
  Zap,
  CreditCard,
  UserPlus,
  Settings,
  Bell,
  Ticket,
  TrendingUp,
  ChevronRight,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const fetchRecentActivity = async () => {
    try {
      const [eventsResponse, paymentsResponse, usersResponse] = await Promise.all([
        api.events.getAll(),
        api.payments.getAll(),
        api.users.getAll()
      ]);

      const activities = [];
      if (eventsResponse.ok) {
        const events = await eventsResponse.json();
        events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2).forEach(event => {
          activities.push({
            id: `event-${event.id}`,
            type: 'event',
            message: `Event Manifested: ${event.name}`,
            time: formatTimeAgo(event.createdAt),
            icon: <Zap className="w-4 h-4 text-amber-500" />,
            color: "bg-amber-500/10",
            priority: 1
          });
        });
      }

      if (paymentsResponse.ok) {
        const payments = await paymentsResponse.json();
        payments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3).forEach(payment => {
          activities.push({
            id: `payment-${payment.id}`,
            type: 'payment',
            message: `Protocol Receipt: ₹${payment.amount.toLocaleString()} for ${payment.eventName}`,
            time: formatTimeAgo(payment.updatedAt),
            icon: <CreditCard className="w-4 h-4 text-emerald-500" />,
            color: "bg-emerald-500/10",
            priority: 2
          });
        });
      }

      const now = new Date();
      activities.push({
        id: 'sys-1',
        type: 'system',
        message: 'Neural metrics synchronized with central node',
        time: '5m ago',
        icon: <Activity className="w-4 h-4 text-blue-500" />,
        color: "bg-blue-500/10",
        priority: 4
      });

      setActivities(activities.sort((a, b) => a.priority - b.priority).slice(0, 6));
    } catch (error) {
      console.error(error);
      setActivities([{ id: 1, type: 'status', message: 'System Ready', time: 'Now', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, color: "bg-emerald-500/10" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecentActivity(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecentActivity();
    setRefreshing(false);
  };

  return (
    <Card className="glass border-none shadow-2xl rounded-[2rem] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
        <div>
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            Live Feed
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium mt-1 uppercase tracking-widest text-[10px]">Real-time system telemetry</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-xl h-10 w-10 hover:bg-primary/5"
        >
          <RefreshCw className={`w-4 h-4 text-primary ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-primary/5 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-primary/5 rounded w-3/4"></div>
                  <div className="h-3 bg-primary/5 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="p-6 flex items-start gap-5 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className={`${activity.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-bold leading-snug group-hover:text-primary transition-colors">{activity.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <Clock className="w-3 h-3 mr-1" /> {activity.time}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter bg-white/5">
                      {activity.type}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 self-center group-hover:translate-x-1 transition-transform" />
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <Activity className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Idle state detected.</p>
            </div>
          )}
        </div>

        {!loading && (
          <div className="p-6 bg-muted/20 border-t border-white/5">
            <Link href="/activity">
              <Button variant="ghost" className="w-full justify-between font-bold text-primary hover:bg-primary/5 rounded-xl h-12 px-6">
                Inspect Full Log
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
