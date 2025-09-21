'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../components/AuthContext';
import PermissionGuard, { usePermission } from '../../../../components/PermissionGuard';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const canEditEvents = usePermission(['ADMIN', 'ORGANIZER']);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'conference',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: '',
    price: '',
    currency: 'USD',
    category: '',
    tags: '',
    status: 'DRAFT'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [eventNotFound, setEventNotFound] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!canEditEvents) {
      setError('You do not have permission to edit events');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/events/${params.id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        if (response.ok) {
          const event = await response.json();

          // Convert backend data to form format
          const startDateTime = event.startDateTime ? new Date(event.startDateTime) : new Date();
          const endDateTime = event.endDateTime ? new Date(event.endDateTime) : new Date();

          setFormData({
            name: event.name || '',
            description: event.description || '',
            type: event.type?.toLowerCase() || 'conference',
            date: startDateTime.toISOString().split('T')[0],
            startTime: startDateTime.toTimeString().slice(0, 5),
            endTime: endDateTime.toTimeString().slice(0, 5),
            location: event.location || '',
            capacity: event.capacity?.toString() || '',
            price: event.price?.toString() || '',
            currency: event.currency || 'USD',
            category: event.category || '',
            tags: event.tags || '',
            status: event.status?.toLowerCase() || 'draft'
          });
        } else if (response.status === 404) {
          setEventNotFound(true);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to load event');
        }
      } catch (err) {
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id, isAuthenticated, canEditEvents, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      // Format the data for the backend
      const eventData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        startDateTime: `${formData.date}T${formData.startTime}:00`,
        endDateTime: `${formData.date}T${formData.endTime}:00`,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        type: formData.type.toUpperCase(),
        category: formData.category,
        tags: formData.tags,
        status: formData.status.toUpperCase()
      };

      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8080/api/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        setSuccess(true);
        // Redirect to events list after a short delay
        setTimeout(() => {
          router.push('/events');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update event');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (eventNotFound) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          Event not found.
        </div>
        <Link
          href="/events"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  if (!canEditEvents) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          You do not have permission to edit events.
        </div>
        <Link
          href="/events"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600 mt-1">Update your event details.</p>
        </div>
        <Link
          href="/events"
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back to Events
        </Link>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          ✅ Event updated successfully! Redirecting to events list...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                name="type"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="conference">Conference</option>
                <option value="wedding">Wedding</option>
                <option value="festival">Festival</option>
                <option value="webinar">Webinar</option>
                <option value="workshop">Workshop</option>
                <option value="concert">Concert</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your event..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Date and Time */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Location and Capacity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Capacity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location or 'Virtual'"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Maximum attendees"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Technology, Business"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Status and Additional Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Additional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., networking, technology, professional"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Link
            href="/events"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || success}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{saving ? 'Updating Event...' : success ? 'Event Updated!' : 'Update Event'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
