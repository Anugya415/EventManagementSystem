'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import TicketForm from '../../components/TicketForm';
import { api } from '../../lib/api';

export default function TicketsPage() {
  const router = useRouter();
  const { isAuthenticated, hasRole } = useAuth();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);



  // Fetch tickets from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tickets
        const ticketsResponse = await api.tickets.getAll();

        if (ticketsResponse.ok) {
          const ticketsData = await ticketsResponse.json();
          setTickets(ticketsData);
        }

        // Fetch events for reference
        const eventsResponse = await api.events.getAll();

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData);
        }
      } catch (err) {
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to access ticket management.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Check permissions (Organizers and Admins can manage tickets)
  if (!hasRole('ADMIN') && !hasRole('ORGANIZER')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don&apos;t have permission to manage tickets.</p>
      </div>
    );
  }

  // Delete ticket function
  const handleDeleteTicket = async (ticketId, ticketName) => {
    if (!window.confirm(`Are you sure you want to delete "${ticketName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await api.tickets.delete(ticketId);

      if (response.ok) {
        // Remove ticket from local state
        setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
        showNotification('Ticket deleted successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(`Failed to delete ticket: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      showNotification('Network error. Please check if the backend server is running.', 'error');
    }
  };

  // Handle edit ticket
  const handleEditTicket = (ticketId) => {
    setEditingTicket(ticketId);
  };

  // Handle successful form submission
  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingTicket(null);
    // Refresh tickets list
    window.location.reload();
  };

  // Filter tickets based on search and status
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.eventName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SOLD_OUT':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'EXPIRED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Show form if creating or editing
  if (showCreateForm || editingTicket) {
    return (
      <TicketForm
        ticketId={editingTicket}
        onSuccess={handleFormSuccess}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
            <p className="text-gray-600 mt-1">Loading tickets...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-gray-600 mt-1">Manage ticket types and pricing for your events.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm lg:text-base"
          >
            Create Ticket
          </button>
          <button
            onClick={() => window.open('http://localhost:8080/api/reports/tickets?format=csv', '_blank')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium text-sm lg:text-base"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
          <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Active Tickets</h3>
          <p className="text-3xl font-bold text-green-600">
            {tickets.filter(t => t.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Sold Out</h3>
          <p className="text-3xl font-bold text-red-600">
            {tickets.filter(t => t.status === 'SOLD_OUT').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">
            ₹{tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantityAvailable), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table - Mobile Responsive */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Ticket
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Available
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{ticket.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">{ticket.eventName}</div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    ₹{ticket.price?.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {ticket.quantityAvailable}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => alert(`Ticket Details:\nName: ${ticket.name}\nEvent: ${ticket.eventName}\nPrice: ₹${ticket.price}\nAvailable: ${ticket.quantityAvailable}\nStatus: ${ticket.status}\nDescription: ${ticket.description}`)}
                        className="text-gray-600 hover:text-gray-900 text-xs px-2 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditTicket(ticket.id)}
                        className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket.id, ticket.name)}
                        className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{ticket.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{ticket.eventName}</p>
                  <p className="text-xs text-gray-400 mt-1 truncate">{ticket.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-medium text-gray-900">
                  ₹{ticket.price?.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  {ticket.quantityAvailable} available
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => alert(`Ticket Details:\nName: ${ticket.name}\nEvent: ${ticket.eventName}\nPrice: ₹${ticket.price}\nAvailable: ${ticket.quantityAvailable}\nStatus: ${ticket.status}\nDescription: ${ticket.description}`)}
                  className="flex-1 bg-gray-600 text-white text-xs px-3 py-2 rounded hover:bg-gray-700"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditTicket(ticket.id)}
                  className="flex-1 bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTicket(ticket.id, ticket.name)}
                  className="flex-1 bg-red-600 text-white text-xs px-3 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tickets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
