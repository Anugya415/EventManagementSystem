'use client';

import { useState } from 'react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  const analyticsData = {
    overview: {
      totalEvents: 12,
      totalAttendees: 2847,
      totalRevenue: '$186,500',
      averageRating: 4.6,
    },
    performance: [
      { event: 'Tech Conference 2024', attendees: 500, revenue: '$74,500', rating: 4.8 },
      { event: 'Wedding Ceremony', attendees: 120, revenue: '$18,000', rating: 4.9 },
      { event: 'Music Festival', attendees: 1000, revenue: '$94,000', rating: 4.5 },
    ],
    trends: {
      registrations: [120, 150, 180, 200, 250, 300, 350],
      revenue: [15000, 18000, 22000, 25000, 28000, 32000, 35000],
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track event performance and analyze success metrics.</p>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalEvents}</p>
            </div>
            <div className="text-3xl">🎪</div>
          </div>
          <p className="text-sm text-green-600 mt-2">+12% from last period</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Attendees</h3>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalAttendees.toLocaleString()}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
          <p className="text-sm text-green-600 mt-2">+8% from last period</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalRevenue}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
          <p className="text-sm text-green-600 mt-2">+15% from last period</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.averageRating}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
          <p className="text-sm text-green-600 mt-2">+0.2 from last period</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Trends</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.trends.registrations.map((count, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full mb-2"
                  style={{ height: `${(count / 400) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500">Day {index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Registrations over time</span>
            <span>+45% increase</span>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.trends.revenue.map((amount, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-green-500 rounded-t w-full mb-2"
                  style={{ height: `${(amount / 40000) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500">Day {index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Revenue over time</span>
            <span>+32% increase</span>
          </div>
        </div>
      </div>

      {/* Event Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Event Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.performance.map((event, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.event}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.attendees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{event.rating}</span>
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < Math.floor(event.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(event.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">📈</div>
              <div>
                <h4 className="font-medium text-gray-900">Growing Attendance</h4>
                <p className="text-sm text-gray-600">Event attendance has increased by 15% compared to last quarter.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">💰</div>
              <div>
                <h4 className="font-medium text-gray-900">Revenue Milestone</h4>
                <p className="text-sm text-gray-600">Total revenue has exceeded $180K for the first time.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-500 text-xl">⭐</div>
              <div>
                <h4 className="font-medium text-gray-900">High Satisfaction</h4>
                <p className="text-sm text-gray-600">Average event rating remains above 4.5 stars.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-purple-500 text-xl">🎯</div>
              <div>
                <h4 className="font-medium text-gray-900">Top Performer</h4>
                <p className="text-sm text-gray-600">Music Festival generated the highest revenue this period.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
