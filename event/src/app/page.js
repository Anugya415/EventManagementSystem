'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import UpcomingEvents from '../components/UpcomingEvents';
import PermissionGuard, { RoleBasedContent } from '../components/PermissionGuard';
import { useAuth } from '../components/AuthContext';
import { api } from '../lib/api';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalCapacity: 0,
    totalAttendees: 0,
    totalRevenue: 0,
    totalUsers: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;

      try {
        // Fetch all necessary data
        const [eventsResponse, paymentsResponse, usersResponse, ticketsResponse] = await Promise.all([
          api.events.getAll(),
          api.payments.getAll(),
          api.users.getAll(),
          api.tickets.getAll()
        ]);

        if (eventsResponse.ok && paymentsResponse.ok && usersResponse.ok && ticketsResponse.ok) {
          const events = await eventsResponse.json();
          const payments = await paymentsResponse.json();
          const users = await usersResponse.json();
          const tickets = await ticketsResponse.json();

          const totalEvents = events.length;
          const totalCapacity = events.reduce((sum, event) => sum + (event.capacity || 0), 0);
          const totalAttendees = payments.length;
          const totalRevenue = payments
            .filter(p => p.status === 'COMPLETED')
            .reduce((sum, payment) => sum + payment.amount, 0);
          const totalUsers = users.length;

          setStats({
            totalEvents,
            totalCapacity,
            totalAttendees,
            totalRevenue,
            totalUsers,
            loading: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <RoleBasedContent
            content={{
              ADMIN: <p className="text-gray-600 mt-1">Welcome back, Administrator! Here&apos;s what&apos;s happening with all events.</p>,
              ORGANIZER: <p className="text-gray-600 mt-1">Welcome back, Organizer! Here&apos;s what&apos;s happening with your events.</p>,
              ATTENDEE: <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your event dashboard.</p>,
            }}
            defaultContent={<p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your events.</p>}
          />
        </div>
        <PermissionGuard
          roles={['ADMIN', 'ORGANIZER']}
          fallback={<div className="text-sm text-gray-500">Only organizers can create events</div>}
        >
          <Link
            href="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Event
          </Link>
        </PermissionGuard>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.loading ? "..." : stats.totalEvents.toLocaleString()}
          change={stats.totalEvents > 0 ? "+20.1%" : "0%"}
          icon="🎪"
          color="blue"
        />
        <StatCard
          title="Total Capacity"
          value={stats.loading ? "..." : stats.totalCapacity.toLocaleString()}
          change={stats.totalCapacity > 0 ? "+15.3%" : "0%"}
          icon="🏟️"
          color="green"
        />
        <PermissionGuard roles={['ADMIN', 'ORGANIZER']}>
          <StatCard
            title="Total Attendees"
            value={stats.loading ? "..." : stats.totalAttendees.toLocaleString()}
            change={stats.totalAttendees > 0 && stats.totalCapacity > 0
              ? `${((stats.totalAttendees / stats.totalCapacity) * 100).toFixed(1)}% of capacity`
              : "0%"}
            icon="👥"
            color="green"
          />
        </PermissionGuard>
        <PermissionGuard roles={['ADMIN', 'ORGANIZER']}>
          <StatCard
            title="Revenue"
            value={stats.loading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
            change={stats.totalRevenue > 0 ? "+12.5%" : "0%"}
            icon="💰"
            color="yellow"
          />
        </PermissionGuard>
        <PermissionGuard roles={['ADMIN']}>
          <StatCard
            title="System Users"
            value={stats.loading ? "..." : stats.totalUsers.toLocaleString()}
            change={stats.totalUsers > 0 ? "+5.2%" : "0%"}
            icon="👤"
            color="indigo"
          />
        </PermissionGuard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Upcoming Events */}
        <div>
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
