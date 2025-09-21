export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'registration',
      message: 'John Smith registered for Tech Conference 2024',
      time: '2 minutes ago',
      icon: '👤',
    },
    {
      id: 2,
      type: 'payment',
      message: 'Payment received: $299 for Wedding Ceremony',
      time: '5 minutes ago',
      icon: '💳',
    },
    {
      id: 3,
      type: 'ticket',
      message: 'VIP tickets sold out for Music Festival',
      time: '1 hour ago',
      icon: '🎫',
    },
    {
      id: 4,
      type: 'event',
      message: 'New event created: Product Launch Webinar',
      time: '3 hours ago',
      icon: '🎪',
    },
    {
      id: 5,
      type: 'reminder',
      message: 'Reminder sent to 150 attendees',
      time: '5 hours ago',
      icon: '🔔',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 flex items-center space-x-3">
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
