'use client';

import { useAuth } from './AuthContext';
import HomeLayout from './HomeLayout';
import DashboardLayout from './DashboardLayout';

export default function AppLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show home layout for non-authenticated users or when on home page
  if (!isAuthenticated) {
    return <HomeLayout>{children}</HomeLayout>;
  }

  // Show dashboard layout for authenticated users
  return <DashboardLayout>{children}</DashboardLayout>;
}
