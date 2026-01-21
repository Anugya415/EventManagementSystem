'use client';

import { useAuth } from './AuthContext';
import HomeLayout from './HomeLayout';
import DashboardLayout from './DashboardLayout';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse"></div>
          <Loader2 className="h-16 w-16 text-primary animate-spin relative" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-black tracking-tight text-foreground">Festify Protocol</h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Synchronizing Identity</p>
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
