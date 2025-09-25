'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import PermissionGuard, { ActionButton, usePermission } from '../../components/PermissionGuard';
import { api } from '../../lib/api';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const canModifyEvents = usePermission(['ADMIN', 'ORGANIZER']);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.events.getAll();

        if (response.ok) {
          const eventsData = await response.json();
          setEvents(eventsData);
        } else {
          setError('Failed to load events');
        }
      } catch (err) {
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Delete event function
  const handleDeleteEvent = async (eventId, eventName) => {
    if (!window.confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await api.events.delete(eventId);

      if (response.ok) {
        // Remove event from local state
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        showNotification('Event deleted successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(`Failed to delete event: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      showNotification('Network error. Please check if the backend server is running.', 'error');
    }
  };

  // Handle edit event
  const handleEditEvent = (eventId) => {
    window.location.href = `/events/edit/${eventId}`;
  };

  // Static demo events as fallback
  const demoEvents = [
    {
      id: 1,
      name: 'Tech Conference 2024',
      date: '2024-09-15',
      location: 'San Francisco, CA',
      status: 'active',
      attendees: 450,
      capacity: 500,
      revenue: '₹1,08,000',
      type: 'Conference',
    },
    {
      id: 2,
      name: 'Wedding Ceremony',
      date: '2024-09-20',
      location: 'New York, NY',
      status: 'active',
      attendees: 120,
      capacity: 150,
      revenue: '₹1,44,000',
      type: 'Wedding',
    },
    {
      id: 3,
      name: 'Music Festival',
      date: '2024-10-05',
      location: 'Austin, TX',
      status: 'active',
      attendees: 1200,
      capacity: 2000,
      revenue: '₹7,68,000',
      type: 'Festival',
    },
    {
      id: 4,
      name: 'Product Launch Webinar',
      date: '2024-09-25',
      location: 'Virtual',
      status: 'draft',
      attendees: 0,
      capacity: 100,
      revenue: '₹0',
      type: 'Webinar',
    },
    {
      id: 5,
      name: 'Business Workshop',
      date: '2024-08-30',
      location: 'Chicago, IL',
      status: 'completed',
      attendees: 75,
      capacity: 80,
      revenue: '₹30,000',
      type: 'Workshop',
    },
  ];

  // Use backend events if available, otherwise fallback to demo events
  const eventsToDisplay = events.length > 0 ? events : demoEvents;

  const filteredEvents = eventsToDisplay.filter((event) => {
    const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const eventStatus = event.status?.toLowerCase() || 'active';
    const matchesFilter = filterStatus === 'all' || eventStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600 mt-1">Loading events...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading events...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600 mt-1">Manage your events and track their performance.</p>
          </div>
          <Link
            href="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Event
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <p className="text-gray-600">Using demo data while backend is unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage your events and track their performance.</p>
        </div>
        <PermissionGuard
          roles={['ADMIN', 'ORGANIZER']}
          fallback={<div className="text-sm text-gray-500">You don&apos;t have permission to create events</div>}
        >
          <Link
            href="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Event
          </Link>
        </PermissionGuard>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => {
                // Handle different data structures (backend vs demo)
                const eventDate = event.startDateTime || event.date;
                const eventType = event.type || 'Event';
                const eventStatus = event.status?.toLowerCase() || 'active';
                const attendees = event.currentAttendees || event.attendees || 0;
                const capacity = event.capacity || 100;
                const revenue = event.price ? `₹${event.price}` : (event.revenue || '₹0');

                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.name}</div>
                        <div className="text-sm text-gray-500">{eventType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {eventDate ? new Date(eventDate).toLocaleDateString() : 'TBD'}
                      </div>
                      <div className="text-sm text-gray-500">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(eventStatus)}`}>
                        {eventStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendees}/{capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <ActionButton
                          roles={['ADMIN', 'ORGANIZER']}
                          onClick={() => handleEditEvent(event.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </ActionButton>
                        <button
                          onClick={() => alert(`Event Details:\nName: ${event.name}\nType: ${event.type}\nLocation: ${event.location}\nDate: ${event.startDateTime}\nCapacity: ${event.capacity}\nStatus: ${event.status}\nOrganizer: ${event.organizerName}`)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </button>
                        <ActionButton
                          roles={['ADMIN', 'ORGANIZER']}
                          onClick={() => handleDeleteEvent(event.id, event.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
