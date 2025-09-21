'use client';

import Link from 'next/link';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import UpcomingEvents from '../components/UpcomingEvents';
import PermissionGuard, { RoleBasedContent } from '../components/PermissionGuard';
import { useAuth } from '../components/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <RoleBasedContent
            content={{
              ADMIN: <p className="text-gray-600 mt-1">Welcome back, Administrator! Here's what's happening with all events.</p>,
              ORGANIZER: <p className="text-gray-600 mt-1">Welcome back, Organizer! Here's what's happening with your events.</p>,
              ATTENDEE: <p className="text-gray-600 mt-1">Welcome back! Here's your event dashboard.</p>,
            }}
            defaultContent={<p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>}
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
          value="12"
          change="+20.1%"
          icon="🎪"
          color="blue"
        />
        <StatCard
          title="Total Attendees"
          value="2,847"
          change="+15.3%"
          icon="👥"
          color="green"
        />
        <PermissionGuard roles={['ADMIN', 'ORGANIZER']}>
          <StatCard
            title="Revenue"
            value="$45,231"
            change="+12.5%"
            icon="💰"
            color="yellow"
          />
        </PermissionGuard>
        <PermissionGuard roles={['ADMIN', 'ORGANIZER']}>
          <StatCard
            title="Tickets Sold"
            value="1,429"
            change="+8.2%"
            icon="🎫"
            color="purple"
          />
        </PermissionGuard>
        <PermissionGuard roles={['ADMIN']}>
          <StatCard
            title="System Users"
            value="156"
            change="+5.2%"
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
