'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TicketForm from '../../components/TicketForm';

export default function TicketsPage() {
  const router = useRouter();
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
        const token = localStorage.getItem('token');

        // Fetch tickets
        const ticketsResponse = await fetch('http://localhost:8080/api/tickets', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        if (ticketsResponse.ok) {
          const ticketsData = await ticketsResponse.json();
          setTickets(ticketsData);
        }

        // Fetch events for reference
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
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete ticket function
  const handleDeleteTicket = async (ticketId, ticketName) => {
    if (!window.confirm(`Are you sure you want to delete "${ticketName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        // Remove ticket from local state
        setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
        alert('Ticket deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete ticket: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Network error. Please check if the backend server is running.');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-gray-600 mt-1">Manage ticket types and pricing for your events.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Ticket
          </button>
          <button
            onClick={() => window.open('http://localhost:8080/api/reports/tickets?format=csv', '_blank')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            ${tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantityAvailable), 0).toFixed(2)}
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
              <option value="ACTIVE">Active</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ticket.name}</div>
                      <div className="text-sm text-gray-500">{ticket.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ticket.eventName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${ticket.price?.toFixed(2)} {ticket.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.quantityAvailable}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTicket(ticket.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">View</button>
                      <button
                        onClick={() => handleDeleteTicket(ticket.id, ticket.name)}
                        className="text-red-600 hover:text-red-900"
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
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tickets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
