'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import { api } from '../../lib/api';

export default function ManageRoleRequestsPage() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole } = useAuth();
  const { showNotification } = useNotification();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState(''); // 'approve' or 'reject'
  const [adminNotes, setAdminNotes] = useState('');
  const [processingRequest, setProcessingRequest] = useState(null);

  // Check authentication and permissions
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!hasRole('ADMIN')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You need administrator privileges to access this page.</p>
      </div>
    );
  }

  // Fetch role requests
  useEffect(() => {
    fetchRoleRequests();
  }, []);

  const fetchRoleRequests = async () => {
    try {
      const response = await api.roleRequests.getAll();
      if (response.ok) {
        const requestsData = await response.json();
        setRequests(requestsData);
      } else {
        showNotification('Failed to load role requests', 'error');
      }
    } catch (error) {
      showNotification('Network error. Please check if the backend server is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const handleReviewRequest = (request, action) => {
    setSelectedRequest(request);
    setReviewAction(action);
    setAdminNotes('');
    setShowReviewModal(true);
  };

  const handleConfirmReview = async () => {
    if (!selectedRequest) return;

    setProcessingRequest(selectedRequest.id);

    try {
      const reviewData = {
        adminId: user.id,
        adminNotes: adminNotes.trim()
      };

      const response = reviewAction === 'approve'
        ? await api.roleRequests.approve(selectedRequest.id, reviewData)
        : await api.roleRequests.reject(selectedRequest.id, reviewData);

      if (response.ok) {
        const result = await response.json();
        showNotification(
          `Role request ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`,
          'success'
        );
        setShowReviewModal(false);
        setSelectedRequest(null);
        fetchRoleRequests(); // Refresh the list
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to process request', 'error');
      }
    } catch (error) {
      showNotification('Failed to process request. Please try again.', 'error');
    } finally {
      setProcessingRequest(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return '⏳';
      case 'APPROVED':
        return '✅';
      case 'REJECTED':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStats = () => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'PENDING').length;
    const approved = requests.filter(r => r.status === 'APPROVED').length;
    const rejected = requests.filter(r => r.status === 'REJECTED').length;

    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Role Requests</h1>
            <p className="text-gray-600 mt-1">Loading role requests...</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading role requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manage Role Requests</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Review and manage user requests for role upgrades.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={fetchRoleRequests}
            disabled={loading}
            className="bg-gray-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50 text-sm"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-2xl lg:text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Requests ({stats.total})</option>
              <option value="PENDING">Pending ({stats.pending})</option>
              <option value="APPROVED">Approved ({stats.approved})</option>
              <option value="REJECTED">Rejected ({stats.rejected})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600">
              {filterStatus === 'all'
                ? 'There are no role requests yet.'
                : `No ${filterStatus.toLowerCase()} requests found.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getStatusIcon(request.status)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.userName || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-600">{request.userEmail}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs font-medium text-gray-500 mb-1">REQUESTED ROLE</div>
                        <div className="font-semibold text-gray-900">{request.requestedRole}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs font-medium text-gray-500 mb-1">CURRENT ROLE</div>
                        <div className="font-semibold text-gray-900">{request.currentRole}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-xs font-medium text-gray-500 mb-1">REQUESTED ON</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Reason for Request:</h4>
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-gray-800">
                        {request.reason}
                      </div>
                    </div>

                    {/* Admin Notes */}
                    {request.adminNotes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Notes:</h4>
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-gray-800">
                          {request.adminNotes}
                        </div>
                      </div>
                    )}

                    {/* Review Info */}
                    {request.reviewedAt && (
                      <div className="text-xs text-gray-500 mb-4">
                        Reviewed by {request.reviewedByName || 'Admin'} on {new Date(request.reviewedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex flex-col gap-2">
                    {request.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleReviewRequest(request, 'approve')}
                          disabled={processingRequest === request.id}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm flex items-center justify-center"
                        >
                          {processingRequest === request.id ? 'Processing...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => handleReviewRequest(request, 'reject')}
                          disabled={processingRequest === request.id}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 text-sm flex items-center justify-center"
                        >
                          {processingRequest === request.id ? 'Processing...' : '❌ Reject'}
                        </button>
                      </>
                    )}
                    {request.status !== 'PENDING' && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        {request.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {reviewAction === 'approve' ? 'Approve' : 'Reject'} Role Request
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{selectedRequest.userName}</h3>
                <p className="text-sm text-gray-600">{selectedRequest.userEmail}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Requesting: {selectedRequest.currentRole} → {selectedRequest.requestedRole}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={reviewAction === 'approve'
                    ? "Add any notes about the approval..."
                    : "Provide reason for rejection..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                />
              </div>

              <div className={`p-3 rounded-lg ${
                reviewAction === 'approve'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-sm">
                  {reviewAction === 'approve' ? (
                    <span className="text-green-800">
                      ✅ This will promote {selectedRequest.userName} to {selectedRequest.requestedRole} role.
                    </span>
                  ) : (
                    <span className="text-red-800">
                      ❌ This will reject the role request. The user will remain as {selectedRequest.currentRole}.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={processingRequest === selectedRequest.id}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReview}
                  disabled={processingRequest === selectedRequest.id}
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    reviewAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50`}
                >
                  {processingRequest === selectedRequest.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">{reviewAction === 'approve' ? '✅' : '❌'}</span>
                      {reviewAction === 'approve' ? 'Approve' : 'Reject'} Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
