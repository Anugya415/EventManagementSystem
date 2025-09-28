'use client';

import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HomeLayout from './HomeLayout';
import DashboardLayout from './DashboardLayout';

export default function AppLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated and on the home page, redirect to dashboard
    if (isAuthenticated && window.location.pathname === '/') {
      router.push('/');
    }
  }, [isAuthenticated, router]);

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
