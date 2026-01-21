'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import PermissionGuard, { RoleBasedContent } from '../../components/PermissionGuard';
import Link from 'next/link';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  Calendar,
  Users,
  Wallet,
  UserCircle,
  ArrowUpRight,
  Activity,
  ChevronRight,
  Loader2,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import RecentActivity from '../../components/RecentActivity';
import UpcomingEvents from '../../components/UpcomingEvents';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalCapacity: 0,
    totalAttendees: 0,
    totalRevenue: 0,
    totalUsers: 0,
    loading: true
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [eventsResponse, paymentsResponse, usersResponse] = await Promise.all([
          api.events.getAll(),
          api.payments.getAll(),
          api.users.getAll()
        ]);

        if (eventsResponse.ok && paymentsResponse.ok && usersResponse.ok) {
          const events = await eventsResponse.json();
          const payments = await paymentsResponse.json();
          const users = await usersResponse.json();

          setStats({
            totalEvents: events.length,
            totalCapacity: events.reduce((sum, event) => sum + (event.capacity || 0), 0),
            totalAttendees: payments.length,
            totalRevenue: payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0),
            totalUsers: users.length,
            loading: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, router]);

  if (stats.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Synchronizing Workspace...</p>
      </div>
    );
  }

  const statItems = [
    { title: "Total Events", value: stats.totalEvents, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10", role: ['ADMIN', 'ORGANIZER', 'ATTENDEE'] },
    { title: "Capacity Total", value: stats.totalCapacity, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", role: ['ADMIN', 'ORGANIZER'] },
    { title: "Ticket Holders", value: stats.totalAttendees, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", role: ['ADMIN', 'ORGANIZER'] },
    { title: "Net Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10", role: ['ADMIN', 'ORGANIZER'] },
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Workspace Console</h1>
          </div>
          <RoleBasedContent
            content={{
              ADMIN: <p className="text-muted-foreground font-medium text-lg">System-wide overview for <span className="text-primary font-bold">Administrator</span></p>,
              ORGANIZER: <p className="text-muted-foreground font-medium text-lg">Event performance for <span className="text-primary font-bold">{user?.name}</span></p>,
              ATTENDEE: <p className="text-muted-foreground font-medium text-lg">Personal journey dashboard for <span className="text-primary font-bold">{user?.name}</span></p>,
            }}
          />
        </div>
        <PermissionGuard roles={['ADMIN', 'ORGANIZER']}>
          <Link href="/events/create">
            <Button size="lg" className="premium-gradient hover:shadow-xl hover:shadow-primary/20 h-14 px-8 rounded-2xl font-black text-base gap-2 group transition-all active:scale-95">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Manifest New Event
            </Button>
          </Link>
        </PermissionGuard>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <PermissionGuard key={idx} roles={item.role}>
            <Card className="glass-card border-none ring-1 ring-white/10 dark:ring-white/5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`${item.bg} p-3 rounded-xl`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">
                    <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
                  </Badge>
                </div>
                <div className="mt-6">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{item.title}</p>
                  <h3 className="text-3xl font-black text-foreground tracking-tight">{item.value}</h3>
                </div>
              </CardContent>
            </Card>
          </PermissionGuard>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <RecentActivity />
        </div>
        <div className="space-y-8">
          <UpcomingEvents />

          <Card className="premium-gradient border-none p-1 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 text-white relative">
              <div className="absolute top-0 right-0 p-6 opacity-20"><Sparkles className="w-20 h-20" /></div>
              <h4 className="text-2xl font-bold mb-4 relative z-10">Premium Support</h4>
              <p className="text-white/80 font-medium mb-6 relative z-10 leading-relaxed">Need assistance with your event strategy? Our elite support team is online.</p>
              <Button variant="secondary" className="w-full h-12 rounded-xl font-bold text-primary relative z-10">
                Open Channel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
