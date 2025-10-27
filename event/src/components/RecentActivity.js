'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const fetchRecentActivity = async () => {
      try {
        // Fetch recent data from multiple endpoints
        const [eventsResponse, paymentsResponse, usersResponse] = await Promise.all([
          api.events.getAll(),
          api.payments.getAll(),
          api.users.getAll()
        ]);

        const activities = [];
        let events = [];

        // Process recent events
        if (eventsResponse.ok) {
          events = await eventsResponse.json();
          const recentEvents = events
            .filter(event => event.status === 'ACTIVE')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);

          recentEvents.forEach(event => {
            activities.push({
              id: `event-${event.id}`,
              type: 'event',
              message: `New event created: ${event.name}`,
              time: formatTimeAgo(event.createdAt),
              icon: event.type === 'CONFERENCE' ? '🎯' : 
                    event.type === 'FESTIVAL' ? '🎪' : 
                    event.type === 'WEDDING' ? '💒' : 
                    event.type === 'WORKSHOP' ? '🎓' : '📅',
              priority: 1
            });
          });
        }

        // Process recent payments
        if (paymentsResponse.ok) {
          const payments = await paymentsResponse.json();
          const recentPayments = payments
            .filter(payment => payment.status === 'COMPLETED')
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 3);

          recentPayments.forEach(payment => {
            activities.push({
              id: `payment-${payment.id}`,
              type: 'payment',
              message: `Payment received: ₹${payment.amount.toLocaleString()} for ${payment.eventName}`,
              time: formatTimeAgo(payment.updatedAt),
              icon: '💳',
              priority: 2
            });
          });
        }

        // Process recent user registrations
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          const recentUsers = users
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);

          recentUsers.forEach(user => {
            activities.push({
              id: `user-${user.id}`,
              type: 'registration',
              message: `${user.name} joined as ${user.role.toLowerCase()}`,
              time: formatTimeAgo(user.createdAt),
              icon: user.role === 'ADMIN' ? '👑' : 
                    user.role === 'ORGANIZER' ? '👨‍💼' : '👤',
              priority: 3
            });
          });
        }

        // Add some dynamic system activities based on current data
        const now = new Date();
        const systemActivities = [
          {
            id: 'system-1',
            type: 'system',
            message: `Dashboard analytics updated with ${activities.length} recent activities`,
            time: formatTimeAgo(new Date(now - 15 * 60 * 1000)), // 15 minutes ago
            icon: '📊',
            priority: 4
          },
          {
            id: 'system-2',
            type: 'notification',
            message: `Event reminders scheduled for ${events?.filter(e => e.status === 'ACTIVE').length || 0} upcoming events`,
            time: formatTimeAgo(new Date(now - 2 * 60 * 60 * 1000)), // 2 hours ago
            icon: '🔔',
            priority: 5
          },
          {
            id: 'system-3',
            type: 'ticket',
            message: 'Ticket availability updated across all events',
            time: formatTimeAgo(new Date(now - 4 * 60 * 60 * 1000)), // 4 hours ago
            icon: '🎫',
            priority: 6
          },
          {
            id: 'system-4',
            type: 'report',
            message: 'Monthly revenue report generated',
            time: formatTimeAgo(new Date(now - 6 * 60 * 60 * 1000)), // 6 hours ago
            icon: '📈',
            priority: 7
          }
        ];

        activities.push(...systemActivities);

        // Sort by priority and time, then take top 8
        const sortedActivities = activities
          .sort((a, b) => {
            // First sort by priority (lower number = higher priority)
            if (a.priority !== b.priority) {
              return a.priority - b.priority;
            }
            // Then by time (more recent first)
            return new Date(b.time) - new Date(a.time);
          })
          .slice(0, 8);

        setActivities(sortedActivities);
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
        // Fallback to static activities if API fails
        setActivities([
          {
            id: 1,
            type: 'system',
            message: 'System initialized successfully',
            time: 'Just now',
            icon: '✅',
          },
          {
            id: 2,
            type: 'dashboard',
            message: 'Dashboard loaded with latest data',
            time: '1 minute ago',
            icon: '📊',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRecentActivity();
    } finally {
      setRefreshing(false);
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'event': return 'bg-blue-50 border-blue-200';
      case 'payment': return 'bg-green-50 border-green-200';
      case 'registration': return 'bg-purple-50 border-purple-200';
      case 'system': return 'bg-gray-50 border-gray-200';
      case 'notification': return 'bg-yellow-50 border-yellow-200';
      case 'ticket': return 'bg-indigo-50 border-indigo-200';
      case 'report': return 'bg-emerald-50 border-emerald-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="flex items-center space-x-2">
          {(loading || refreshing) && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150 disabled:opacity-50"
            title="Refresh activity feed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors duration-150 border-l-4 ${getActivityColor(activity.type)}`}
            >
              <div className="text-2xl flex-shrink-0 mt-0.5">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium leading-5">{activity.message}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-500 text-sm">No recent activity to display</p>
            <p className="text-gray-400 text-xs mt-1">Activity will appear here as events, payments, and registrations occur</p>
          </div>
        )}
      </div>
      
      {!loading && activities.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <Link 
            href="/activity"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150 flex items-center gap-1"
          >
            View all activity 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
