import Link from 'next/link';

export default function UpcomingEvents() {
  const events = [
    {
      id: 1,
      name: 'Tech Conference 2024',
      date: '2024-09-15',
      attendees: 450,
      totalCapacity: 500,
      status: 'active',
      type: 'Conference',
    },
    {
      id: 2,
      name: 'Wedding Ceremony',
      date: '2024-09-20',
      attendees: 120,
      totalCapacity: 150,
      status: 'active',
      type: 'Wedding',
    },
    {
      id: 3,
      name: 'Music Festival',
      date: '2024-10-05',
      attendees: 1200,
      totalCapacity: 2000,
      status: 'active',
      type: 'Festival',
    },
    {
      id: 4,
      name: 'Product Launch Webinar',
      date: '2024-09-25',
      attendees: 89,
      totalCapacity: 100,
      status: 'draft',
      type: 'Webinar',
    },
  ];

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <Link
          href="/events"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all →
        </Link>
      </div>
      <div className="divide-y divide-gray-200">
        {events.map((event) => (
          <div key={event.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{event.name}</h4>
                <p className="text-sm text-gray-500">{event.type}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{new Date(event.date).toLocaleDateString()}</span>
              <span>{event.attendees}/{event.totalCapacity} attendees</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(event.attendees / event.totalCapacity) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
