'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Events', href: '/events', icon: '🎪' },
  { name: 'Attendees', href: '/attendees', icon: '👥' },
  { name: 'Tickets', href: '/tickets', icon: '🎫' },
  { name: 'Payments', href: '/payments', icon: '💳' },
  { name: 'Reminders', href: '/reminders', icon: '🔔' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">EventMan</h1>
        <p className="text-sm text-gray-400 mt-1">Event Management System</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <div className="px-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">ORGANIZER</h3>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">
              J
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-400">Event Organizer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
