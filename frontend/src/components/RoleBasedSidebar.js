'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Ticket,
  CreditCard,
  Bell,
  FileBarChart,
  TrendingUp,
  Settings,
  LogOut,
  Calendar,
  UserCircle,
  ShieldCheck,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

const navigationItems = {
  ADMIN: [
    { name: 'Console', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Directorship', href: '/users', icon: ShieldCheck },
    { name: 'Role Requests', href: '/admin/role-requests', icon: FileCheck },
    { name: 'Event Vault', href: '/events', icon: Calendar },
    { name: 'Ticket Sync', href: '/tickets', icon: Ticket },
    { name: 'Revenue', href: '/payments', icon: CreditCard },
    { name: 'Notifications', href: '/reminders', icon: Bell },
    { name: 'Intelligence', href: '/analytics', icon: TrendingUp },
    { name: 'System Settings', href: '/settings', icon: Settings },
  ],
  ORGANIZER: [
    { name: 'Console', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Events', href: '/events', icon: Calendar },
    { name: 'Manifest Attendees', href: '/attendees', icon: Users },
    { name: 'Ticket Flow', href: '/tickets', icon: Ticket },
    { name: 'Balance Sheet', href: '/payments', icon: CreditCard },
    { name: 'Automation', href: '/reminders', icon: Bell },
    { name: 'Yield Analysis', href: '/analytics', icon: TrendingUp },
  ],
  ATTENDEE: [
    { name: 'User Hub', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Active Events', href: '/my-events', icon: Calendar },
    { name: 'My Passports', href: '/my-tickets', icon: Ticket },
    { name: 'Ledger', href: '/payments', icon: CreditCard },
    { name: 'Identity Settings', href: '/profile', icon: UserCircle },
  ]
};

export default function RoleBasedSidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  const userRole = () => {
    if (!isAuthenticated) return 'GUEST';
    if (user.roles?.includes('ADMIN')) return 'ADMIN';
    if (user.roles?.includes('ORGANIZER')) return 'ORGANIZER';
    return 'ATTENDEE';
  };

  const role = userRole();
  const navigation = navigationItems[role] || [];

  return (
    <div className="w-72 min-h-screen glass-card border-none rounded-none border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen z-40 bg-white/5 dark:bg-black/10">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-xl">🎪</span>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground">Festify</h1>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/10 px-1.5 py-0 h-4">
            {role} Node
          </Badge>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2">Navigation Matrix</p>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`
                flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive ? 'premium-gradient text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'}
              `}>
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:rotate-6'}`} />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </div>
                {!isActive && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Profile Control */}
      {isAuthenticated && (
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="bg-primary/5 rounded-[2rem] p-4 flex items-center gap-4 border border-white/5">
            <Avatar className="w-12 h-12 border-2 border-white/10 ring-2 ring-primary/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
              <AvatarFallback className="bg-primary text-white font-black">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-foreground truncate">{user.name}</p>
              <p className="text-[10px] font-bold text-muted-foreground truncate uppercase">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive group/logout"
            >
              <LogOut className="w-5 h-5 group-hover/logout:-translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
