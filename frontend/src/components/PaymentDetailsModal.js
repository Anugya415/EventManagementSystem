'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { api } from '../lib/api';

export default function PaymentDetailsModal({
  payment,
  isOpen,
  onClose,
  onStatusUpdate,
  onRefund
}) {
  const [loading, setLoading] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [relatedPayments, setRelatedPayments] = useState([]);
  const [copyingId, setCopyingId] = useState(false);
  const { hasRole, user } = useAuth();
  const { showNotification } = useNotification();

  // Fetch related payments when modal opens
  useEffect(() => {
    if (isOpen && payment) {
      fetchRelatedPayments();
    }
  }, [isOpen, payment]);

  const fetchRelatedPayments = async () => {
    if (!payment) return;

    try {
      // Fetch payments by user to show related transactions
      const response = await api.payments.getAll();
      if (response.ok) {
        const allPayments = await response.json();
        const related = allPayments.filter(p =>
          p.userEmail === payment.userEmail &&
          p.id !== payment.id &&
          p.status === 'COMPLETED'
        ).slice(0, 5); // Show last 5 related payments
        setRelatedPayments(related);
      }
    } catch (error) {
      console.error('Failed to fetch related payments:', error);
    }
  };

  if (!isOpen || !payment) return null;

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      const result = await api.payments.updateStatus(payment.id, newStatus);
      if (result.ok) {
        showNotification(`Payment status updated to ${newStatus}`, 'success');
        onStatusUpdate && onStatusUpdate();
        onClose();
      } else {
        showNotification('Failed to update payment status', 'error');
      }
    } catch (error) {
      showNotification('Error updating payment status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!refundReason.trim()) {
      showNotification('Please provide a refund reason', 'warning');
      return;
    }

    setLoading(true);
    try {
      const result = await api.payments.processRefund(payment.id, {
        reason: refundReason
      });

      if (result.ok) {
        const data = await result.json();
        showNotification('Payment refunded successfully', 'success');
        onRefund && onRefund();
        setShowRefundModal(false);
        onClose();
      } else {
        const errorData = await result.json();
        showNotification(errorData.message || 'Refund failed', 'error');
      }
    } catch (error) {
      showNotification('Error processing refund', 'error');
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyingId(true);
      showNotification('Transaction ID copied to clipboard!', 'success');
      setTimeout(() => setCopyingId(false), 2000);
    } catch (error) {
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit_card':
        return '💳';
      case 'debit_card':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'bank_transfer':
        return '🏦';
      case 'cash':
        return '💵';
      case 'crypto':
        return '₿';
      default:
        return '💰';
    }
  };

  const getPaymentMethodDescription = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit_card':
        return 'Credit Card';
      case 'debit_card':
        return 'Debit Card';
      case 'paypal':
        return 'PayPal';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash Payment';
      case 'crypto':
        return 'Cryptocurrency';
      default:
        return method || 'Unknown';
    }
  };

  const generateStatusTimeline = () => {
    const statusFlow = ['PENDING', 'COMPLETED', 'REFUNDED'];
    const currentIndex = statusFlow.indexOf(payment.status?.toUpperCase());

    return statusFlow.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      current: index === currentIndex,
      date: index === currentIndex ? payment.updatedAt || payment.createdAt : null
    }));
  };

  const downloadReceipt = () => {
    const receiptData = {
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency || 'INR',
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      customerEmail: payment.userEmail,
      eventName: payment.eventName,
      ticketName: payment.ticketName,
      quantity: payment.quantity || 1,
      date: formatDate(payment.createdAt),
      notes: payment.notes
    };

    const receiptText = `
PAYMENT RECEIPT
================
Transaction ID: ${receiptData.transactionId}
Amount: ${receiptData.currency} ${receiptData.amount?.toFixed(2)}
Status: ${receiptData.status}
Payment Method: ${getPaymentMethodDescription(receiptData.paymentMethod)}
Date: ${receiptData.date}

Customer: ${receiptData.customerEmail}
Event: ${receiptData.eventName}
Ticket: ${receiptData.ticketName}
Quantity: ${receiptData.quantity}

${receiptData.notes ? `Notes: ${receiptData.notes}` : ''}

Thank you for your purchase!
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${payment.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Receipt downloaded successfully!', 'success');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'details', label: 'Details', icon: 'ℹ️' },
    { id: 'timeline', label: 'Timeline', icon: '⏱️' },
    { id: 'related', label: 'Related', icon: '🔗' }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getPaymentMethodIcon(payment.paymentMethod)}</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600 font-mono">{payment.transactionId}</span>
                    <button
                      onClick={() => copyToClipboard(payment.transactionId)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Copy Transaction ID"
                    >
                      {copyingId ? '✅' : '📋'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadReceipt}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm flex items-center space-x-1"
                >
                  <span>📄</span>
                  <span>Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-1 hover:bg-gray-100 rounded"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(payment.status)}`}>
                  {payment.status || 'Unknown'}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{payment.amount?.toFixed(2) || '0.00'}
                </span>
                <span className="text-sm text-gray-600">
                  {getPaymentMethodDescription(payment.paymentMethod)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {formatDateShort(payment.createdAt)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4 border-b border-gray-200">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border">
                    <div className="text-2xl mb-2">{getPaymentMethodIcon(payment.paymentMethod)}</div>
                    <div className="text-sm font-medium text-gray-600">Payment Method</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {getPaymentMethodDescription(payment.paymentMethod)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border">
                    <div className="text-2xl mb-2">🎫</div>
                    <div className="text-sm font-medium text-gray-600">Ticket Details</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {payment.ticketName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Qty: {payment.quantity || 1}</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="text-sm font-medium text-gray-600">Event</div>
                    <div className="text-lg font-semibold text-gray-900 truncate">
                      {payment.eventName || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="mr-2">👤</span>
                      Customer Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Email:</span>
                        <span className="text-sm text-gray-900">{payment.userEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Customer ID:</span>
                        <span className="text-sm text-gray-900">{payment.userId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="mr-2">💰</span>
                      Payment Summary
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Subtotal:</span>
                        <span className="text-sm text-gray-900">₹{payment.amount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Quantity:</span>
                        <span className="text-sm text-gray-900">{payment.quantity || 1}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-bold text-gray-900">Total:</span>
                        <span className="text-sm font-bold text-gray-900">₹{payment.amount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Detailed Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Transaction Information</h3>
                    <div className="bg-white border rounded-lg divide-y">
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm">{payment.transactionId}</span>
                      </div>
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Amount:</span>
                        <span className="font-semibold">₹{payment.amount?.toFixed(2)}</span>
                      </div>
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Currency:</span>
                        <span>{payment.currency || 'INR'}</span>
                      </div>
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Payment Method:</span>
                        <span className="flex items-center space-x-1">
                          <span>{getPaymentMethodIcon(payment.paymentMethod)}</span>
                          <span>{getPaymentMethodDescription(payment.paymentMethod)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Event & Ticket Details</h3>
                    <div className="bg-white border rounded-lg divide-y">
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Event:</span>
                        <span className="text-right">{payment.eventName || 'N/A'}</span>
                      </div>
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Ticket Type:</span>
                        <span>{payment.ticketName || 'N/A'}</span>
                      </div>
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Quantity:</span>
                        <span>{payment.quantity || 1}</span>
                      </div>
                      <div className="p-4 flex justify-between">
                        <span className="font-medium text-gray-600">Customer:</span>
                        <span className="text-right">{payment.userEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {payment.notes && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-gray-800">{payment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Timeline</h3>

                {/* Status Timeline */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    {generateStatusTimeline().map((item, index) => (
                      <div key={item.status} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          item.completed
                            ? 'bg-green-500 text-white'
                            : item.current
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {item.completed ? '✓' : item.current ? '●' : '○'}
                        </div>
                        <div className="ml-2">
                          <div className={`text-sm font-medium ${item.current ? 'text-blue-600' : item.completed ? 'text-green-600' : 'text-gray-500'}`}>
                            {item.status}
                          </div>
                          {item.date && (
                            <div className="text-xs text-gray-500">{formatDateShort(item.date)}</div>
                          )}
                        </div>
                        {index < generateStatusTimeline().length - 1 && (
                          <div className={`w-16 h-0.5 mx-4 ${item.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timestamp Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Created</h4>
                    <p className="text-sm text-gray-600">{formatDate(payment.createdAt)}</p>
                  </div>
                  {payment.updatedAt && (
                    <div className="bg-white border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
                      <p className="text-sm text-gray-600">{formatDate(payment.updatedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'related' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Related Transactions</h3>
                <p className="text-sm text-gray-600">
                  Other transactions from {payment.userEmail}
                </p>

                {relatedPayments.length > 0 ? (
                  <div className="space-y-3">
                    {relatedPayments.map((relatedPayment) => (
                      <div key={relatedPayment.id} className="bg-white border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900">
                                {relatedPayment.transactionId}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(relatedPayment.status)}`}>
                                {relatedPayment.status}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                              <span>₹{relatedPayment.amount?.toFixed(2)}</span>
                              <span>{relatedPayment.eventName}</span>
                              <span>{formatDateShort(relatedPayment.createdAt)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              // Close current modal and open related payment modal
                              onClose();
                              setTimeout(() => {
                                // This would trigger opening the related payment modal
                                // You'd need to pass this up to the parent component
                              }, 100);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>No related transactions found</p>
                  </div>
                )}
              </div>
            )}

            {/* Admin Actions */}
            {(hasRole('ADMIN') || hasRole('ORGANIZER')) && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚙️</span>
                  Admin Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {payment.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate('COMPLETED')}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>✓</span>
                        <span>{loading ? 'Processing...' : 'Mark as Completed'}</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('FAILED')}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>✗</span>
                        <span>{loading ? 'Processing...' : 'Mark as Failed'}</span>
                      </button>
                    </>
                  )}

                  {payment.status === 'COMPLETED' && (
                    <button
                      onClick={() => setShowRefundModal(true)}
                      disabled={loading}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <span>↩️</span>
                      <span>{loading ? 'Refunding...' : 'Process Refund'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowStatusHistory(!showStatusHistory)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <span>📋</span>
                    <span>Status History</span>
                  </button>
                </div>

                {showStatusHistory && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Status Change History</h4>
                    <p className="text-sm text-gray-600">
                      Created: {formatDate(payment.createdAt)}
                      {payment.updatedAt && payment.updatedAt !== payment.createdAt && (
                        <span className="ml-4">Last Updated: {formatDate(payment.updatedAt)}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Refund</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Reason *
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter reason for refund..."
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ This will refund ₹{payment.amount?.toFixed(2)} to the customer. This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={loading || !refundReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Processing Refund...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
