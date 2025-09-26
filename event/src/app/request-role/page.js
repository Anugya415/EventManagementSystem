'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import { api } from '../../lib/api';

export default function RequestRolePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [existingRequests, setExistingRequests] = useState([]);
  const [formData, setFormData] = useState({
    requestedRole: 'ORGANIZER',
    reason: ''
  });

  // Fetch user's existing role requests
  useEffect(() => {
    if (user) {
      fetchExistingRequests();
    }
  }, [user]);

  const fetchExistingRequests = async () => {
    try {
      const response = await api.roleRequests.getUserRequests(user.id);
      if (response.ok) {
        const requests = await response.json();
        setExistingRequests(requests);
      }
    } catch (error) {
      console.error('Failed to fetch existing requests:', error);
    }
  };

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to request a role upgrade.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Check if user is already an organizer or admin
  if (user?.roles?.includes('ORGANIZER') || user?.roles?.includes('ADMIN')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Already an Organizer</h2>
        <p className="text-gray-600 mb-6">You already have organizer privileges.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const hasPendingRequest = existingRequests.some(req => req.status === 'PENDING');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason.trim()) {
      showNotification('Please provide a reason for your request', 'warning');
      return;
    }

    if (formData.reason.length < 50) {
      showNotification('Please provide a more detailed reason (at least 50 characters)', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await api.roleRequests.submit({
        userId: user.id,
        requestedRole: formData.requestedRole,
        reason: formData.reason.trim()
      });

      if (response.ok) {
        const data = await response.json();
        showNotification('Role request submitted successfully!', 'success');
        setFormData({ requestedRole: 'ORGANIZER', reason: '' });
        fetchExistingRequests(); // Refresh the requests list
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to submit request', 'error');
      }
    } catch (error) {
      showNotification('Failed to submit request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Request Organizer Role</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Request to become an event organizer and gain access to create and manage events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📝</span>
              Submit Role Request
            </h3>
          </div>

          <div className="p-6">
            {hasPendingRequest ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⏳</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Request Pending</h4>
                <p className="text-gray-600 mb-4">
                  You already have a pending request for organizer role. Please wait for admin approval.
                </p>
                <button
                  onClick={fetchExistingRequests}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Refresh Status
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Role Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Current Role:</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {user?.roles?.[0] || 'ATTENDEE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Requested Role:</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {formData.requestedRole}
                    </span>
                  </div>
                </div>

                {/* Reason Input */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to become an organizer? *
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={6}
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Please explain why you want to become an event organizer. Include your experience with events, what types of events you plan to organize, and how you will contribute to the community..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 50 characters. Be specific about your experience and plans.
                  </p>
                </div>

                {/* Benefits Section */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Organizer Benefits:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Create and manage your own events</li>
                    <li>• Sell tickets and track revenue</li>
                    <li>• Access to detailed analytics and reports</li>
                    <li>• Manage attendees and communications</li>
                    <li>• Professional event management tools</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || formData.reason.length < 50}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📤</span>
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Request History */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">📋</span>
                Request History
              </h3>
            </div>

            <div className="p-6">
              {existingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-600">No previous requests</p>
                  <p className="text-sm text-gray-500 mt-1">Submit your first role request above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {existingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getStatusIcon(request.status)}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Requested:</strong> {request.requestedRole} (from {request.currentRole})
                      </div>

                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-3">
                        {request.reason}
                      </div>

                      {request.adminNotes && (
                        <div className="text-sm bg-yellow-50 border border-yellow-200 p-3 rounded">
                          <strong className="text-yellow-800">Admin Notes:</strong>
                          <p className="text-yellow-700 mt-1">{request.adminNotes}</p>
                        </div>
                      )}

                      {request.reviewedAt && (
                        <div className="text-xs text-gray-500 mt-2">
                          Reviewed on {new Date(request.reviewedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">ℹ️</span>
                Guidelines
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Provide detailed information about your event planning experience</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Explain what types of events you plan to organize</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Be patient - requests are reviewed by administrators</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Don't submit multiple requests - wait for the current one to be reviewed</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Vague or incomplete requests will be rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
