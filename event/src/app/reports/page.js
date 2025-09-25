'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import PermissionGuard, { usePermission } from '../../components/PermissionGuard';
import { api } from '../../lib/api';

export default function ReportsPage() {
  const { isAuthenticated } = useAuth();
  const canViewReports = usePermission(['ADMIN', 'ORGANIZER']);

  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [ticketsData, setTicketsData] = useState([]);
  const [eventDetailsData, setEventDetailsData] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [availableEvents, setAvailableEvents] = useState([]);
  const [exportFormat, setExportFormat] = useState('json');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && canViewReports) {
      loadSummaryData();
      loadAvailableEvents();
    }
  }, [isAuthenticated, canViewReports]);

  const loadAvailableEvents = async () => {
    try {
      const response = await api.events.getAll();
      if (response.ok) {
        const events = await response.json();
        setAvailableEvents(events);
      }
    } catch (err) {
      console.error('Failed to load available events');
    }
  };

  const loadSummaryData = async () => {
    try {
      const response = await api.reports.getSummaryReport();
      if (response.ok) {
        const data = await response.json();
        setSummaryData(data);
      }
    } catch (err) {
      setError('Failed to load summary data');
    }
  };

  const loadEventsReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.reports.getEventsReport(exportFormat);
      if (response.ok) {
        const data = await response.json();
        setEventsData(data);
      } else {
        setError('Failed to load events report');
      }
    } catch (err) {
      setError('Failed to load events report');
    } finally {
      setLoading(false);
    }
  };

  const loadUsersReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.reports.getUsersReport(exportFormat);
      if (response.ok) {
        const data = await response.json();
        setUsersData(data);
      } else {
        setError('Failed to load users report');
      }
    } catch (err) {
      setError('Failed to load users report');
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentsReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.reports.getPaymentsReport(
        exportFormat,
        dateRange.startDate || null,
        dateRange.endDate || null
      );
      if (response.ok) {
        const data = await response.json();
        setPaymentsData(data);
      } else {
        setError('Failed to load payments report');
      }
    } catch (err) {
      setError('Failed to load payments report');
    } finally {
      setLoading(false);
    }
  };

  const loadTicketsReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.reports.getTicketsReport(exportFormat);
      if (response.ok) {
        const data = await response.json();
        setTicketsData(data);
      } else {
        setError('Failed to load tickets report');
      }
    } catch (err) {
      setError('Failed to load tickets report');
    } finally {
      setLoading(false);
    }
  };

  const loadEventDetailsReport = async () => {
    if (!selectedEventId) return;

    setLoading(true);
    setError('');
    try {
      const response = await api.reports.getEventDetailsReport(selectedEventId);
      if (response.ok) {
        const data = await response.json();
        setEventDetailsData(data);
      } else {
        setError('Failed to load event details report');
      }
    } catch (err) {
      setError('Failed to load event details report');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'summary', name: 'Summary', icon: '📊' },
    { id: 'events', name: 'Events', icon: '🎪' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'tickets', name: 'Tickets', icon: '🎫' },
    { id: 'details', name: 'Event Details', icon: '📋' },
  ];

  if (!canViewReports) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          You do not have permission to view reports.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive reporting and data export</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryData && (
              <>
                {/* Events Summary */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Events</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Events:</span>
                      <span className="font-semibold">{summaryData.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active:</span>
                      <span className="font-semibold text-green-600">{summaryData.activeEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold text-blue-600">{summaryData.completedEvents}</span>
                    </div>
                  </div>
                </div>

                {/* Users Summary */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Users</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Users:</span>
                      <span className="font-semibold">{summaryData.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admins:</span>
                      <span className="font-semibold text-red-600">{summaryData.adminUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Organizers:</span>
                      <span className="font-semibold text-blue-600">{summaryData.organizerUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendees:</span>
                      <span className="font-semibold text-green-600">{summaryData.attendeeUsers}</span>
                    </div>
                  </div>
                </div>

                {/* Payments Summary */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Payments:</span>
                      <span className="font-semibold">{summaryData.totalPayments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold text-green-600">{summaryData.completedPayments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-semibold text-green-600">₹{summaryData.totalRevenue?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Tickets Summary */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Tickets:</span>
                      <span className="font-semibold">{summaryData.totalTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active:</span>
                      <span className="font-semibold text-green-600">{summaryData.activeTickets}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {(activeTab === 'events' || activeTab === 'users' || activeTab === 'payments' || activeTab === 'tickets') && (
          <div className="space-y-6">
            {/* Controls */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range Filter</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'events' && 'Events Report'}
                  {activeTab === 'users' && 'Users Report'}
                  {activeTab === 'payments' && 'Payments Report'}
                  {activeTab === 'tickets' && 'Tickets Report'}
                </h3>
                <button
                  onClick={() => {
                    if (activeTab === 'events') loadEventsReport();
                    if (activeTab === 'users') loadUsersReport();
                    if (activeTab === 'payments') loadPaymentsReport();
                    if (activeTab === 'tickets') loadTicketsReport();
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load Report'}
                </button>
              </div>

              <div className="overflow-x-auto">
                {activeTab === 'events' && eventsData.length > 0 && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {eventsData.slice(0, 10).map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{event.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'users' && usersData.length > 0 && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usersData.slice(0, 10).map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'payments' && paymentsData.length > 0 && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentsData.slice(0, 10).map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMethod}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.eventName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'tickets' && ticketsData.length > 0 && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ticketsData.slice(0, 10).map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{ticket.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.quantityAvailable}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose an event...</option>
                    {availableEvents.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name} ({event.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={loadEventDetailsReport}
                    disabled={loading || !selectedEventId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Load Details'}
                  </button>
                </div>
              </div>

              {eventDetailsData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-semibold text-gray-900">Event Info</h4>
                      <p className="text-sm text-gray-600 mt-2">{eventDetailsData.event?.name}</p>
                      <p className="text-sm text-gray-600">Tickets: {eventDetailsData.totalTickets}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-semibold text-gray-900">Payments</h4>
                      <p className="text-sm text-gray-600">Count: {eventDetailsData.totalPayments}</p>
                      <p className="text-sm text-gray-600">Revenue: ₹{eventDetailsData.totalRevenue?.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-semibold text-gray-900">Tickets</h4>
                      <p className="text-sm text-gray-600">Total: {eventDetailsData.totalTickets}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
