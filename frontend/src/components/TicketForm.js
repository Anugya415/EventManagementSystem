'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';
import { api } from '../lib/api';

export default function TicketForm({ ticketId = null, eventId = null, onSuccess }) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'INR',
    quantityAvailable: '',
    eventId: eventId || '',
    status: 'ACTIVE'
  });

  // Load events for dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.events.getAll();

        if (response.ok) {
          const eventsData = await response.json();
          setEvents(eventsData);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    };

    fetchEvents();
  }, []);

  // Load ticket data if editing
  useEffect(() => {
    if (ticketId) {
      const fetchTicket = async () => {
        try {
          const response = await api.tickets.getById(ticketId);

          if (response.ok) {
            const ticketData = await response.json();
            setFormData({
              name: ticketData.name || '',
              description: ticketData.description || '',
              price: ticketData.price || '',
              currency: ticketData.currency || 'INR',
              quantityAvailable: ticketData.quantityAvailable || '',
              eventId: ticketData.eventId || '',
              status: ticketData.status || 'ACTIVE'
            });
          } else {
            setError('Failed to load ticket data');
          }
        } catch (err) {
          setError('Network error');
        }
      };

      fetchTicket();
    }
  }, [ticketId]);

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
      const ticketData = {
        ...formData,
        price: parseFloat(formData.price),
        quantityAvailable: parseInt(formData.quantityAvailable)
      };

      let response;
      if (ticketId) {
        response = await api.tickets.update(ticketId, ticketData);
      } else {
        response = await api.tickets.create(ticketData);
      }

      if (response.ok) {
        showNotification(`Ticket ${ticketId ? 'updated' : 'created'} successfully!`, 'success');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/tickets');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save ticket');
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
            {ticketId ? 'Edit Ticket' : 'Create New Ticket'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {ticketId ? 'Update ticket information' : 'Add a new ticket type for an event'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
              Event *
            </label>
            <select
              id="eventId"
              name="eventId"
              required
              value={formData.eventId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} - {event.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., VIP, Regular, Student"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the ticket type and benefits"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                id="currency"
                name="currency"
                required
                value={formData.currency}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              >
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantityAvailable" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Available *
              </label>
              <input
                type="number"
                id="quantityAvailable"
                name="quantityAvailable"
                required
                min="1"
                value={formData.quantityAvailable}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
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
              {loading ? 'Saving...' : (ticketId ? 'Update Ticket' : 'Create Ticket')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
