'use client';

import { useState } from 'react';

export default function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');

  const attendees = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      event: 'Tech Conference 2024',
      status: 'confirmed',
      registrationDate: '2024-09-01',
      ticketType: 'VIP',
      paymentStatus: 'paid',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      event: 'Tech Conference 2024',
      status: 'confirmed',
      registrationDate: '2024-09-02',
      ticketType: 'Regular',
      paymentStatus: 'paid',
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      event: 'Wedding Ceremony',
      status: 'pending',
      registrationDate: '2024-09-03',
      ticketType: 'Plus One',
      paymentStatus: 'pending',
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      event: 'Music Festival',
      status: 'confirmed',
      registrationDate: '2024-09-01',
      ticketType: 'Early Bird',
      paymentStatus: 'paid',
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.w@email.com',
      event: 'Tech Conference 2024',
      status: 'cancelled',
      registrationDate: '2024-08-30',
      ticketType: 'Regular',
      paymentStatus: 'refunded',
    },
  ];

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEvent === 'all' || attendee.event === filterEvent;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendees</h1>
          <p className="text-gray-600 mt-1">Manage event registrations and attendee information.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
          Export Attendees
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Attendees</h3>
          <p className="text-3xl font-bold text-gray-900">2,847</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
          <p className="text-3xl font-bold text-green-600">2,156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
          <p className="text-3xl font-bold text-red-600">457</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search attendees..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="Tech Conference 2024">Tech Conference 2024</option>
              <option value="Wedding Ceremony">Wedding Ceremony</option>
              <option value="Music Festival">Music Festival</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                      <div className="text-sm text-gray-500">{attendee.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendee.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(attendee.status)}`}>
                      {attendee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendee.ticketType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(attendee.paymentStatus)}`}>
                      {attendee.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAttendees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No attendees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
