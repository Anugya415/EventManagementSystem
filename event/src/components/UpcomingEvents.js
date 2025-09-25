'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendeeCounts, setAttendeeCounts] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch both events and payments to get real attendee counts
        const [eventsResponse, paymentsResponse] = await Promise.all([
          api.events.getAll(),
          api.payments.getAll()
        ]);

        if (eventsResponse.ok && paymentsResponse.ok) {
          const eventsData = await eventsResponse.json();
          const paymentsData = await paymentsResponse.json();

          // Calculate real attendee counts per event
          const attendeeCountsMap = {};
          paymentsData.forEach(payment => {
            if (payment.eventId) {
              attendeeCountsMap[payment.eventId] = (attendeeCountsMap[payment.eventId] || 0) + 1;
            }
          });

          // Transform the data to match the expected format and limit to 4 events
          const transformedEvents = eventsData
            .filter(event => event.status === 'ACTIVE') // Only show active events
            .slice(0, 4)
            .map(event => ({
              id: event.id,
              name: event.name,
              date: event.startDateTime,
              attendees: attendeeCountsMap[event.id] || 0,
              totalCapacity: event.capacity || 100
            }));

          setEvents(transformedEvents);
          setAttendeeCounts(attendeeCountsMap);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          <Link
            href="/events"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="p-6 text-center text-gray-500">
          Loading events...
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          <Link
            href="/events"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="p-6 text-center text-gray-500">
          No upcoming events found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <Link
          href="/events"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all →
        </Link>
      </div>
      <div className="divide-y divide-gray-200">
        {events.map((event) => (
          <div key={event.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{event.name}</h4>
                <p className="text-sm text-gray-500">Event #{event.id}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span suppressHydrationWarning>{formatDate(event.date)}</span>
              <span>{event.attendees}/{event.totalCapacity} attendees</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(event.attendees / event.totalCapacity) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
