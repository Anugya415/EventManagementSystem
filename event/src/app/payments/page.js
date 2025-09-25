'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated, hasRole } = useAuth();
  const { showNotification } = useNotification();

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.payments.getAll();

        if (response.ok) {
          const paymentsData = await response.json();
          // Filter payments based on user role
          if (hasRole('ADMIN') || hasRole('ORGANIZER')) {
            // Admins and Organizers see all payments
            setPayments(paymentsData);
          } else {
            // Attendees see only their payments
            setPayments(paymentsData.filter(payment => payment.userEmail === user?.email));
          }
        } else {
          setError('Failed to load payments');
        }
      } catch (err) {
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, hasRole]);

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view payments.</p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Filter payments based on status
  const filteredTransactions = payments.filter((payment) => {
    return filterStatus === 'all' || payment.status?.toLowerCase() === filterStatus;
  });

  // Calculate stats from real data
  const stats = {
    totalRevenue: payments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
    completedPayments: payments.filter(p => p.status === 'COMPLETED').length,
    pendingPayments: payments.filter(p => p.status === 'PENDING').length,
    refunds: payments.filter(p => p.status === 'REFUNDED').reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  // Calculate payment methods breakdown
  const paymentMethodsMap = payments.reduce((acc, payment) => {
    const method = payment.paymentMethod || 'Unknown';
    if (!acc[method]) {
      acc[method] = 0;
    }
    acc[method]++;
    return acc;
  }, {});

  const totalPayments = payments.length;
  const paymentMethods = Object.entries(paymentMethodsMap).map(([method, count]) => ({
    name: method.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    count,
    percentage: totalPayments > 0 ? Math.round((count / totalPayments) * 100) : 0
  }));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
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
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Loading payments...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">
            {hasRole('ADMIN') || hasRole('ORGANIZER') 
              ? 'Manage payments, transactions, and refunds.' 
              : 'Your payment history and transactions.'}
          </p>
        </div>
        {(hasRole('ADMIN') || hasRole('ORGANIZER')) && (
          <div className="flex gap-2">
            <button 
              onClick={() => alert('Payment processing feature would be implemented here')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Process Payment
            </button>
            <button 
              onClick={() => alert('Export feature would be implemented here')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium"
            >
              Export Transactions
            </button>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
      )}

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">From {payments.length} transactions</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Completed Payments</h3>
          <p className="text-3xl font-bold text-green-600">{stats.completedPayments}</p>
          <p className="text-sm text-gray-600 mt-1">
            {payments.length > 0 ? Math.round((stats.completedPayments / payments.length) * 100) : 0}% success rate
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingPayments}</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting processing</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Refunds</h3>
          <p className="text-3xl font-bold text-red-600">₹{stats.refunds.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Total refunded</p>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">{method.name}</span>
                <span className="text-sm text-gray-500">{method.count} transactions</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{method.percentage}%</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                      <div className="text-sm text-gray-500">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.userEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.eventName}</div>
                      <div className="text-sm text-gray-500">{payment.ticketName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{payment.amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paymentMethod?.replace('_', ' ') || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => alert(`Payment Details:\nTransaction ID: ${payment.transactionId}\nAmount: ₹${payment.amount}\nStatus: ${payment.status}\nMethod: ${payment.paymentMethod}\nDate: ${payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}\nUser: ${payment.userEmail}\nEvent: ${payment.eventName}\nTicket: ${payment.ticketName}\nQuantity: ${payment.quantity}\nNotes: ${payment.notes || 'None'}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {(hasRole('ADMIN') || hasRole('ORGANIZER')) && payment.status === 'COMPLETED' && (
                        <button
                          onClick={() => alert('Refund initiated for transaction ' + payment.transactionId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Refund
                        </button>
                      )}
                      {(hasRole('ADMIN') || hasRole('ORGANIZER')) && payment.status === 'PENDING' && (
                        <button
                          onClick={() => alert('Payment processed successfully for transaction ' + payment.transactionId)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Process
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Found</h3>
          <p className="text-gray-600">
            {filterStatus === 'all' 
              ? 'No payment transactions found.' 
              : `No ${filterStatus} transactions found.`}
          </p>
        </div>
      )}
    </div>
  );
}
