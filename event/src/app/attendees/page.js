'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import { api } from '../../lib/api';

export default function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated, hasRole } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    // Check authentication and permissions
    if (!isAuthenticated || (!hasRole('ADMIN') && !hasRole('ORGANIZER'))) {
      setLoading(false);
      return;
    }
    const fetchAttendeesData = async () => {
      try {
        // Fetch both payments and events data
        const [paymentsResponse, eventsResponse] = await Promise.all([
          api.payments.getAll(),
          api.events.getAll()
        ]);

        if (paymentsResponse.ok && eventsResponse.ok) {
          const payments = await paymentsResponse.json();
          const allEvents = await eventsResponse.json();

          // Transform payments data into attendees format
          const attendeesData = payments.map(payment => ({
            id: payment.id,
            name: payment.userName || 'Unknown User',
            email: payment.userEmail,
            event: payment.eventName,
            eventId: payment.eventId,
            status: payment.status === 'COMPLETED' ? 'confirmed' : 'pending',
            registrationDate: new Date(payment.createdAt).toISOString().split('T')[0],
            ticketType: payment.ticketName,
            paymentStatus: payment.status.toLowerCase(),
          }));

          setAttendees(attendeesData);

          // Store full events data for capacity calculations
          setEventsData(allEvents);

          // Extract unique event names for filter dropdown
          const uniqueEvents = [...new Set(attendeesData.map(a => a.event))];
          setEvents(uniqueEvents);
        } else {
          setError('Failed to load attendees data');
        }
      } catch (err) {
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendeesData();
  }, []);

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEvent === 'all' || attendee.event === filterEvent;
    return matchesSearch && matchesFilter;
  });

  // Calculate capacity-aware stats
  const getEventCapacity = (eventId) => {
    const event = eventsData.find(e => e.id === eventId);
    return event?.capacity || 0;
  };

  const getEventStats = () => {
    const eventStats = {};
    attendees.forEach(attendee => {
      if (!eventStats[attendee.eventId]) {
        eventStats[attendee.eventId] = {
          eventName: attendee.event,
          eventId: attendee.eventId,
          capacity: getEventCapacity(attendee.eventId),
          totalAttendees: 0,
          confirmed: 0,
          pending: 0,
          cancelled: 0,
        };
      }

      eventStats[attendee.eventId].totalAttendees++;

      if (attendee.status === 'confirmed') {
        eventStats[attendee.eventId].confirmed++;
      } else if (attendee.status === 'pending') {
        eventStats[attendee.eventId].pending++;
      } else {
        eventStats[attendee.eventId].cancelled++;
      }
    });
    return eventStats;
  };

  const eventStats = getEventStats();
  const overallStats = {
    totalEvents: Object.keys(eventStats).length,
    totalCapacity: Object.values(eventStats).reduce((sum, event) => sum + event.capacity, 0),
    totalAttendees: Object.values(eventStats).reduce((sum, event) => sum + event.totalAttendees, 0),
    confirmed: Object.values(eventStats).reduce((sum, event) => sum + event.confirmed, 0),
    pending: Object.values(eventStats).reduce((sum, event) => sum + event.pending, 0),
    cancelled: Object.values(eventStats).reduce((sum, event) => sum + event.cancelled, 0),
  };

  // Permission check
  if (!isAuthenticated || (!hasRole('ADMIN') && !hasRole('ORGANIZER'))) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don&apos;t have permission to view attendees.</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendees</h1>
            <p className="text-gray-600 mt-1">Loading attendees...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading attendees...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Attendees</h1>
            <p className="text-gray-600 mt-1">Manage event registrations and attendee information.</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendees</h1>
          <p className="text-gray-600 mt-1">Manage event registrations and attendee information.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
          Export Attendees
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-3xl font-bold text-gray-900">{overallStats.totalEvents.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Capacity</h3>
          <p className="text-3xl font-bold text-gray-900">{overallStats.totalCapacity.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Attendees</h3>
          <p className="text-3xl font-bold text-gray-900">{overallStats.totalAttendees.toLocaleString()}</p>
          <p className="text-sm text-gray-500">
            {overallStats.totalAttendees > 0 && overallStats.totalCapacity > 0 &&
              `${((overallStats.totalAttendees / overallStats.totalCapacity) * 100).toFixed(1)}% of capacity`
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
          <p className="text-3xl font-bold text-green-600">{overallStats.confirmed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{overallStats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
          <p className="text-3xl font-bold text-red-600">{overallStats.cancelled}</p>
        </div>
      </div>

      {/* Per-Event Capacity Overview */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Event Capacity Overview</h2>
          <p className="text-sm text-gray-600 mt-1">Attendance status for each event</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.values(eventStats).map((event) => {
                const capacityUtilization = event.capacity > 0 ? (event.totalAttendees / event.capacity) * 100 : 0;
                const isOverCapacity = capacityUtilization > 100;
                const isNearCapacity = capacityUtilization > 80;

                return (
                  <tr key={event.eventId} className={isOverCapacity ? 'bg-red-50' : isNearCapacity ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.eventName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.capacity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.totalAttendees.toLocaleString()}
                      {isOverCapacity && <span className="text-red-600 font-semibold ml-1">(Over!)</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {event.confirmed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      {event.pending.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isOverCapacity
                          ? 'bg-red-100 text-red-800'
                          : isNearCapacity
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {capacityUtilization.toFixed(1)}% full
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search attendees..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
            >
              <option value="all">All Events</option>
              {events.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                      <div className="text-sm text-gray-500">{attendee.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendee.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(attendee.status)}`}>
                      {attendee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendee.ticketType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(attendee.paymentStatus)}`}>
                      {attendee.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => alert(`Attendee Details:\nName: ${attendee.name}\nEmail: ${attendee.email}\nEvent: ${attendee.event}\nTicket: ${attendee.ticketType}\nStatus: ${attendee.status}\nPayment: ${attendee.paymentStatus}\nRegistered: ${attendee.registrationDate}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => alert('Edit functionality for attendee ' + attendee.name)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => alert('Registration cancelled for attendee ' + attendee.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAttendees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No attendees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
