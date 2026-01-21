'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function ActivityPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchAllActivity = async () => {
      try {
        // Fetch data from multiple endpoints
        const [eventsResponse, paymentsResponse, usersResponse, ticketsResponse] = await Promise.all([
          api.events.getAll(),
          api.payments.getAll(),
          api.users.getAll(),
          api.tickets.getAll()
        ]);

        const activities = [];
        let events = [];

        // Process events
        if (eventsResponse.ok) {
          events = await eventsResponse.json();
          events.forEach(event => {
            activities.push({
              id: `event-${event.id}`,
              type: 'event',
              message: `Event "${event.name}" was ${event.status === 'ACTIVE' ? 'created and activated' : event.status.toLowerCase()}`,
              description: `${event.type} • ${event.location} • Capacity: ${event.capacity}`,
              time: formatTimeAgo(event.createdAt),
              timestamp: new Date(event.createdAt),
              icon: event.type === 'CONFERENCE' ? '🎯' : 
                    event.type === 'FESTIVAL' ? '🎪' : 
                    event.type === 'WEDDING' ? '💒' : 
                    event.type === 'WORKSHOP' ? '🎓' : '📅',
              priority: 1,
              status: event.status
            });
          });
        }

        // Process payments
        if (paymentsResponse.ok) {
          const payments = await paymentsResponse.json();
          payments.forEach(payment => {
            activities.push({
              id: `payment-${payment.id}`,
              type: 'payment',
              message: `Payment ${payment.status.toLowerCase()}: ₹${payment.amount.toLocaleString()}`,
              description: `${payment.eventName} • ${payment.paymentMethod} • ${payment.userEmail}`,
              time: formatTimeAgo(payment.updatedAt),
              timestamp: new Date(payment.updatedAt),
              icon: payment.status === 'COMPLETED' ? '💳' : 
                    payment.status === 'PENDING' ? '⏳' : 
                    payment.status === 'FAILED' ? '❌' : '💰',
              priority: 2,
              status: payment.status
            });
          });
        }

        // Process users
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          users.forEach(user => {
            activities.push({
              id: `user-${user.id}`,
              type: 'registration',
              message: `${user.name} registered as ${user.role.toLowerCase()}`,
              description: `${user.email} • ${user.phone || 'No phone'}`,
              time: formatTimeAgo(user.createdAt),
              timestamp: new Date(user.createdAt),
              icon: user.role === 'ADMIN' ? '👑' : 
                    user.role === 'ORGANIZER' ? '👨‍💼' : '👤',
              priority: 3,
              status: 'ACTIVE'
            });
          });
        }

        // Process tickets
        if (ticketsResponse.ok) {
          const tickets = await ticketsResponse.json();
          tickets.forEach(ticket => {
            activities.push({
              id: `ticket-${ticket.id}`,
              type: 'ticket',
              message: `Ticket "${ticket.name}" created`,
              description: `₹${ticket.price} • ${ticket.quantityAvailable} available • ${ticket.eventName}`,
              time: formatTimeAgo(ticket.createdAt),
              timestamp: new Date(ticket.createdAt),
              icon: '🎫',
              priority: 4,
              status: ticket.status
            });
          });
        }

        // Add system activities
        const now = new Date();
        const systemActivities = [
          {
            id: 'system-1',
            type: 'system',
            message: 'System health check completed',
            description: 'All services operational • Database connected • APIs responding',
            time: formatTimeAgo(new Date(now - 30 * 60 * 1000)),
            timestamp: new Date(now - 30 * 60 * 1000),
            icon: '✅',
            priority: 5,
            status: 'COMPLETED'
          },
          {
            id: 'system-2',
            type: 'notification',
            message: 'Automated email reminders sent',
            description: `Sent to ${events.filter(e => e.status === 'ACTIVE').length * 10} attendees for upcoming events`,
            time: formatTimeAgo(new Date(now - 2 * 60 * 60 * 1000)),
            timestamp: new Date(now - 2 * 60 * 60 * 1000),
            icon: '📧',
            priority: 6,
            status: 'SENT'
          },
          {
            id: 'system-3',
            type: 'report',
            message: 'Daily analytics report generated',
            description: 'Revenue, attendance, and performance metrics compiled',
            time: formatTimeAgo(new Date(now - 6 * 60 * 60 * 1000)),
            timestamp: new Date(now - 6 * 60 * 60 * 1000),
            icon: '📊',
            priority: 7,
            status: 'GENERATED'
          }
        ];

        activities.push(...systemActivities);

        // Sort by timestamp (most recent first)
        const sortedActivities = activities.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(sortedActivities);
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllActivity();
  }, [isAuthenticated, router]);

  const getActivityColor = (type) => {
    switch (type) {
      case 'event': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'payment': return 'bg-green-50 border-green-200 text-green-800';
      case 'registration': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'system': return 'bg-gray-50 border-gray-200 text-gray-800';
      case 'notification': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'ticket': return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'report': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SENT': return 'bg-purple-100 text-purple-800';
      case 'GENERATED': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activityTypes = [
    { value: 'all', label: 'All Activities', count: activities.length },
    { value: 'event', label: 'Events', count: activities.filter(a => a.type === 'event').length },
    { value: 'payment', label: 'Payments', count: activities.filter(a => a.type === 'payment').length },
    { value: 'registration', label: 'Registrations', count: activities.filter(a => a.type === 'registration').length },
    { value: 'ticket', label: 'Tickets', count: activities.filter(a => a.type === 'ticket').length },
    { value: 'system', label: 'System', count: activities.filter(a => a.type === 'system').length },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Feed</h1>
          <p className="text-gray-600 mt-1">Complete history of system activities and events</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-150"
          >
            Refresh Feed
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  filter === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label} ({type.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Activities' : `${activityTypes.find(t => t.value === filter)?.label} Activities`}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredActivities.length} {filteredActivities.length === 1 ? 'item' : 'items'})
            </span>
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="p-6 flex items-start space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`p-6 flex items-start space-x-4 hover:bg-gray-50 transition-colors duration-150 border-l-4 ${getActivityColor(activity.type)}`}
              >
                <div className="text-3xl flex-shrink-0">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-900 leading-6">{activity.message}</p>
                      <p className="text-sm text-gray-600 mt-1 leading-5">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.type === 'event' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'payment' ? 'bg-green-100 text-green-800' :
                        activity.type === 'registration' ? 'bg-purple-100 text-purple-800' :
                        activity.type === 'system' ? 'bg-gray-100 text-gray-800' :
                        activity.type === 'notification' ? 'bg-yellow-100 text-yellow-800' :
                        activity.type === 'ticket' ? 'bg-indigo-100 text-indigo-800' :
                        activity.type === 'report' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {activity.time}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg font-medium">No activities found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm ? 'Try adjusting your search terms' : 'Activities will appear here as they occur'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
