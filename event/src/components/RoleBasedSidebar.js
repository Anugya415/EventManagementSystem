'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';

// Navigation items for different roles
const navigationItems = {
  ADMIN: [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Users', href: '/users', icon: '👥' },
    { name: 'Role Requests', href: '/admin/role-requests', icon: '📝' },
    { name: 'Events', href: '/events', icon: '🎪' },
    { name: 'Attendees', href: '/attendees', icon: '👤' },
    { name: 'Tickets', href: '/tickets', icon: '🎫' },
    { name: 'Payments', href: '/payments', icon: '💳' },
    { name: 'Reminders', href: '/reminders', icon: '🔔' },
    { name: 'Reports', href: '/reports', icon: '📋' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ],
  ORGANIZER: [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Events', href: '/events', icon: '🎪' },
    { name: 'Attendees', href: '/attendees', icon: '👤' },
    { name: 'Tickets', href: '/tickets', icon: '🎫' },
    { name: 'Payments', href: '/payments', icon: '💳' },
    { name: 'Reminders', href: '/reminders', icon: '🔔' },
    { name: 'Reports', href: '/reports', icon: '📋' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ],
  ATTENDEE: [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'My Events', href: '/my-events', icon: '🎪' },
    { name: 'My Tickets', href: '/my-tickets', icon: '🎫' },
    { name: 'Payments', href: '/payments', icon: '💳' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ],
  GUEST: [
    { name: 'Events', href: '/events', icon: '🎪' },
    { name: 'Login', href: '/login', icon: '🔐' },
    { name: 'Register', href: '/register', icon: '📝' },
  ],
};

export default function RoleBasedSidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  // Determine user role for navigation
  const getUserRole = () => {
    if (!isAuthenticated) return 'GUEST';
    if (user.roles?.includes('ADMIN')) return 'ADMIN';
    if (user.roles?.includes('ORGANIZER')) return 'ORGANIZER';
    if (user.roles?.includes('ATTENDEE')) return 'ATTENDEE';
    return 'GUEST';
  };

  const userRole = getUserRole();
  const navigation = navigationItems[userRole] || navigationItems.GUEST;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">Festify</h1>
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

      {/* User Profile Section */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <div className="px-4">
          {isAuthenticated ? (
            <>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">USER</h3>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-400 capitalize">{userRole.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-3">Not logged in</p>
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
