'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Menu, X, Rocket, Calendar, Info, Mail, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function TopNavigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Rocket },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between h-16 px-6 transition-all duration-500 rounded-2xl ${isScrolled ? 'glass bg-white/80 dark:bg-black/60 shadow-2xl backdrop-blur-xl' : 'bg-transparent'
          }`}>
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105">
            <div className="relative">
              <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all duration-500">
                <span className="text-xl">🎪</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse border-2 border-white dark:border-black"></div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Festify
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Elite Events
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Button variant="ghost" className="relative group text-sm font-medium transition-all duration-300 hover:bg-primary/5">
                  <link.icon className="w-4 h-4 mr-2 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 -translate-x-1/2 group-hover:w-full rounded-full"></span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth/Profile Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                      <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user?.name}`} />
                        <AvatarFallback className="premium-gradient text-white">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 mt-2 glass" align="end">
                    <DropdownMenuLabel className="flex flex-col p-3">
                      <span className="text-sm font-bold text-foreground">{user?.name}</span>
                      <span className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</span>
                      <Badge variant="outline" className="mt-2 w-fit bg-primary/5 text-primary border-primary/20 capitalize">
                        {user?.roles?.[0] || 'Member'}
                      </Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-3 cursor-pointer rounded-lg hover:bg-primary/5" onClick={() => router.push('/dashboard')}>
                      <LayoutDashboard className="w-4 h-4 mr-3 text-primary" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer rounded-lg hover:bg-primary/5" onClick={() => router.push('/profile')}>
                      <User className="w-4 h-4 mr-3 text-primary" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-3 cursor-pointer rounded-lg text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="hidden sm:block">
                  <Button onClick={() => router.push('/dashboard')} className="premium-gradient hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                    Console
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="premium-gradient hover:shadow-xl hover:shadow-primary/20 text-sm font-bold px-6">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 p-4 transition-all duration-300 origin-top transform ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 overflow-hidden'
        }`}>
        <div className="glass shadow-2xl rounded-2xl p-6 flex flex-col space-y-3 bg-white/90 dark:bg-black/80 backdrop-blur-2xl border border-white/20">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium py-6 rounded-xl">
                <link.icon className="w-5 h-5 mr-4 text-primary" />
                {link.name}
              </Button>
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-3 pt-4 pt-6 border-t border-primary/10">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full py-6 rounded-xl border-2">Login</Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full py-6 rounded-xl premium-gradient">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
