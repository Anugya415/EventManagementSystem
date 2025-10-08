'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import { useNotification } from '../../../components/NotificationContext';
import { api } from '../../../lib/api';

export default function RoleRequestsPage() {
  const router = useRouter();
  const { isAuthenticated, hasRole, user } = useAuth();
  const { showNotification } = useNotification();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [processingRequest, setProcessingRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'approve' or 'reject'
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch role requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.roleRequests.getAll();

        if (response.ok) {
          const requestsData = await response.json();
          setRequests(requestsData);
        } else {
          setError('Failed to load role requests');
        }
      } catch (err) {
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to access role request management.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Check permissions (Only Admins can manage role requests)
  if (!hasRole('ADMIN')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don&apos;t have permission to manage role requests. Only administrators can access this page.</p>
      </div>
    );
  }

  // Handle approve/reject actions
  const handleAction = async (requestId, action) => {
    setSelectedRequest(requestId);
    setModalAction(action);
    setAdminNotes('');
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !modalAction) return;

    setProcessingRequest(selectedRequest);

    try {
      const actionData = {
        adminId: user.id,
        adminNotes: adminNotes.trim()
      };

      let response;
      if (modalAction === 'approve') {
        response = await api.roleRequests.approve(selectedRequest, actionData);
      } else {
        response = await api.roleRequests.reject(selectedRequest, actionData);
      }

      if (response.ok) {
        const result = await response.json();

        // Update the request in local state
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === selectedRequest
              ? { ...req, status: modalAction === 'approve' ? 'APPROVED' : 'REJECTED', adminNotes: adminNotes.trim(), reviewedAt: result.request.reviewedAt, reviewedByName: result.request.reviewedByName }
              : req
          )
        );

        showNotification(
          `Role request ${modalAction}d successfully!`,
          'success'
        );
        setShowModal(false);
        setSelectedRequest(null);
        setAdminNotes('');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || `Failed to ${modalAction} role request`, 'error');
      }
    } catch (err) {
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setProcessingRequest(null);
    }
  };

  // Filter requests based on status
  const filteredRequests = requests.filter((request) => {
    if (filter === 'all') return true;
    return request.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Requests</h1>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Requests</h1>
          <p className="text-gray-600 mt-1">Manage user role upgrade requests.</p>
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
          <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {requests.filter(r => r.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="text-3xl font-bold text-green-600">
            {requests.filter(r => r.status === 'APPROVED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">
            {requests.filter(r => r.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                      <div className="text-sm text-gray-500">{request.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {request.currentRole} → {request.requestedRole}
                      </div>
                      {request.reason && (
                        <div className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                          {request.reason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)} {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {request.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAction(request.id, 'approve')}
                            disabled={processingRequest === request.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(request.id, 'reject')}
                            disabled={processingRequest === request.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          const details = `
Request ID: ${request.id}
User: ${request.userName} (${request.userEmail})
Request: ${request.currentRole} → ${request.requestedRole}
Reason: ${request.reason || 'Not provided'}
Status: ${request.status}
Submitted: ${new Date(request.requestedAt).toLocaleString()}
${request.reviewedAt ? `Reviewed: ${new Date(request.reviewedAt).toLocaleString()}` : ''}
${request.reviewedByName ? `Reviewed by: ${request.reviewedByName}` : ''}
${request.adminNotes ? `Admin Notes: ${request.adminNotes}` : ''}
                          `.trim();
                          alert(details);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No role requests found matching your criteria.</p>
        </div>
      )}

      {/* Modal for approval/rejection */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modalAction === 'approve' ? 'Approve' : 'Reject'} Role Request
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder={`Add any notes for ${modalAction === 'approve' ? 'approval' : 'rejection'}...`}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setAdminNotes('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={processingRequest !== null}
                className={`px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                  modalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processingRequest && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>
                  {processingRequest ? 'Processing...' :
                   modalAction === 'approve' ? 'Approve' : 'Reject'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

