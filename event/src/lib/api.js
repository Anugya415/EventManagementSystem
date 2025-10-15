// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Specific API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (email, password) => apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    register: (userData) => apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    verifyEmail: (email, code, reason) => apiCall('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code, reason }),
    }),
    resendVerification: (email) => apiCall('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  },

  // Event endpoints
  events: {
    getAll: () => apiCall('/api/events'),
    getById: (id) => apiCall(`/api/events/${id}`),
    create: (eventData) => apiCall('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
    update: (id, eventData) => apiCall(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),
    delete: (id) => apiCall(`/api/events/${id}`, {
      method: 'DELETE',
    }),
  },

  // User endpoints
  users: {
    getAll: () => apiCall('/api/users'),
    getById: (id) => apiCall(`/api/users/${id}`),
    create: (userData) => apiCall('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    update: (id, userData) => apiCall(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
    delete: (id) => apiCall(`/api/users/${id}`, {
      method: 'DELETE',
    }),
  },

  // Ticket endpoints
  tickets: {
    getAll: () => apiCall('/api/tickets'),
    getById: (id) => apiCall(`/api/tickets/${id}`),
    create: (ticketData) => apiCall('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    }),
    update: (id, ticketData) => apiCall(`/api/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    }),
    delete: (id) => apiCall(`/api/tickets/${id}`, {
      method: 'DELETE',
    }),
  },

  // Payment endpoints
  payments: {
    getAll: () => apiCall('/api/payments'),
    getById: (id) => apiCall(`/api/payments/${id}`),
    create: (paymentData) => apiCall('/api/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
    update: (id, paymentData) => apiCall(`/api/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    }),
    delete: (id) => apiCall(`/api/payments/${id}`, {
      method: 'DELETE',
    }),
    updateStatus: (id, status) => apiCall(`/api/payments/${id}/status?status=${status}`, {
      method: 'PUT',
    }),
    processRefund: (id, refundData) => apiCall(`/api/payments/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify(refundData),
    }),
    bulkUpdateStatus: (bulkData) => apiCall('/api/payments/bulk/status', {
      method: 'POST',
      body: JSON.stringify(bulkData),
    }),
    bulkRefund: (bulkData) => apiCall('/api/payments/bulk/refund', {
      method: 'POST',
      body: JSON.stringify(bulkData),
    }),
    search: (query) => apiCall(`/api/payments/search?query=${encodeURIComponent(query)}`),
  },

  // Reminder endpoints
  reminders: {
    getAll: () => apiCall('/api/reminders'),
    getById: (id) => apiCall(`/api/reminders/${id}`),
    create: (reminderData) => apiCall('/api/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    }),
    update: (id, reminderData) => apiCall(`/api/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reminderData),
    }),
    delete: (id) => apiCall(`/api/reminders/${id}`, {
      method: 'DELETE',
    }),
  },

  // Role request endpoints
  roleRequests: {
    submit: (requestData) => apiCall('/api/role-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    }),
    getUserRequests: (userId) => apiCall(`/api/role-requests/user/${userId}`),
    getAll: () => apiCall('/api/role-requests'),
    getPending: () => apiCall('/api/role-requests/pending'),
    approve: (requestId, approvalData) => apiCall(`/api/role-requests/${requestId}/approve`, {
      method: 'PUT',
      body: JSON.stringify(approvalData),
    }),
    reject: (requestId, rejectionData) => apiCall(`/api/role-requests/${requestId}/reject`, {
      method: 'PUT',
      body: JSON.stringify(rejectionData),
    }),
    delete: (requestId) => apiCall(`/api/role-requests/${requestId}`, {
      method: 'DELETE',
    }),
    getById: (requestId) => apiCall(`/api/role-requests/${requestId}`),
  },

  // Reports endpoints
  reports: {
    getEventsReport: (format = 'json') => apiCall(`/api/reports/events?format=${format}`),
    getUsersReport: (format = 'json') => apiCall(`/api/reports/users?format=${format}`),
    getPaymentsReport: (format = 'json', startDate = null, endDate = null) => {
      let url = `/api/reports/payments?format=${format}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      return apiCall(url);
    },
    getTicketsReport: (format = 'json') => apiCall(`/api/reports/tickets?format=${format}`),
    getSummaryReport: () => apiCall('/api/reports/summary'),
    getEventDetailsReport: (eventId) => apiCall(`/api/reports/event/${eventId}/details`),
  },
};
