'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import TicketPurchaseModal from '../../components/TicketPurchaseModal';
import { api } from '../../lib/api';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // Fetch user's tickets and payments
  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        // Fetch payments to see what tickets user has purchased
        const paymentsResponse = await api.payments.getAll();

        if (paymentsResponse.ok) {
          const allPayments = await paymentsResponse.json();
          // Filter payments for current user
          const userPayments = allPayments.filter(payment =>
            payment.userEmail === user?.email && payment.status === 'COMPLETED'
          );
          setPayments(userPayments);
        }

        // Fetch all tickets to show available ones
        const ticketsResponse = await api.tickets.getAll();

        if (ticketsResponse.ok) {
          const allTickets = await ticketsResponse.json();
          setTickets(allTickets.filter(ticket => ticket.status === 'ACTIVE'));
        } else {
          setError('Failed to load tickets');
        }
      } catch (err) {
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, [user]);

  // Handle ticket purchase
  const handlePurchaseTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowPurchaseModal(true);
  };

  // Handle successful purchase
  const handlePurchaseSuccess = (payment) => {
    // Add the new payment to the payments list
    setPayments(prev => [...prev, payment]);
    // Refresh the page to show updated data
    window.location.reload();
  };

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view your tickets.</p>
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
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
            <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
            <p className="text-gray-600 mt-1">Loading your tickets...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600 mt-1">Your purchased tickets and available options</p>
        </div>
        <Link
          href="/events"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Browse Events
        </Link>
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
          <h3 className="text-sm font-medium text-gray-500">Purchased Tickets</h3>
          <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
          <p className="text-3xl font-bold text-green-600">
            ₹{payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Available Tickets</h3>
          <p className="text-3xl font-bold text-blue-600">{tickets.length}</p>
        </div>
      </div>

      {/* My Purchased Tickets */}
      {payments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">My Purchased Tickets</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <div key={payment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{payment.ticketName}</h4>
                    <p className="text-sm text-gray-600">{payment.eventName}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Quantity: {payment.quantity}</span>
                      <span>Amount: ₹{payment.amount}</span>
                      <span>Date: {new Date(payment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <button
                      onClick={() => alert(`Ticket Details:\nEvent: ${payment.eventName}\nTicket: ${payment.ticketName}\nQuantity: ${payment.quantity}\nAmount: ₹${payment.amount}\nTransaction ID: ${payment.transactionId}\nDate: ${new Date(payment.createdAt).toLocaleDateString()}`)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Tickets */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Available Tickets</h3>
          <p className="text-sm text-gray-600">Tickets you can purchase for upcoming events</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {tickets.slice(0, 9).map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className="text-lg font-bold text-gray-900">₹{ticket.price}</span>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-1">{ticket.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{ticket.eventName}</p>
              <p className="text-xs text-gray-500 mb-3">{ticket.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>Available: {ticket.quantityAvailable}</span>
                <span>{ticket.currency}</span>
              </div>
              
              <button
                onClick={() => handlePurchaseTicket(ticket)}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Purchase Ticket
              </button>
            </div>
          ))}
        </div>
      </div>

      {payments.length === 0 && tickets.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Found</h3>
          <p className="text-gray-600 mb-6">You haven&apos;t purchased any tickets yet, and no tickets are currently available.</p>
          <Link
            href="/events"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Browse Events
          </Link>
        </div>
      )}

      {payments.length === 0 && tickets.length > 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Purchased Tickets</h3>
          <p className="text-gray-600">You haven&apos;t purchased any tickets yet. Check out the available tickets above!</p>
        </div>
      )}

      {/* Ticket Purchase Modal */}
      <TicketPurchaseModal
        ticket={selectedTicket}
        isOpen={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setSelectedTicket(null);
        }}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}
