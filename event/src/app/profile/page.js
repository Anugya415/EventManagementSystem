'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import { api } from '../../lib/api';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    createdAt: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [roleRequests, setRoleRequests] = useState([]);
  const [showRoleRequestForm, setShowRoleRequestForm] = useState(false);
  const [roleRequestReason, setRoleRequestReason] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.users.getById(user.id);

        if (response.ok) {
          const userData = await response.json();
          setProfileData(userData);
          setEditForm({
            name: userData.name || '',
            phone: userData.phone || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          // Use data from auth context if API fails
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: '',
            role: user.roles?.[0] || 'ATTENDEE',
            createdAt: ''
          });
          setEditForm({
            name: user.name || '',
            phone: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        // Use data from auth context if API fails
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          role: user.roles?.[0] || 'ATTENDEE',
          createdAt: ''
        });
        setEditForm({
          name: user.name || '',
          phone: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  // Load user's role requests
  useEffect(() => {
    const loadRoleRequests = async () => {
      if (user && user.id) {
        try {
          const response = await api.roleRequests.getUserRequests(user.id);
          if (response.ok) {
            const requests = await response.json();
            setRoleRequests(requests);
          }
        } catch (error) {
          console.error('Failed to load role requests:', error);
        }
      }
    };

    if (user) {
      loadRoleRequests();
    }
  }, [user]);

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password change if provided
    if (editForm.newPassword) {
      if (editForm.newPassword !== editForm.confirmPassword) {
        showNotification('New passwords do not match', 'error');
        setLoading(false);
        return;
      }
      if (editForm.newPassword.length < 6) {
        showNotification('New password must be at least 6 characters', 'error');
        setLoading(false);
        return;
      }
      if (!editForm.currentPassword) {
        showNotification('Current password is required to change password', 'error');
        setLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        name: editForm.name,
        phone: editForm.phone,
        ...(editForm.newPassword && { password: editForm.newPassword })
      };

      const response = await api.users.update(user.id, updateData);

      if (response.ok) {
        const updatedUser = await response.json();
        setProfileData(prev => ({
          ...prev,
          name: updatedUser.name,
          phone: updatedUser.phone
        }));
        setEditForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setEditing(false);
        showNotification('Profile updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle role request submission
  const handleRoleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!roleRequestReason.trim()) {
      showNotification('Please provide a reason for your role request', 'error');
      return;
    }

    setSubmittingRequest(true);

    try {
      const requestData = {
        userId: user.id,
        requestedRole: 'ORGANIZER',
        reason: roleRequestReason.trim()
      };

      const response = await api.roleRequests.submit(requestData);

      if (response.ok) {
        const result = await response.json();
        setRoleRequests(prev => [result.request, ...prev]);
        setRoleRequestReason('');
        setShowRoleRequestForm(false);
        showNotification('Role request submitted successfully! An administrator will review it soon.', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to submit role request', 'error');
      }
    } catch (error) {
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Check if user has pending request for organizer role
  const hasPendingOrganizerRequest = roleRequests.some(
    request => request.requestedRole === 'ORGANIZER' && request.status === 'PENDING'
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ORGANIZER':
        return 'bg-blue-100 text-blue-800';
      case 'ATTENDEE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Full system access - can manage all users, events, and settings';
      case 'ORGANIZER':
        return 'Can create and manage events, tickets, and view analytics';
      case 'ATTENDEE':
        return 'Can view events, purchase tickets, and manage personal profile';
      default:
        return 'Standard user access';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and personal information</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            
            {!editing ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-gray-900 font-medium">{profileData.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <p className="text-gray-900">{profileData.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Role</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(profileData.role)}`}>
                      {profileData.role}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                    <p className="text-gray-900">
                      {profileData.createdAt 
                        ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not available'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91-9876543210"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Change Password (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm.currentPassword}
                        onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm.newPassword}
                        onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm.confirmPassword}
                        onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setEditForm(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{loading ? 'Updating...' : 'Update Profile'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          {/* Role Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Role</h3>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">
                  {profileData.role === 'ADMIN' ? '👑' :
                   profileData.role === 'ORGANIZER' ? '🎪' : '👤'}
                </span>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(profileData.role)}`}>
                {profileData.role}
              </span>
              <p className="text-sm text-gray-600 mt-3">
                {getRoleDescription(profileData.role)}
              </p>
            </div>
          </div>

          {/* Role Requests - Only show for attendees */}
          {profileData.role === 'ATTENDEE' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Requests</h3>

              {/* Show existing requests */}
              {roleRequests.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Your Requests</h4>
                  <div className="space-y-2">
                    {roleRequests.map((request) => (
                      <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">
                              Request for {request.requestedRole} role
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Submitted: {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                            {request.reason && (
                              <p className="text-xs text-gray-600 mt-1">
                                Reason: {request.reason}
                              </p>
                            )}
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        {request.status === 'REJECTED' && request.adminNotes && (
                          <p className="text-xs text-red-600 mt-2">
                            Admin notes: {request.adminNotes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request form or button */}
              {!hasPendingOrganizerRequest ? (
                <div>
                  {!showRoleRequestForm ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Interested in becoming an event organizer? Request the organizer role to create and manage events.
                      </p>
                      <button
                        onClick={() => setShowRoleRequestForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Request Organizer Role
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRoleRequestSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Why do you want to become an organizer? *
                        </label>
                        <textarea
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          placeholder="Please explain your interest in becoming an event organizer..."
                          value={roleRequestReason}
                          onChange={(e) => setRoleRequestReason(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowRoleRequestForm(false);
                            setRoleRequestReason('');
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingRequest}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {submittingRequest && (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          <span>{submittingRequest ? 'Submitting...' : 'Submit Request'}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">⏳</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You have a pending organizer role request. An administrator will review it soon.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/my-events"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="mr-3">🎪</span>
                  <span className="font-medium">My Events</span>
                </div>
              </Link>
              <Link
                href="/my-tickets"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="mr-3">🎫</span>
                  <span className="font-medium">My Tickets</span>
                </div>
              </Link>
              <Link
                href="/payments"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="mr-3">💳</span>
                  <span className="font-medium">Payment History</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Password</span>
                <span className="text-sm text-green-600">Protected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Verified</span>
                <span className="text-sm text-green-600">Yes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Two-Factor Auth</span>
                <span className="text-sm text-gray-400">Not enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
