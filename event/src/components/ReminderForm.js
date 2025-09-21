'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReminderForm({ reminderId = null, userId = null, eventId = null, onSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'EMAIL',
    status: 'PENDING',
    userId: userId || '',
    eventId: eventId || '',
    scheduledTime: '',
    notes: ''
  });

  // Load users and events for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch users
        const usersResponse = await fetch('http://localhost:8080/api/users', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        // Fetch events
        const eventsResponse = await fetch('http://localhost:8080/api/events', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    fetchData();
  }, []);

  // Load reminder data if editing
  useEffect(() => {
    if (reminderId) {
      const fetchReminder = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:8080/api/reminders/${reminderId}`, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
          });

          if (response.ok) {
            const reminderData = await response.json();
            setFormData({
              title: reminderData.title || '',
              message: reminderData.message || '',
              type: reminderData.type || 'EMAIL',
              status: reminderData.status || 'PENDING',
              userId: reminderData.userId || '',
              eventId: reminderData.eventId || '',
              scheduledTime: reminderData.scheduledTime ? reminderData.scheduledTime.substring(0, 16) : '',
              notes: reminderData.notes || ''
            });
          } else {
            setError('Failed to load reminder data');
          }
        } catch (err) {
          setError('Network error');
        }
      };

      fetchReminder();
    }
  }, [reminderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = reminderId
        ? `http://localhost:8080/api/reminders/${reminderId}`
        : 'http://localhost:8080/api/reminders';

      const method = reminderId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/reminders');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save reminder');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {reminderId ? 'Edit Reminder' : 'Create New Reminder'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {reminderId ? 'Update reminder details' : 'Schedule a new notification for users'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient User *
              </label>
              <select
                id="userId"
                name="userId"
                required
                value={formData.userId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                Related Event (Optional)
              </label>
              <select
                id="eventId"
                name="eventId"
                value={formData.eventId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an event (optional)</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Event Reminder, Payment Due"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the reminder message content"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Notification Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="PUSH_NOTIFICATION">Push Notification</option>
                <option value="IN_APP">In-App Notification</option>
              </select>
            </div>

            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Time *
              </label>
              <input
                type="datetime-local"
                id="scheduledTime"
                name="scheduledTime"
                required
                value={formData.scheduledTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional notes or context"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (reminderId ? 'Update Reminder' : 'Create Reminder')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
