'use client';

import { useState } from 'react';

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  const transactions = [
    {
      id: 'TXN001',
      attendee: 'John Smith',
      event: 'Tech Conference 2024',
      amount: '$299.00',
      status: 'completed',
      method: 'Credit Card',
      date: '2024-09-10',
      ticketType: 'VIP',
    },
    {
      id: 'TXN002',
      attendee: 'Sarah Johnson',
      event: 'Tech Conference 2024',
      amount: '$149.00',
      status: 'completed',
      method: 'PayPal',
      date: '2024-09-09',
      ticketType: 'Regular',
    },
    {
      id: 'TXN003',
      attendee: 'Mike Davis',
      event: 'Wedding Ceremony',
      amount: '$150.00',
      status: 'pending',
      method: 'Credit Card',
      date: '2024-09-08',
      ticketType: 'Adult',
    },
    {
      id: 'TXN004',
      attendee: 'Emily Chen',
      event: 'Music Festival',
      amount: '$80.00',
      status: 'completed',
      method: 'Credit Card',
      date: '2024-09-07',
      ticketType: 'General',
    },
    {
      id: 'TXN005',
      attendee: 'David Wilson',
      event: 'Tech Conference 2024',
      amount: '$149.00',
      status: 'refunded',
      method: 'Credit Card',
      date: '2024-09-06',
      ticketType: 'Regular',
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    return filterStatus === 'all' || transaction.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const paymentMethods = [
    { name: 'Credit Card', count: 145, percentage: 65 },
    { name: 'PayPal', count: 52, percentage: 23 },
    { name: 'Bank Transfer', count: 25, percentage: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Manage payments, transactions, and refunds.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Process Payment
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium">
            Export Transactions
          </button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">$186,500</p>
          <p className="text-sm text-green-600 mt-1">+8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Completed Payments</h3>
          <p className="text-3xl font-bold text-green-600">198</p>
          <p className="text-sm text-gray-600 mt-1">95% success rate</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
          <p className="text-3xl font-bold text-yellow-600">12</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting processing</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Refunds</h3>
          <p className="text-3xl font-bold text-red-600">$2,450</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">{method.name}</span>
                <span className="text-sm text-gray-500">{method.count} transactions</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{method.percentage}%</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                      <div className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.attendee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.event}</div>
                      <div className="text-sm text-gray-500">{transaction.ticketType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      {transaction.status === 'completed' && (
                        <button className="text-red-600 hover:text-red-900">Refund</button>
                      )}
                      {transaction.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-900">Process</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
