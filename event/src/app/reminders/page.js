'use client';

import { useState } from 'react';

export default function RemindersPage() {
  const [activeTab, setActiveTab] = useState('scheduled');

  const scheduledReminders = [
    {
      id: 1,
      name: 'Event Reminder - 24 hours',
      event: 'Tech Conference 2024',
      type: 'email',
      scheduledFor: '2024-09-14 09:00',
      recipients: 450,
      status: 'scheduled',
      template: 'event_reminder_24h',
    },
    {
      id: 2,
      name: 'Payment Reminder',
      event: 'Wedding Ceremony',
      type: 'email',
      scheduledFor: '2024-09-15 10:00',
      recipients: 25,
      status: 'scheduled',
      template: 'payment_reminder',
    },
    {
      id: 3,
      name: 'Event Confirmation',
      event: 'Music Festival',
      type: 'email',
      scheduledFor: '2024-09-16 14:00',
      recipients: 800,
      status: 'scheduled',
      template: 'confirmation_email',
    },
  ];

  const sentReminders = [
    {
      id: 4,
      name: 'Welcome Email',
      event: 'Tech Conference 2024',
      type: 'email',
      sentAt: '2024-09-01 12:00',
      recipients: 520,
      opened: 380,
      clicked: 120,
      status: 'sent',
      template: 'welcome_email',
    },
    {
      id: 5,
      name: 'Event Reminder - 1 week',
      event: 'Wedding Ceremony',
      type: 'email',
      sentAt: '2024-09-08 09:00',
      recipients: 145,
      opened: 98,
      clicked: 45,
      status: 'sent',
      template: 'event_reminder_1w',
    },
  ];

  const templates = [
    {
      id: 'welcome_email',
      name: 'Welcome Email',
      description: 'Sent when attendee registers',
      type: 'automated',
    },
    {
      id: 'confirmation_email',
      name: 'Event Confirmation',
      description: 'Confirms registration details',
      type: 'automated',
    },
    {
      id: 'event_reminder_1w',
      name: '1 Week Reminder',
      description: 'Reminder 1 week before event',
      type: 'scheduled',
    },
    {
      id: 'event_reminder_24h',
      name: '24 Hour Reminder',
      description: 'Final reminder 24 hours before',
      type: 'scheduled',
    },
    {
      id: 'payment_reminder',
      name: 'Payment Reminder',
      description: 'For pending payments',
      type: 'manual',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-1">Manage automated and scheduled communications.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Create Reminder
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium">
            Manage Templates
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Sent</h3>
          <p className="text-3xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-green-600 mt-1">This month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Open Rate</h3>
          <p className="text-3xl font-bold text-blue-600">73%</p>
          <p className="text-sm text-green-600 mt-1">+5% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Click Rate</h3>
          <p className="text-3xl font-bold text-purple-600">28%</p>
          <p className="text-sm text-green-600 mt-1">+3% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
          <p className="text-3xl font-bold text-yellow-600">5</p>
          <p className="text-sm text-gray-600 mt-1">Upcoming reminders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'scheduled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Scheduled ({scheduledReminders.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent History ({sentReminders.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates ({templates.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Scheduled Reminders */}
          {activeTab === 'scheduled' && (
            <div className="space-y-4">
              {scheduledReminders.map((reminder) => (
                <div key={reminder.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{reminder.name}</h4>
                      <p className="text-sm text-gray-600">{reminder.event}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reminder.status)}`}>
                      {reminder.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-1 font-medium">{reminder.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Scheduled:</span>
                      <span className="ml-1 font-medium">{reminder.scheduledFor}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Recipients:</span>
                      <span className="ml-1 font-medium">{reminder.recipients}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Template:</span>
                      <span className="ml-1 font-medium">{reminder.template}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">Cancel</button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">Send Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sent History */}
          {activeTab === 'sent' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reminder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sentReminders.map((reminder) => (
                    <tr key={reminder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{reminder.name}</div>
                          <div className="text-sm text-gray-500">{reminder.template}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reminder.event}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reminder.sentAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reminder.recipients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-900">{reminder.opened} opened ({Math.round((reminder.opened/reminder.recipients)*100)}%)</div>
                          <div className="text-gray-500">{reminder.clicked} clicked ({Math.round((reminder.clicked/reminder.recipients)*100)}%)</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View Report</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Templates */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      template.type === 'automated' ? 'bg-blue-100 text-blue-800' :
                      template.type === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {template.type}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">Preview</button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">Use Template</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
