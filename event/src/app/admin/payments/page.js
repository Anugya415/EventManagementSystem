'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import Link from 'next/link';
import { api } from '../../lib/api';
import PaymentAdminActions from '../../components/PaymentAdminActions';
import PaymentDetailsModal from '../../components/PaymentDetailsModal';

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState(null);
  const { user, isAuthenticated, hasRole } = useAuth();
  const { showNotification } = useNotification();

  // Helper functions
  const handleSelectPayment = (paymentId) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === filteredTransactions.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredTransactions.map(p => p.id));
    }
  };

  const handleShowPaymentDetails = (payment) => {
    setSelectedPaymentForDetails(payment);
    setShowDetailsModal(true);
  };

  const handleRefreshPayments = async () => {
    setLoading(true);
    setError('');
    setSelectedPayments([]);

    try {
      let response;
      if (searchQuery.trim()) {
        response = await api.payments.search(searchQuery);
      } else {
        response = await api.payments.getAll();
      }

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

  // Fetch payments from backend
  useEffect(() => {
    handleRefreshPayments();
  }, [user, hasRole]);

  // Handle search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleRefreshPayments();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Loading payments...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            {hasRole('ADMIN') || hasRole('ORGANIZER')
              ? 'Manage payments, transactions, and refunds.'
              : 'Your payment history and transactions.'}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleRefreshPayments}
            disabled={loading}
            className="bg-gray-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50 text-sm"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 w-full">
        <div className="w-full">
          <input
            type="text"
            placeholder="Search payments by transaction ID, email, or event name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Admin Actions */}
      {(hasRole('ADMIN') || hasRole('ORGANIZER')) && (
        <div className="mb-6 w-full">
          <PaymentAdminActions
            payments={payments}
            selectedPayments={selectedPayments}
            onBulkStatusUpdate={handleRefreshPayments}
            onBulkRefund={handleRefreshPayments}
            onRefresh={handleRefreshPayments}
          />
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md w-full">
          ❌ {error}
        </div>
      )}

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toFixed(2)}</p>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">From {payments.length} transactions</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Completed Payments</h3>
          <p className="text-2xl lg:text-3xl font-bold text-green-600 mt-2">{stats.completedPayments}</p>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">
            {payments.length > 0 ? Math.round((stats.completedPayments / payments.length) * 100) : 0}% success rate
          </p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
          <p className="text-2xl lg:text-3xl font-bold text-yellow-600 mt-2">{stats.pendingPayments}</p>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">Awaiting processing</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Refunds</h3>
          <p className="text-2xl lg:text-3xl font-bold text-red-600 mt-2">₹{stats.refunds.toFixed(2)}</p>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">Total refunded</p>
        </div>
      </div>

      {/* Payment Methods Breakdown and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full">
        {/* Payment Methods Breakdown */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3 lg:space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-900 truncate">{method.name}</span>
                  <span className="text-xs lg:text-sm text-gray-500 flex-shrink-0">{method.count} transactions</span>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                  <span className="text-xs lg:text-sm text-gray-600">{method.percentage}%</span>
                  <div className="w-16 lg:w-24 bg-gray-200 rounded-full h-1.5 lg:h-2">
                    <div
                      className="bg-blue-600 h-1.5 lg:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden w-full" style={{ maxWidth: '100%' }}>
        <div className="overflow-x-auto w-full" style={{ maxWidth: '100%' }}>
          <table className="w-full" style={{ minWidth: '800px', maxWidth: 'none' }}>
            <thead className="bg-gray-50">
              <tr>
                {(hasRole('ADMIN') || hasRole('ORGANIZER')) && (
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === filteredTransactions.length && filteredTransactions.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Transaction
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Attendee
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Event
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Amount
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Method
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  {(hasRole('ADMIN') || hasRole('ORGANIZER')) && (
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={() => handleSelectPayment(payment.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                      <div className="text-xs lg:text-sm text-gray-500">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 truncate max-w-[120px]" title={payment.userEmail}>
                      {payment.userEmail}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]" title={payment.eventName}>
                        {payment.eventName}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 truncate max-w-[120px]" title={payment.ticketName}>
                        {payment.ticketName}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{payment.amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paymentMethod?.replace('_', ' ') || 'N/A'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col lg:flex-row gap-1 lg:gap-2">
                      <button
                        onClick={() => handleShowPaymentDetails(payment)}
                        className="text-blue-600 hover:text-blue-900 text-xs lg:text-sm"
                      >
                        View Details
                      </button>
                      {(hasRole('ADMIN') || hasRole('ORGANIZER')) && payment.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleShowPaymentDetails(payment)}
                          className="text-red-600 hover:text-red-900 text-xs lg:text-sm"
                        >
                          Refund
                        </button>
                      )}
                      {(hasRole('ADMIN') || hasRole('ORGANIZER')) && payment.status === 'PENDING' && (
                        <button
                          onClick={() => handleShowPaymentDetails(payment)}
                          className="text-green-600 hover:text-green-900 text-xs lg:text-sm"
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

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        payment={selectedPaymentForDetails}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPaymentForDetails(null);
        }}
        onStatusUpdate={handleRefreshPayments}
        onRefund={handleRefreshPayments}
      />
    </div>
  );
}
