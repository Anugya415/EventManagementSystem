'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { api } from '../lib/api';

export default function PaymentAdminActions({
  payments,
  selectedPayments,
  onBulkStatusUpdate,
  onBulkRefund,
  onRefresh
}) {
  const [loading, setLoading] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const { hasRole } = useAuth();
  const { showNotification } = useNotification();

  const handleExport = async () => {
    setLoading(true);
    try {
      const paymentsToExport = selectedPayments.length > 0 ? selectedPayments : payments;

      if (paymentsToExport.length === 0) {
        showNotification('No payments to export', 'error');
        return;
      }

      if (exportFormat === 'csv') {
        // Export as CSV
        const csvContent = generateCSV(paymentsToExport);
        downloadFile(csvContent, 'payments.csv', 'text/csv');
      } else {
        // Export as JSON (for now, could be enhanced to PDF)
        const jsonContent = JSON.stringify(paymentsToExport, null, 2);
        downloadFile(jsonContent, 'payments.json', 'application/json');
      }

      showNotification(`Successfully exported ${paymentsToExport.length} payments`, 'success');
      setShowExportModal(false);
    } catch (error) {
      showNotification('Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (paymentsData) => {
    const headers = [
      'Transaction ID',
      'User Email',
      'Event Name',
      'Ticket Name',
      'Amount',
      'Status',
      'Payment Method',
      'Created At',
      'Updated At',
      'Notes'
    ];

    const csvRows = [
      headers.join(','),
      ...paymentsData.map(payment => [
        payment.transactionId || '',
        payment.userEmail || '',
        payment.eventName || '',
        payment.ticketName || '',
        payment.amount || 0,
        payment.status || '',
        payment.paymentMethod || '',
        payment.createdAt || '',
        payment.updatedAt || '',
        payment.notes || ''
      ].map(field => `"${field}"`).join(','))
    ];

    return csvRows.join('\n');
  };

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBulkProcess = async (action) => {
    if (selectedPayments.length === 0) {
      showNotification('Please select payments to process', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (action === 'process') {
        // Process pending payments
        const pendingPayments = selectedPayments.filter(p => p.status === 'PENDING');
        if (pendingPayments.length === 0) {
          showNotification('No pending payments selected', 'warning');
          return;
        }

        const result = await api.payments.bulkUpdateStatus({
          paymentIds: pendingPayments.map(p => p.id),
          status: 'COMPLETED'
        });

        if (result.ok) {
          const data = await result.json();
          showNotification(`Successfully processed ${data.updatedCount} payments`, 'success');
          onBulkStatusUpdate && onBulkStatusUpdate();
        } else {
          showNotification('Bulk processing failed', 'error');
        }
      } else if (action === 'refund') {
        const completedPayments = selectedPayments.filter(p => p.status === 'COMPLETED');
        if (completedPayments.length === 0) {
          showNotification('No completed payments selected for refund', 'warning');
          return;
        }

        const result = await api.payments.bulkRefund({
          paymentIds: completedPayments.map(p => p.id),
          reason: 'Bulk refund initiated by admin'
        });

        if (result.ok) {
          const data = await result.json();
          showNotification(`Successfully refunded ${data.refundedCount} payments`, 'success');
          onBulkRefund && onBulkRefund();
        } else {
          showNotification('Bulk refund failed', 'error');
        }
      }

      onRefresh && onRefresh();
    } catch (error) {
      showNotification('Bulk operation failed', 'error');
    } finally {
      setLoading(false);
      setShowBulkActions(false);
    }
  };

  if (!hasRole('ADMIN') && !hasRole('ORGANIZER')) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border w-full">
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:items-center lg:justify-between w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0 flex-1">
          {selectedPayments.length > 0 && (
            <span className="text-sm text-gray-600 flex-shrink-0">
              {selectedPayments.length} payment{selectedPayments.length > 1 ? 's' : ''} selected
            </span>
          )}

          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 flex-shrink-0"
            disabled={selectedPayments.length === 0}
          >
            Bulk Actions ({selectedPayments.length})
          </button>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm font-medium flex-shrink-0"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Bulk Actions Dropdown */}
      {showBulkActions && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border">
          <h4 className="font-medium text-gray-900 mb-3">Bulk Operations</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleBulkProcess('process')}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm disabled:opacity-50 flex-1 sm:flex-none"
            >
              {loading ? 'Processing...' : 'Process Selected'}
            </button>
            <button
              onClick={() => handleBulkProcess('refund')}
              disabled={loading}
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm disabled:opacity-50 flex-1 sm:flex-none"
            >
              {loading ? 'Refunding...' : 'Refund Selected'}
            </button>
            <button
              onClick={() => setShowBulkActions(false)}
              className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 text-sm flex-1 sm:flex-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Payments</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="json">JSON (Data)</option>
              </select>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {selectedPayments.length > 0
                  ? `Export ${selectedPayments.length} selected payments`
                  : `Export all ${payments.length} payments`}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
