'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import { api } from '../../lib/api';

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // Fetch user's events
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        // For now, fetch all events and filter by user
        // In a real app, you'd have an endpoint like /api/users/{id}/events
        const response = await api.events.getAll();

        if (response.ok) {
          const allEvents = await response.json();
          // For attendees, show events they might be interested in or registered for
          // For organizers, show events they created
          if (user?.roles?.includes('ORGANIZER') || user?.roles?.includes('ADMIN')) {
            // Show all events for organizers/admins
            setEvents(allEvents);
          } else {
            // For attendees, show a subset of active events
            setEvents(allEvents.filter(event => event.status === 'ACTIVE').slice(0, 5));
          }
        } else {
          setError('Failed to load your events');
        }
      } catch (err) {
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user]);

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view your events.</p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-600 mt-1">Loading your events...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600 mt-1">
            {user?.roles?.includes('ORGANIZER') || user?.roles?.includes('ADMIN') 
              ? 'Events you can manage' 
              : 'Events available for you'}
          </p>
        </div>
        {(user?.roles?.includes('ORGANIZER') || user?.roles?.includes('ADMIN')) && (
          <Link
            href="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Event
          </Link>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-3xl font-bold text-gray-900">{events.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Active Events</h3>
          <p className="text-3xl font-bold text-green-600">
            {events.filter(e => e.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
          <p className="text-3xl font-bold text-blue-600">
            {events.filter(e => new Date(e.startDateTime) > new Date()).length}
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="text-sm text-gray-500">{event.type}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📅</span>
                  {event.startDateTime ? new Date(event.startDateTime).toLocaleDateString() : 'TBD'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📍</span>
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">👥</span>
                  {event.capacity} capacity
                </div>
                {event.price && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">💰</span>
                    ₹{event.price}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => alert(`Event Details:\nName: ${event.name}\nType: ${event.type}\nLocation: ${event.location}\nDate: ${event.startDateTime}\nCapacity: ${event.capacity}\nStatus: ${event.status}\nOrganizer: ${event.organizerName}`)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
                >
                  View Details
                </button>
                {(user?.roles?.includes('ORGANIZER') || user?.roles?.includes('ADMIN')) && (
                  <Link
                    href={`/events/edit/${event.id}`}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎪</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600 mb-6">
            {user?.roles?.includes('ORGANIZER') || user?.roles?.includes('ADMIN') 
              ? "You haven't created any events yet." 
              : "No events are currently available."}
          </p>
          {(user?.roles?.includes('ORGANIZER') || user?.roles?.includes('ADMIN')) && (
            <Link
              href="/events/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Your First Event
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
